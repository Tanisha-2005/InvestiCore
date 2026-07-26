import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, Evidence, IOC, Report
from app.schemas.schemas import ReportGenRequest, ReportResponse
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Report Generator"])

@router.get("/case/{case_id}", response_model=List[ReportResponse])
async def list_case_reports(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Report).where(Report.case_id == case_id))
    return result.scalars().all()

@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    req: ReportGenRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve Case, Evidences, and IOCs
    case_res = await db.execute(select(Case).where(Case.id == req.case_id))
    case = case_res.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    ev_res = await db.execute(select(Evidence).where(Evidence.case_id == req.case_id))
    evidences = [e.__dict__ for e in ev_res.scalars().all()]

    ioc_res = await db.execute(select(IOC).where(IOC.case_id == req.case_id))
    iocs = [i.__dict__ for i in ioc_res.scalars().all()]

    output_dir = os.path.join(os.getcwd(), "generated_reports")
    os.makedirs(output_dir, exist_ok=True)
    
    file_name = f"report_{case.case_number}_{req.report_type}.{req.file_format}"
    output_path = os.path.join(output_dir, file_name)

    case_dict = {
        "case_number": case.case_number,
        "title": case.title,
        "victim_name": case.victim_name,
        "priority": case.priority,
        "status": case.status,
        "risk_score": case.risk_score,
        "summary_ai": case.summary_ai,
        "description": case.description
    }

    if req.file_format == "pdf":
        report_service.generate_pdf_report(output_path, case_dict, evidences, iocs)
    elif req.file_format == "docx":
        report_service.generate_docx_report(output_path, case_dict, evidences, iocs)
    else:
        report_service.generate_markdown_report(output_path, case_dict, evidences, iocs)

    new_report = Report(
        case_id=req.case_id,
        title=req.title,
        report_type=req.report_type,
        file_format=req.file_format,
        file_path=output_path,
        generated_by_id=current_user.id
    )
    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)

    return new_report

@router.get("/download/{report_id}")
async def download_report(
    report_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalars().first()
    if not report or not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found")
        
    return FileResponse(path=report.file_path, filename=os.path.basename(report.file_path))

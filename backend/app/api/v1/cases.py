from typing import List, Optional
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, Evidence, IOC
from app.schemas.schemas import CaseCreate, CaseUpdate, CaseResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/cases", tags=["Case Management"])

@router.get("/", response_model=List[CaseResponse])
async def list_cases(
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Case)
    if status_filter:
        query = query.where(Case.status == status_filter)
    if priority_filter:
        query = query.where(Case.priority == priority_filter)
    
    result = await db.execute(query.order_by(Case.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    case_in: CaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case_num = f"CASE-2026-{random.randint(1000, 9999)}"
    new_case = Case(
        case_number=case_num,
        title=case_in.title,
        description=case_in.description,
        victim_name=case_in.victim_name,
        priority=case_in.priority,
        status=case_in.status,
        tags=case_in.tags,
        created_by_id=current_user.id,
        assigned_investigator_id=case_in.assigned_investigator_id or current_user.id,
    )
    db.add(new_case)
    await db.commit()
    await db.refresh(new_case)
    return new_case

@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: str,
    case_in: CaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    for field, val in case_in.dict(exclude_unset=True).items():
        setattr(case, field, val)

    await db.commit()
    await db.refresh(case)
    return case

@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_case(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    await db.delete(case)
    await db.commit()

@router.post("/{case_id}/ai-summary", response_model=CaseResponse)
async def generate_ai_summary(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    ev_result = await db.execute(select(Evidence).where(Evidence.case_id == case_id))
    evidences = ev_result.scalars().all()
    ev_summaries = [e.summary_ai or e.file_name for e in evidences]

    ioc_result = await db.execute(select(IOC).where(IOC.case_id == case_id))
    iocs = [{"ioc_type": i.ioc_type, "value": i.value} for i in ioc_result.scalars().all()]

    ai_data = await ai_service.generate_case_summary_and_risk(
        case_title=case.title,
        evidence_summaries=ev_summaries,
        iocs=iocs
    )

    case.summary_ai = ai_data["summary"]
    case.risk_score = ai_data["risk_score"]
    case.mitre_attack_mapping = ai_data["mitre_attack"]

    await db.commit()
    await db.refresh(case)
    return case

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.storage import storage_service
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, Evidence, IOC, TimelineEvent
from app.schemas.schemas import EvidenceResponse
from app.services.evidence_service import evidence_service
from app.services.ioc_service import ioc_extractor
from app.services.vector_service import vector_service
from app.services.ai_service import ai_service

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

@router.get("/case/{case_id}", response_model=List[EvidenceResponse])
async def list_case_evidence(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Evidence).where(Evidence.case_id == case_id).order_by(Evidence.created_at.desc()))
    return result.scalars().all()

@router.post("/upload", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    case_id: str = Form(...),
    file_type: str = Form(...),  # image, pdf, email, pcap, memory, log, office, zip
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check case exists
    case_result = await db.execute(select(Case).where(Case.id == case_id))
    case = case_result.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    file_bytes = await file.read()
    file_size = len(file_bytes)

    # 1. Hashes
    md5_hash, sha1_hash, sha256_hash = evidence_service.calculate_hashes(file_bytes)

    # 2. Upload to Storage
    object_name = f"{case_id}/{str(uuid.uuid4())}_{file.filename}"
    file_path = storage_service.upload_file(object_name, file_bytes, file.content_type)

    # 3. Extract Text & Metadata
    extracted_text, metadata = evidence_service.extract_text(file_bytes, file.filename, file_type)

    # 4. AI Evidence Summary
    summary_ai = await ai_service.summarize_evidence(file.filename, file_type, extracted_text)

    # Save Evidence Record
    new_evidence = Evidence(
        case_id=case_id,
        file_name=file.filename,
        file_type=file_type,
        file_path=file_path,
        file_size=file_size,
        md5_hash=md5_hash,
        sha1_hash=sha1_hash,
        sha256_hash=sha256_hash,
        status="completed",
        extracted_text=extracted_text,
        metadata_json=metadata,
        summary_ai=summary_ai,
        uploaded_by_id=current_user.id,
    )
    db.add(new_evidence)
    await db.commit()
    await db.refresh(new_evidence)

    # 5. Extract IOCs automatically from text
    extracted_iocs = ioc_extractor.extract(extracted_text)
    for item in extracted_iocs:
        ioc = IOC(
            case_id=case_id,
            evidence_id=new_evidence.id,
            ioc_type=item["ioc_type"],
            value=item["value"],
            status="unverified"
        )
        db.add(ioc)

    # 6. Automatic Timeline Event Creation
    event = TimelineEvent(
        case_id=case_id,
        title=f"Evidence Uploaded: {file.filename}",
        description=f"Type: {file_type.upper()} | MD5: {md5_hash}",
        event_type="evidence_upload",
        source="System Parser"
    )
    db.add(event)
    await db.commit()

    # 7. Qdrant Vector Indexing
    await vector_service.index_evidence(new_evidence.id, case_id, file.filename, extracted_text)

    return new_evidence

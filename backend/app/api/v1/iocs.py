from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, IOC, Case
from app.schemas.schemas import IOCCreate, IOCResponse

router = APIRouter(prefix="/iocs", tags=["IOC Management"])

@router.get("/case/{case_id}", response_model=List[IOCResponse])
async def list_case_iocs(
    case_id: str,
    ioc_type: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(IOC).where(IOC.case_id == case_id)
    if ioc_type:
        query = query.where(IOC.ioc_type == ioc_type)
    if status_filter:
        query = query.where(IOC.status == status_filter)
        
    result = await db.execute(query.order_by(IOC.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=IOCResponse, status_code=status.HTTP_201_CREATED)
async def add_manual_ioc(
    ioc_in: IOCCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case_res = await db.execute(select(Case).where(Case.id == ioc_in.case_id))
    if not case_res.scalars().first():
        raise HTTPException(status_code=404, detail="Case not found")

    new_ioc = IOC(
        case_id=ioc_in.case_id,
        evidence_id=ioc_in.evidence_id,
        ioc_type=ioc_in.ioc_type,
        value=ioc_in.value,
        status=ioc_in.status,
        notes=ioc_in.notes
    )
    db.add(new_ioc)
    await db.commit()
    await db.refresh(new_ioc)
    return new_ioc

@router.put("/{ioc_id}/status", response_model=IOCResponse)
async def update_ioc_status(
    ioc_id: str,
    new_status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(IOC).where(IOC.id == ioc_id))
    ioc = result.scalars().first()
    if not ioc:
        raise HTTPException(status_code=404, detail="IOC not found")
        
    ioc.status = new_status
    await db.commit()
    await db.refresh(ioc)
    return ioc

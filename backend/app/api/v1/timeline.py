from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, TimelineEvent
from app.schemas.schemas import TimelineEventCreate, TimelineEventResponse

router = APIRouter(prefix="/timeline", tags=["Timeline Builder"])

@router.get("/case/{case_id}", response_model=List[TimelineEventResponse])
async def get_case_timeline(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(TimelineEvent)
        .where(TimelineEvent.case_id == case_id)
        .order_by(TimelineEvent.event_timestamp.asc())
    )
    return result.scalars().all()

@router.post("/", response_model=TimelineEventResponse)
async def add_timeline_event(
    event_in: TimelineEventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_event = TimelineEvent(
        case_id=event_in.case_id,
        title=event_in.title,
        description=event_in.description,
        event_timestamp=event_in.event_timestamp,
        event_type=event_in.event_type,
        source=event_in.source or "Manual Entry"
    )
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    return new_event

from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, IOC, Evidence
from app.services.vector_service import vector_service

router = APIRouter(prefix="/search", tags=["Global & Vector Search Engine"])

@router.get("/global")
async def global_search(
    q: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    if not q:
        return {"cases": [], "iocs": [], "evidences": [], "semantic": []}

    query_str = f"%{q}%"

    # 1. Keyword search cases
    case_res = await db.execute(select(Case).where(Case.title.ilike(query_str) | Case.description.ilike(query_str)))
    cases = [{"id": c.id, "title": c.title, "number": c.case_number, "type": "case"} for c in case_res.scalars().all()]

    # 2. Keyword search IOCs
    ioc_res = await db.execute(select(IOC).where(IOC.value.ilike(query_str)))
    iocs = [{"id": i.id, "type": i.ioc_type, "value": i.value, "status": i.status} for i in ioc_res.scalars().all()]

    # 3. Keyword search Evidences
    ev_res = await db.execute(select(Evidence).where(Evidence.file_name.ilike(query_str) | Evidence.extracted_text.ilike(query_str)))
    evidences = [{"id": e.id, "name": e.file_name, "file_type": e.file_type} for e in ev_res.scalars().all()]

    # 4. Qdrant Semantic Vector Search
    semantic_results = await vector_service.semantic_search(q, limit=5)

    return {
        "query": q,
        "cases": cases,
        "iocs": iocs,
        "evidences": evidences,
        "semantic_results": semantic_results
    }

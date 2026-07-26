from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, Evidence, IOC

router = APIRouter(prefix="/graph", tags=["Relationship Graph"])

@router.get("/case/{case_id}")
async def get_case_graph(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, List[Dict[str, Any]]]:
    nodes = []
    edges = []
    seen_nodes = set()

    # Case Node
    case_res = await db.execute(select(Case).where(Case.id == case_id))
    case = case_res.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    nodes.append({"data": {"id": case.id, "label": f"Case: {case.case_number}", "type": "case"}})
    seen_nodes.add(case.id)

    # Victim Node
    if case.victim_name:
        victim_id = f"victim_{case.id}"
        nodes.append({"data": {"id": victim_id, "label": f"Victim: {case.victim_name}", "type": "victim"}})
        edges.append({"data": {"id": f"e_v_{case.id}", "source": case.id, "target": victim_id, "label": "VICTIM"}})

    # Evidence Nodes
    ev_res = await db.execute(select(Evidence).where(Evidence.case_id == case_id))
    evidences = ev_res.scalars().all()
    for ev in evidences:
        nodes.append({"data": {"id": ev.id, "label": f"File: {ev.file_name}", "type": "evidence"}})
        edges.append({"data": {"id": f"e_ev_{ev.id}", "source": case.id, "target": ev.id, "label": "HAS_EVIDENCE"}})

    # IOC Nodes
    ioc_res = await db.execute(select(IOC).where(IOC.case_id == case_id))
    iocs = ioc_res.scalars().all()
    for ioc in iocs:
        ioc_node_id = f"ioc_{ioc.id}"
        nodes.append({"data": {"id": ioc_node_id, "label": f"{ioc.ioc_type.upper()}: {ioc.value[:20]}", "type": ioc.ioc_type, "status": ioc.status}})
        
        # Connect to Evidence or Case
        source_id = ioc.evidence_id if ioc.evidence_id else case.id
        edges.append({"data": {"id": f"e_ioc_{ioc.id}", "source": source_id, "target": ioc_node_id, "label": "EXTRACTED_IOC"}})

    return {"nodes": nodes, "edges": edges}

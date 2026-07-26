from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, Evidence, IOC
from app.schemas.schemas import AIChatRequest, AIRuleGenRequest
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Investigation Assistant"])

@router.post("/chat")
async def chat_assistant(
    body: AIChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case_res = await db.execute(select(Case).where(Case.id == body.case_id))
    case = case_res.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    ev_res = await db.execute(select(Evidence).where(Evidence.case_id == body.case_id))
    evidences = ev_res.scalars().all()
    ev_context = "\n".join([f"File: {e.file_name} Summary: {e.summary_ai or ''}" for e in evidences])

    ioc_res = await db.execute(select(IOC).where(IOC.case_id == body.case_id))
    iocs = ioc_res.scalars().all()
    ioc_context = "\n".join([f"IOC: {i.ioc_type} = {i.value} ({i.status})" for i in iocs])

    context = f"Case Title: {case.title}\nDescription: {case.description}\nEvidence:\n{ev_context}\nIOCs:\n{ioc_context}"
    response = await ai_service.chat_assistant(body.prompt, context)
    return {"reply": response}

@router.post("/generate-rule")
async def generate_detection_rule(
    body: AIRuleGenRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule_code = await ai_service.generate_rule(body.rule_type, body.artifact_text or "Windows Command Obfuscation Payload")
    return {"rule_type": body.rule_type, "generated_rule": rule_code}

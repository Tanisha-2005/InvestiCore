from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.v1.auth import get_current_user
from app.models.models import User
from app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])

class NotificationRequest(BaseModel):
    title: str
    message: str

@router.post("/send-slack")
async def trigger_slack_alert(
    req: NotificationRequest,
    current_user: User = Depends(get_current_user)
):
    success = await notification_service.send_slack_alert(req.message, req.title)
    return {"status": "sent" if success else "logged", "title": req.title}

import httpx
from typing import Dict, Any
from app.core.config import settings

class NotificationService:
    async def send_slack_alert(self, message: str, title: str = "High Risk Alert") -> bool:
        if not settings.SLACK_WEBHOOK_URL:
            print(f"[NotificationService] Slack Webhook URL not set. Alert: {title} - {message}")
            return False

        payload = {
            "text": f"*:warning: InvestiCore Platform Alert - {title}*\n{message}"
        }

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.post(settings.SLACK_WEBHOOK_URL, json=payload)
                return resp.status_code == 200
        except Exception as e:
            print(f"[NotificationService] Slack dispatch error: {e}")
            return False

notification_service = NotificationService()

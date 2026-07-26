from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User
from app.services.pcap_service import pcap_analyzer

router = APIRouter(prefix="/pcap", tags=["PCAP Analyzer"])

@router.post("/analyze")
async def analyze_pcap_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.lower().endswith(('.pcap', '.pcapng', '.cap')):
        raise HTTPException(status_code=400, detail="Invalid PCAP file format. Expected .pcap or .pcapng")

    pcap_bytes = await file.read()
    analysis_results = pcap_analyzer.analyze_pcap(pcap_bytes)
    return {"file_name": file.filename, "analysis": analysis_results}

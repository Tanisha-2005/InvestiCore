from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, IOC, ThreatIntelResult
from app.schemas.schemas import ThreatIntelResponse
from app.services.threat_intel_service import threat_intel_service

router = APIRouter(prefix="/threat-intel", tags=["Threat Intelligence Enrichment"])

@router.get("/ioc/{ioc_id}", response_model=List[ThreatIntelResponse])
async def get_ioc_threat_intel(
    ioc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(ThreatIntelResult).where(ThreatIntelResult.ioc_id == ioc_id))
    return result.scalars().all()

@router.post("/enrich/{ioc_id}", response_model=List[ThreatIntelResponse])
async def enrich_ioc(
    ioc_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(IOC).where(IOC.id == ioc_id))
    ioc = result.scalars().first()
    if not ioc:
        raise HTTPException(status_code=404, detail="IOC not found")

    results = []

    # 1. VirusTotal
    vt_res = await threat_intel_service.lookup_virustotal(ioc.value, ioc.ioc_type)
    results.append(vt_res)

    # 2. AbuseIPDB (IPs)
    if ioc.ioc_type == "ip":
        abuse_res = await threat_intel_service.lookup_abuseipdb(ioc.value)
        results.append(abuse_res)
        shodan_res = await threat_intel_service.lookup_shodan(ioc.value)
        results.append(shodan_res)

    # 3. AlienVault OTX
    otx_res = await threat_intel_service.lookup_otx(ioc.value, ioc.ioc_type)
    results.append(otx_res)

    # 4. URLScan (Domain/URL)
    if ioc.ioc_type in ["domain", "url"]:
        urlscan_res = await threat_intel_service.lookup_urlscan(ioc.value)
        results.append(urlscan_res)

    # 5. HIBP (Email)
    if ioc.ioc_type == "email":
        hibp_res = await threat_intel_service.lookup_hibp(ioc.value)
        results.append(hibp_res)

    # Save to Database
    db_results = []
    total_malicious = 0

    for r in results:
        res_obj = ThreatIntelResult(
            ioc_id=ioc.id,
            source=r.get("source"),
            summary=r.get("summary"),
            malicious_count=r.get("malicious_count", 0),
            total_count=r.get("total_count", 0),
            raw_response=r.get("raw_response", {})
        )
        db.add(res_obj)
        db_results.append(res_obj)
        total_malicious += r.get("malicious_count", 0)

    # Auto-flag status
    if total_malicious > 0:
        ioc.status = "malicious"
        ioc.threat_score = min(100, total_malicious * 20)
    else:
        ioc.status = "clean"

    await db.commit()
    for r in db_results:
        await db.refresh(r)

    return db_results

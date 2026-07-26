from app.tasks.celery_app import celery_app
from app.services.ioc_service import ioc_extractor
import time

@celery_app.task(name="process_heavy_evidence_task")
def process_heavy_evidence_task(evidence_id: str, file_path: str):
    print(f"[Celery Worker] Processing heavy evidence file: {evidence_id}")
    time.sleep(2)
    return {"status": "completed", "evidence_id": evidence_id}

@celery_app.task(name="bulk_threat_intel_enrichment_task")
def bulk_threat_intel_enrichment_task(case_id: str):
    print(f"[Celery Worker] Running bulk threat intel sweep for case: {case_id}")
    time.sleep(3)
    return {"status": "completed", "case_id": case_id}

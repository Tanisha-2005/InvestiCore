from typing import List, Dict, Any
import httpx
from app.core.config import settings
from app.core.qdrant import qdrant_service

class VectorService:
    def __init__(self):
        self.dimension = 3072

    async def get_embedding(self, text: str) -> List[float]:
        if not settings.OPENAI_API_KEY:
            # Fallback zero vector if key is not provided
            return [0.0] * self.dimension

        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.EMBEDDING_MODEL,
            "input": text[:8000]  # Truncate to match context limit
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post("https://api.openai.com/v1/embeddings", json=payload, headers=headers)
                if resp.status_code == 200:
                    return resp.json()["data"][0]["embedding"]
        except Exception as e:
            print(f"[VectorService] Embedding error: {e}")

        return [0.0] * self.dimension

    async def index_evidence(self, evidence_id: str, case_id: str, file_name: str, extracted_text: str):
        if not extracted_text:
            return
        vector = await self.get_embedding(extracted_text)
        payload = {
            "evidence_id": evidence_id,
            "case_id": case_id,
            "file_name": file_name,
            "text_snippet": extracted_text[:500]
        }
        qdrant_service.upsert_vector(point_id=evidence_id, vector=vector, payload=payload)

    async def semantic_search(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        query_vector = await self.get_embedding(query)
        return qdrant_service.search_vectors(query_vector=query_vector, limit=limit)

vector_service = VectorService()

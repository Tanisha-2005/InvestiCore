from typing import List, Dict, Any, Optional
from app.core.config import settings

try:
    from qdrant_client import QdrantClient
    from qdrant_client.models import VectorParams, Distance, PointStruct
    QDRANT_AVAILABLE = True
except ImportError:
    QDRANT_AVAILABLE = False

class QdrantService:
    def __init__(self):
        self.client = None
        self.memory_store: Dict[str, Dict[str, Any]] = {}
        
        if QDRANT_AVAILABLE:
            try:
                self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT, timeout=3.0)
                collections = [c.name for c in self.client.get_collections().collections]
                if settings.QDRANT_COLLECTION not in collections:
                    self.client.create_collection(
                        collection_name=settings.QDRANT_COLLECTION,
                        vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
                    )
            except Exception as e:
                print(f"[QdrantService] Qdrant server connection offline ({e}). In-memory vector store fallback active.")
                self.client = None

    def upsert_vector(self, point_id: str, vector: List[float], payload: Dict[str, Any]):
        if self.client:
            try:
                self.client.upsert(
                    collection_name=settings.QDRANT_COLLECTION,
                    points=[
                        PointStruct(
                            id=point_id,
                            vector=vector,
                            payload=payload,
                        )
                    ]
                )
                return True
            except Exception as e:
                print(f"[QdrantService] Upsert error: {e}")
        
        self.memory_store[point_id] = {"vector": vector, "payload": payload}
        return True

    def search_vectors(self, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        if self.client:
            try:
                results = self.client.search(
                    collection_name=settings.QDRANT_COLLECTION,
                    query_vector=query_vector,
                    limit=limit
                )
                return [{"id": hit.id, "score": hit.score, "payload": hit.payload} for hit in results]
            except Exception as e:
                print(f"[QdrantService] Search error: {e}")

        return [
            {"id": k, "score": 0.9, "payload": v["payload"]}
            for k, v in list(self.memory_store.items())[:limit]
        ]

qdrant_service = QdrantService()

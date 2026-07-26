from typing import Optional
from app.core.config import settings

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

class RedisService:
    def __init__(self):
        self.client = None
        self.memory_cache = {}
        
        if REDIS_AVAILABLE:
            try:
                self.client = redis.Redis(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    db=0,
                    decode_responses=True,
                    socket_timeout=2.0
                )
                self.client.ping()
            except Exception as e:
                print(f"[RedisService] Redis server connection offline ({e}). Memory cache fallback active.")
                self.client = None

    def get(self, key: str) -> Optional[str]:
        if self.client:
            try:
                return self.client.get(key)
            except Exception:
                pass
        return self.memory_cache.get(key)

    def set(self, key: str, value: str, ex: Optional[int] = 3600) -> bool:
        if self.client:
            try:
                return bool(self.client.set(key, value, ex=ex))
            except Exception:
                pass
        self.memory_cache[key] = value
        return True

redis_service = RedisService()

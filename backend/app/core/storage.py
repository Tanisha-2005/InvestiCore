import os
import io
from typing import Optional
from app.core.config import settings

try:
    from minio import Minio
    from minio.error import S3Error
    MINIO_AVAILABLE = True
except ImportError:
    MINIO_AVAILABLE = False

class StorageService:
    def __init__(self):
        self.minio_client = None
        self.local_upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(self.local_upload_dir, exist_ok=True)
        
        if MINIO_AVAILABLE:
            try:
                self.minio_client = Minio(
                    settings.MINIO_ENDPOINT,
                    access_key=settings.MINIO_ACCESS_KEY,
                    secret_key=settings.MINIO_SECRET_KEY,
                    secure=settings.MINIO_SECURE,
                )
                if not self.minio_client.bucket_exists(settings.MINIO_BUCKET_NAME):
                    self.minio_client.make_bucket(settings.MINIO_BUCKET_NAME)
            except Exception as e:
                print(f"[StorageService] MinIO unavailable ({e}). Local disk storage at {self.local_upload_dir}")
                self.minio_client = None
        else:
            print(f"[StorageService] MinIO module not installed. Local disk storage active at {self.local_upload_dir}")

    def upload_file(self, object_name: str, file_data: bytes, content_type: str = "application/octet-stream") -> str:
        if self.minio_client:
            try:
                data_stream = io.BytesIO(file_data)
                self.minio_client.put_object(
                    settings.MINIO_BUCKET_NAME,
                    object_name,
                    data_stream,
                    length=len(file_data),
                    content_type=content_type,
                )
                return f"minio://{settings.MINIO_BUCKET_NAME}/{object_name}"
            except Exception as e:
                print(f"[StorageService] MinIO put error: {e}. Falling back to local disk.")

        # Local storage fallback
        file_path = os.path.join(self.local_upload_dir, object_name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(file_data)
        return file_path

    def get_file(self, object_name: str) -> Optional[bytes]:
        if self.minio_client:
            try:
                response = self.minio_client.get_object(settings.MINIO_BUCKET_NAME, object_name)
                return response.read()
            except Exception:
                pass

        file_path = os.path.join(self.local_upload_dir, object_name)
        if os.path.exists(file_path):
            with open(file_path, "rb") as f:
                return f.read()
        return None

storage_service = StorageService()

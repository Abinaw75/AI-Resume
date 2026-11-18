
from supabase import create_client

from app.core.config import settings


supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)


def upload_resume(
    file_path: str,
    file_content: bytes,
    content_type: str
):
    return supabase.storage.from_(
        settings.SUPABASE_BUCKET
    ).upload(
        path=file_path,
        file=file_content,
        file_options={
            "content-type": content_type,
            "upsert": "false"
        }
    )


def delete_resume(file_path: str):
    return supabase.storage.from_(
        settings.SUPABASE_BUCKET
    ).remove([file_path])

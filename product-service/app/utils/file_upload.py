import os
from uuid import uuid4
from fastapi import UploadFile

UPLOAD_DIR = "uploads"

async def save_image(file: UploadFile) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    filename = f"{uuid4()}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    return f"/uploads/{filename}"
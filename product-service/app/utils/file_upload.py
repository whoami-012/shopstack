import os
from uuid import uuid4
from fastapi import UploadFile
from pathlib import Path

# Define base directory (product-service root)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

async def save_image(file: UploadFile) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    filename = f"{uuid4()}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    return f"/uploads/{filename}"
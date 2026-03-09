import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1 import products

# Define base directory (product-service root)
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

# Ensure the directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Product Service")
app.include_router(products.router)

# Mount the static directory with absolute path
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.get("/")
async def root():
    return {"service": "product-service", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}

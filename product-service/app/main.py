from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1 import products
import os

app = FastAPI(title="Product Service")
app.include_router(products.router)

#Ensure the directory exists
os.makedirs("uploads", exist_ok=True)

# Mount the static directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"service": "product-service", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}

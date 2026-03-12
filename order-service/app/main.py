from fastapi import FastAPI

from app.api.v1.orders import router as orders_router


app = FastAPI(title="Order Service")
app.include_router(orders_router)


@app.get("/")
async def root():
    return {"message": "Order service is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.carts import router as cart_router

app = FastAPI(
    title="Cart Service",
    description="Microservice for managing user shopping carts",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the Cart API router
app.include_router(cart_router)

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "service": "cart-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)

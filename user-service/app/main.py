from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, update, delete, change_password, admin_users
from app.api import dependencies
from contextlib import asynccontextmanager
from app.events.publisher import connection_pool, channel_pool

@asynccontextmanager
async def lifespan(app):
    yield
    await channel_pool.close()
    await connection_pool.close()

app = FastAPI(title="User Service", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(dependencies.router)
app.include_router(update.router)
app.include_router(delete.router)
app.include_router(change_password.router)
app.include_router(admin_users.router)

@app.get("/")
async def root():
    return {"service": "user-service", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}

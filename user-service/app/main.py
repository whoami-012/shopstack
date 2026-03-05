from fastapi import FastAPI
from app.api.v1 import users, update, delete, change_password, admin_users
from app.api import dependencies
from contextlib import asynccontextmanager
from app.events.publisher import connection_pool, channel_pool

app = FastAPI(title="User Service")
app.include_router(users.router)
app.include_router(dependencies.router)
app.include_router(update.router)
app.include_router(delete.router)
app.include_router(change_password.router)
app.include_router(admin_users.router)

@asynccontextmanager
async def lifespan(app):
    yield
    await channel_pool.close()
    await connection_pool.close()
    app = FastAPI(title="User Service", lifespan=lifespan)

@app.get("/")
async def root():
    return {"service": "user-service", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}

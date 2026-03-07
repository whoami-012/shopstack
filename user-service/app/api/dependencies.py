from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import AsyncSessionLocal
from app.repos.user_repo import UserRepo
from app.utils.security import decode_token
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter(prefix="/api", tags=["dependencies"])
security = HTTPBearer()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def require_admin(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    token = credentials.credentials
    
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    repo = UserRepo(db)
    user = await repo.get_by_id(user_id)

    if not user or not user.is_active or user.role != "admin":
        raise HTTPException(status_code=403, detail="403 Forbidden")
    
    return user

@router.get("/admin-only", dependencies=[Depends(require_admin)])
async def admin_only():
    return {"ok": True}

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    token = credentials.credentials
    
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = await UserRepo(db).get_by_id(user_id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=401, detail="User account is inactive")
    
    return user

@router.get("/me", response_model=UserRead, dependencies=[Depends(get_current_user)])
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

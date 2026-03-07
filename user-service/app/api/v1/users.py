from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate, UserRead, UserLogin, Token
from app.repos.user_repo import UserRepo
from app.services.auth import AuthService
from app.api.dependencies import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepo(db)
    
    existing_username = await repo.get_by_username(payload.username)    
    if existing_username:
        raise HTTPException(status_code=409, detail="Username already registered")
    
    existing = await repo.get_by_email(payload.email)    
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    allowed = {"user", "seller"}
    if payload.role not in allowed:
        raise HTTPException(status_code=400, detail="choose a valid account type")
    role = payload.role
    svc = AuthService(repo)
    user = await svc.register(payload.username, payload.email, payload.password, payload.role, db)
    return user

@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    repo = UserRepo(db)
    svc = AuthService(repo)
    token = await svc.login(payload.email, payload.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token}

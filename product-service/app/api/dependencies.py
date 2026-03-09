from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_token
from app.db.database import get_db

router = APIRouter(prefix="/api", tags=["dependencies"])
security = HTTPBearer()

async def require_seller_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = decode_token(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    if role not in {"seller", "admin"}:
        raise HTTPException(status_code=403, detail="403 Forbidden")
    
    return {"id": user_id, "role": role}

@router.get("/seller-only", dependencies=[Depends(require_seller_id)])
async def seller_only():
    return {"ok": True}

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = decode_token(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    role = payload.get("role")
    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return {"id": user_id, "role": role}


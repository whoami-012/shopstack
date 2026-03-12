from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, ExpiredSignatureError
from pydantic import BaseModel
from app.utils.security import decode_token

router = APIRouter(prefix="/api", tags=["dependencies"])
security = HTTPBearer()

class CurrentUser(BaseModel):
    user_id: str
    role: str | None = None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    ) -> CurrentUser:
    token = credentials.credentials

    try:
        payload = decode_token(token)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return CurrentUser(user_id=user_id, role=role)

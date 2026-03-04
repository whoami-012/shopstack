from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_current_user, get_db
from app.schemas.user import UserRead, ChangePasswordRequest
from app.models.user import User
from app.utils.security import verify_password, hash_password

router = APIRouter(prefix="/users", tags=["change-password"])

class Message(BaseModel):
    message: str

@router.put("/me/change-password", response_model= Message)
async def change_password(payload: ChangePasswordRequest, current_user: User = Depends (get_current_user), db: AsyncSession = Depends(get_db)):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=403, detail="Incorrect password")
    current_user.password_hash = hash_password(payload.new_password)
    
    await db.commit()

    return {"message": "Password updated successfully"}
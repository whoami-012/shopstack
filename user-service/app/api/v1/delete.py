from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_current_user, get_db
from app.schemas.user import DeleteAccountRequest
from app.models.user import User
from app.utils.security import verify_password

router = APIRouter(prefix="/users", tags=["delete"])

class Message(BaseModel):
    message: str

@router.delete("/me", response_model=Message)
async def delete_account(
    payload: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not verify_password(payload.password, current_user.password_hash):
        raise HTTPException(status_code=403, detail="Incorrect password")

    current_user.is_active = False
    #await db.delete(current_user)
    await db.commit()

    return {"message": "Account deleted Successfully"}

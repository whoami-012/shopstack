from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_current_user, get_db
from app.schemas.user import DeleteAccountRequest
from app.models.user import User
from app.utils.security import verify_password
from app.events.publisher import publish_event
from datetime import datetime
import logging

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

    current_user.deleted_at = datetime.utcnow()
    current_user.is_active = False
    await db.commit()
    await db.refresh(current_user)
    try:
        await publish_event("user.deleted", {"user_id": str(current_user.id), 
                                             "email": current_user.email,
                                               "deleted_time": current_user.deleted_at.isoformat(),
                                                 "is_active": bool(current_user.is_active)}
                                                 )
    except Exception as e:
        logging.getLogger(__name__).warning("user.deleted publish failed: %s", e) 
    return {"message": "Account deleted Successfully"}


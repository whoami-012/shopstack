from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_current_user, get_db
from app.schemas.user import UserRead, UserUpdate
from app.models.user import User

router = APIRouter(prefix="/users", tags=["update"])

@router.put("/me", response_model= UserRead)
async def user_update(payload: UserUpdate, current_user: User = Depends (get_current_user), db: AsyncSession = Depends(get_db)):
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nothing to update")
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    await db.commit()
    await db.refresh(current_user)
    return current_user
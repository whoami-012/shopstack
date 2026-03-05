from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_current_user, get_db
from app.schemas.user import UserRead, UserUpdate
from app.models.user import User
import logging
from app.events.publisher import publish_event
from app.repos.user_repo import UserRepo

router = APIRouter(prefix="/users", tags=["update"])

@router.put("/me", response_model= UserRead)
async def user_update(payload: UserUpdate, current_user: User = Depends (get_current_user), db: AsyncSession = Depends(get_db)):
    update_data = payload.model_dump(exclude_unset=True)
    
    repo = UserRepo(db)    
    if "username" in update_data:
        u = await repo.get_by_username(update_data["username"])

        if u and u.id != current_user.id:
            raise HTTPException(status_code=409, detail="Username already taken")
    
    if "email" in update_data:
        u = await repo.get_by_email(update_data["email"])
        if u and u.id != current_user.id:
            raise HTTPException(status_code=409, detail="Email already registered")
        
    if not update_data:
        raise HTTPException(status_code=400, detail="Nothing to update")
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    await db.commit()
    await db.refresh(current_user)
    try:
        await publish_event("user.updated", {"user_id": str(current_user.id), "username": str(current_user.username), "email": current_user.email, "updated_time": str(current_user.updated_at)})
    except Exception as e:
        logging.getLogger(__name__).warning("user.updated publish failed: %s", e)      
    return current_user
from app.schemas.user import AdminUserUpdate
from fastapi import Depends, APIRouter, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import require_admin, get_db
from app.schemas.user import UserRead
from app.models.user import User
from app.repos.user_repo import UserRepo
from uuid import UUID
from typing import List as TypingList

router = APIRouter(prefix="/admin/users", tags=["admin"])

# recieving all users
@router.get("", response_model=TypingList[UserRead], dependencies=[Depends(require_admin)]) 
async def list_users(db: AsyncSession = Depends(get_db),
                     limit: int = Query(20, ge=1, le=100),
                     offset: int = Query(0, ge=0),
                     ):
    result = await db.execute(select(User).limit(limit).offset(offset))
    users = result.scalars().all()
    return users

# recieving users by thier id
@router.get("/{id}", response_model=UserRead, dependencies=[Depends(require_admin)])
async def get_user(id: UUID, db: AsyncSession = Depends(get_db)):
    user = await UserRepo(db).get_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# udpate datas of users
@router.patch ("/{id}", response_model=UserRead, dependencies=[Depends(require_admin)])
async def update_data(id: UUID, payload: AdminUserUpdate, db: AsyncSession = Depends(get_db)):
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nothing to update")
    user = await UserRepo(db).get_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
# block removing admin status or deactivating the last active admin
    will_remove_admin = ("role" in update_data and update_data["role"] != "admin")
    will_deactivate = ("is_active" in update_data and update_data["is_active"] is False)
    if (will_remove_admin or will_deactivate) and user.role == "admin" and user.is_active:
        admin_count = await db.scalar(select(func.count()).select_from(User).where(User.role == "admin", User.is_active == True))
        if admin_count == 1:
            raise HTTPException(status_code=400, detail="Cannot demote the last active admin")  
    
    if "role" in update_data and update_data["role"] not in {"user", "seller", "admin"}:
        raise HTTPException(status_code=400, detail="not in allowed roles!")
    if not update_data:
        raise HTTPException(status_code=400, detail="Nothing to update")    
    
    for key, value in update_data.items():
        setattr(user, key, value)

    
    await db.commit()
    await db.refresh(user)
    return user

@router.patch ("/{id}/promote", response_model=UserRead, dependencies=[Depends(require_admin)])
async def promote_user(id: UUID, db: AsyncSession = Depends(get_db)):
    user = await UserRepo(db).get_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "admin":
        return user
    
    user.role = "admin"
    await db.commit()
    await db.refresh(user)
    return user

@router.delete ("/{id}", response_model=UserRead, dependencies=[Depends(require_admin)])
async def delete_user(id: UUID, db: AsyncSession = Depends(get_db)):
    user = await UserRepo(db).get_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    admin_count = await db.scalar(select(func.count()).select_from(User).where(User.role == "admin", User.is_active == True))
    if user.role == "admin" and user.is_active and admin_count == 1:
        raise HTTPException(status_code=400, detail="Cannot demote the last active admin")
    
    user.is_active = False # Soft delete
    await db.commit()
    await db.refresh(user)
    return user

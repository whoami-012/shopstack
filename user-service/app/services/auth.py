from app.repos.user_repo import UserRepo
from app.utils.security import hash_password, verify_password, create_access_token
from app.events.publisher import publish_event
from sqlalchemy.ext.asyncio import AsyncSession
import logging

class AuthService:
    def __init__(self, repo: UserRepo):
        self.repo = repo

    async def register(self, username, email, password, role: str, db: AsyncSession):
        ph = hash_password(password)
        u = await self.repo.create(username=username, email=email, password_hash=ph, role=role)
        
        await db.commit()
        await db.refresh(u)
        try:
            await publish_event("user.created", {"user_id": str(u.id), "email": u.email})
        except Exception as e:
            logging.getLogger(__name__).warning("user.created publish failed: %s", e)
        return u

    async def login(self, email, password):
        user = await self.repo.get_by_email(email)
        if not user or not user.is_active or not verify_password(password, user.password_hash):
            return None
        token = create_access_token(sub=str(user.id), role=user.role)
        
        try:
            await publish_event("user.logged.in", {"user_id": str(user.id), "email": user.email})
        except Exception as e:
            logging.getLogger(__name__).warning("user.logged.in publish failed: %s", e)        
        return token

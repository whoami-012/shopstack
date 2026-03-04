from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from typing import Optional
from uuid import UUID

class UserRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, username: str, email: str, password_hash: str, role: str = "user") -> User:
        u = User(username=username, email=email, password_hash=password_hash, role=role)
        self.session.add(u)
        await self.session.flush()
        return u

    async def get_by_email(self, email: str) -> Optional[User]:
        q = await self.session.execute(select(User).where(User.email == email))
        return q.scalars().first()

    async def get_by_id(self, id_: UUID) -> Optional[User]:
        q = await self.session.execute(select(User).where(User.id == id_))
        return q.scalars().first()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        q = await self.session.execute(select(User).where(User.username == username))
        return q.scalars().first()
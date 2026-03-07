from app.repos.product_repo import ProductRepo
from app.utils.security import hash_password, verify_password, create_access_token
from app.models.product import Product
from sqlalchemy.ext.asyncio import AsyncSession
import logging

class AuthService:
    def __init__(self, repo: ProductRepo):
        self.repo = repo

    async def add_product(self, name, price, stock, description: str, db: AsyncSession):
        p = await self.repo.create(name=name, category=category, price=price, stock=stock, description=description)
        await db.commit()
        await db.refresh(p)
        #try:
        #    await publish_event("user.created", {"user_id": str(u.id), "email": u.email})
        #except Exception as e:
        #   logging.getLogger(__name__).warning("user.created publish failed: %s", e)
        return p
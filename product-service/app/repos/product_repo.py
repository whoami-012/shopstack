from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product
from fastapi import Query
from typing import Optional
from uuid import UUID
from collections.abc import Sequence

class ProductRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, name: str, category: str, price: float, stock: int, description: str, image_url: str, seller_id: UUID) -> Product:
        p = Product(name=name, category=category, price=price, stock=stock, description=description, image_url=image_url, seller_id=seller_id)
        self.session.add(p)
        await self.session.flush()
        return p
    
    async def get_by_product_id(self, id_: UUID) -> Optional[Product]:
        q = await self.session.execute(select(Product).where(Product.id == id_))
        return q.scalars().first()
    
    async def get_by_product_name(self, name: str) -> Optional[Product]:
        q = await self.session.execute(select(Product).where(Product.name == name))
        return q.scalars().first()
    
    async def get_by_product_category(self, category: str) -> Optional[Product]:
        q = await self.session.execute(select(Product).where(Product.category == category))
        return q.scalars().first()    
    
    async def get_stock(self, stock: int) -> Optional[Product]:
        q = await self.session.execute(select(Product).where(Product.stock == stock))
        return q.scalars().first()

    async def list_products(
        self,
        *,
        search: str | None = None,
        category: str | None = Query(default=None),
        ids: Sequence[UUID] | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Product]:
        stmt = select(Product).order_by(Product.created_at.desc()).limit(limit).offset(offset)

        if search:
            stmt = stmt.where(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.category.ilike(f"%{search}%")
                    )
            )

        if ids:
            stmt = stmt.where(Product.id.in_(ids))

        q = await self.session.execute(stmt)
        return list(q.scalars().all())

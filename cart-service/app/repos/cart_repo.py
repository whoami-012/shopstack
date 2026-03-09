from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.cart import Cart, CartItem
from typing import Optional, Any
from uuid import UUID

class CartRepo:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_or_create_cart(self, user_id: UUID) -> Cart:
        # Check for existing cart
        q = await self.session.execute(select(Cart).where(Cart.user_id == user_id))
        cart = q.scalar_one_or_none()
        if not cart:
            cart = Cart(user_id=user_id)
            self.session.add(cart)
            await self.session.flush() # Get the ID
        return cart
    
    async def add_item(self, user_id: UUID, product_id: UUID, quantity: int, name: Optional[str] = None) -> CartItem:
        cart = await self.get_or_create_cart(user_id)

        # Check if product already exists in this cart
        q = await self.session.execute(
            select(CartItem).where(
                CartItem.cart_id == cart.id,
                CartItem.product_id == product_id
            )
        )
        item = q.scalar_one_or_none()

        if item:
            item.quantity += quantity
            if name: # Update name if provided
                item.name = name
        else:
            item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity, name=name)
            self.session.add(item)

        await self.session.flush()
        return item
        
    async def get_by_cart_item_id(self, item_id: UUID) -> Optional[CartItem]:
        result = await self.session.execute(
            select(CartItem).where(CartItem.id == item_id)
            )
        return result.scalar_one_or_none()
    
    async def get_cart(self, user_id: UUID) -> Optional[Cart]:
        result = await self.session.execute(
            select(Cart).where(Cart.user_id == user_id)
            .options(selectinload(Cart.items)) # Efficiently load items
            )
        return result.scalar_one_or_none()
    
    async def update(self, db_obj: Any, update_data: dict):
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await self.session.flush()
        return db_obj
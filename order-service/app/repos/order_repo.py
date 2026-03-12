from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.order import Order, OrderItem
from typing import Optional, Any
from uuid import UUID

class OrderRepo:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_order(self, user_id: UUID, total_amount: float) -> Order:
        order = Order(user_id=user_id, total_amount=total_amount, status="PENDING_PAYMENT")
        self.session.add(order)
        await self.session.flush()
        return order
    
    async def create_order_item( self, order_id: UUID, product_id: UUID, product_name: str, price: float, quantity: int) -> OrderItem:
        
        subtotal = price * quantity

        item = OrderItem(order_id=order_id, product_id=product_id, product_name=product_name, price=price, quantity=quantity, subtotal=subtotal)

        self.session.add(item)
        await self.session.flush()

        return item
    
    async def get_order(self, order_id: UUID) -> Order | None:
        result = await self.session.execute(
            select(Order).where(Order.id == order_id)
            .options(selectinload(Order.items))
        )
        return result.scalar_one_or_none()
    
    async def get_orders_by_user(self, user_id: UUID) -> Order | None:
        result = await self.session.execute(
            select(Order).where(Order.user_id == user_id)
            .options(selectinload(Order.items))
            .order_by(Order.created_at.desc())
        )
        return result.scalar_one_or_none()
    
    async def update_order_status(self, order_id: UUID, status: str) -> Order | None:
        order = await self.get_order(order_id)
        if not order:
            return None
        
        order.status = status
        await self.session.flush()
        return order
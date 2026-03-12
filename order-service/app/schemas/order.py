from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from enum import Enum

class OrderStatus(str, Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)

class OrderItemRead(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    price: float
    quantity: int
    subtotal: float
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: list[OrderItemCreate]

class OrderRead(BaseModel):
    id: UUID
    user_id: UUID
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemRead]

    class Config:
        from_attributes = True

class OrderList(BaseModel):
    orders: list[OrderRead]







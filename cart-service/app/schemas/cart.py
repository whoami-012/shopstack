from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class CartItemCreate(BaseModel):
    product_id: UUID
    name: Optional[str] = None
    quantity: int = Field(gt=0)

class CartItemQuantityUpdate(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)

class DeleteItem(BaseModel):
    product_id: UUID

class CartItemRead(BaseModel):
    id: UUID
    cart_id: UUID
    product_id: UUID
    name: Optional[str] = None
    quantity: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CartRead(BaseModel):
    id: Optional[UUID] = None
    user_id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    items: list[CartItemRead] = []

    class Config:
        from_attributes = True

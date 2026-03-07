from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.category import ProductCategory
from uuid import UUID

class ProductCreate(BaseModel):
    name: str
    category: ProductCategory
    stock: int
    price: float
    description: str
    image_url: Optional[str] = None

class ProductRead(BaseModel):
    id: UUID = Field(alias="id")
    name: str
    category: str
    stock: int
    price: float
    description: str
    created_at: Optional[datetime]
    image_url: Optional[str] = None
    class Config:
        from_attributes = True
        populate_by_name = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class DeleteProductRequest(BaseModel):
    name: str
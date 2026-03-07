from sqlalchemy import Column, Enum as SQLEnum, Integer, String, Text, Numeric, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.models.category import ProductCategory
import uuid
from .base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=True)
    category = Column(SQLEnum(ProductCategory, native_enum=False), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    seller_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    image_url = Column(String(255), nullable=True)
    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )

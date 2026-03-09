from sqlalchemy import Column, UniqueConstraint, ForeignKey, Integer, DateTime, func, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)     
    created_at = Column(DateTime(timezone=True),server_default=func.now(),index=True)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    items = relationship("CartItem", back_populates="cart", cascade="all, delete")
    
class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.id", ondelete="CASCADE"), nullable=False, index=True)  
    product_id = Column(UUID(as_uuid=True), nullable=False, index=True)  
    name = Column(String, nullable=True) # Added name field
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),index=True)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    cart = relationship("Cart", back_populates="items")

    __table_args__ = (
        UniqueConstraint(
            "cart_id",
            "product_id",
            name="unique_cart_product"
        ),
    )
from fastapi import FastAPI, APIRouter, Depends, Query, status
from pydantic import BaseModel, Field
from typing import Optional, Sequence
from datetime import datetime
from uuid import UUID
import uuid

# Mock schemas
class ProductCreate(BaseModel):
    name: str
    stock: int
    price: float
    description: str

class ProductRead(BaseModel):
    id: UUID = Field(alias="id")
    name: str
    stock: int
    price: float
    description: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
        populate_by_name = True

# Mock repo
class ProductRepo:
    def __init__(self, session):
        pass
    async def list_products(self, *, search=None, ids=None, limit=20, offset=0):
        return []

# Mock dependencies
async def get_db():
    yield None

async def get_current_user():
    return {}

# Router
router = APIRouter(prefix="/products", tags=["products"])

@router.post("/add", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def add_product(payload: ProductCreate, db = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return None

@router.get("list", response_model=list[ProductRead])
async def list_products(
    db = Depends(get_db),
    search: str | None = Query(default=None),
    ids: list[UUID] | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    repo = ProductRepo(db)
    return await repo.list_products(search=search, ids=ids, limit=limit, offset=offset)

@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: UUID, db = Depends(get_db)):
    return None

# App
app = FastAPI(title="Product Service")
app.include_router(router)

if __name__ == "__main__":
    import json
    print(json.dumps(app.openapi(), indent=2))

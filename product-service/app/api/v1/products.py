from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.repos.product_repo import ProductRepo
from app.api.dependencies import get_current_user, get_db
from app.utils.file_upload import save_image
from uuid import UUID

router = APIRouter(prefix="/products", tags=["products"])

@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def add_product(payload: ProductCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user),
                      ):
    repo = ProductRepo(db)
    allowed_roles = {"admin", "seller"}
    if current_user["role"] not in allowed_roles:
        raise HTTPException (status_code=403, detail="Forbidden")
    
    product = await repo.create(
        payload.name,
        payload.category,
        payload.price,
        payload.stock,
        payload.description,
        image_url=payload.image_url, 
        seller_id=UUID(current_user["id"]),
    )
    await db.commit()
    await db.refresh(product)
    return product

@router.post("/upload-image")
async def upload_product_image(file: UploadFile = File(...)):
     if not file.content_type.startswith("image/"):
         raise HTTPException(status_code=400, detail="File must be an image")
     file_path = await save_image(file)
     return {"image_url": file_path}

@router.get("", response_model=list[ProductRead])
async def list_products(
    db: AsyncSession = Depends(get_db),
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    ids: list[UUID] | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    repo = ProductRepo(db)
    product = await repo.list_products(search=search, category=category, ids=ids, limit=limit, offset=offset)
    return product

@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: UUID, db: AsyncSession = Depends(get_db)):
    repo = ProductRepo(db)
    product = await repo.get_by_product_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductRead)
async def update_details(product_id: UUID, payload: ProductUpdate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    repo = ProductRepo(db)
    product = await repo.get_by_product_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if current_user["role"] != "admin" and product.seller_id != UUID(current_user["id"]):
        raise HTTPException(status_code=403, detail="You do not have permission to edit this product")
    
    update_data = payload.model_dump(exclude_unset=True)
    
    await repo.update(product, update_data)

    await db.commit()
    await db.refresh(product)

    return product
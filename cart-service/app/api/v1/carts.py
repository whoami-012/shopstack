from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.cart import CartItemCreate, CartItemRead, CartRead, CartItemQuantityUpdate
from app.repos.cart_repo import CartRepo
from app.api.dependencies import get_current_user
from app.db.database import get_db
from uuid import UUID

router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/items", response_model=CartItemRead, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    payload: CartItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    
    repo = CartRepo(db)
    # add_item handles cart lookup/creation and quantity logic
    item = await repo.add_item(
        user_id=current_user["id"],
        product_id=payload.product_id,
        quantity=payload.quantity,
        name=payload.name
    )
    await db.commit()
    await db.refresh(item)
    return item

@router.put("/items", response_model=CartItemRead)
async def update_item_quantity(
    payload: CartItemQuantityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = CartRepo(db)
    cart = await repo.get_cart(user_id=current_user["id"])
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Find item by product_id within the user's cart
    item = next((i for i in cart.items if i.product_id == payload.product_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Product not in cart")
    
    await repo.update(item, payload.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(item)
    return item

@router.get("/items", response_model=CartRead)
async def get_cart(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = CartRepo(db)
    cart = await repo.get_cart(user_id=current_user["id"])
    if not cart:
        # Return empty cart rather than 404
        return {"id": None, "user_id": current_user["id"], "items": []}
    return cart

@router.delete("/items/{item_id}", response_model=CartItemRead)
async def delete_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = CartRepo(db)
    # 1. Fetch the user's specific cart
    cart = await repo.get_cart(user_id=current_user["id"])
    
    # 2. Safety: If the user has no cart, stop here
    if not cart:
        raise HTTPException(status_code=404, detail="Item not found")

    # 3. Search the user's private list for the specific ID
    target_item = next((item for item in cart.items if item.id == item_id), None)
    
    # 4. If not found in the user's cart, it's either non-existent or someone else's
    if target_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # 5. Execute the delete and commit
    await db.delete(target_item)
    await db.commit()
    
    # 6. Return the object to match the response_model (CartItemRead)
    return target_item

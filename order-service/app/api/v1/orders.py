from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.order import OrderCreate, OrderRead
from app.repos.order_repo import OrderRepo
from app.api.dependencies import get_current_user, CurrentUser
from app.config import settings
from app.db.database import get_db
import httpx
from uuid import UUID

router = APIRouter(prefix="/orders", tags=["orders"])

async def reserve_product_stock(product_id: UUID, quantity: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{settings.PRODUCT_SERVICE_URL}/products/{product_id}/reserve",
                                     json={"quantity": quantity},
                                     )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
        
        if response.status_code == 409:
            raise HTTPException(status.HTTP_409_CONFLICT, detail=f"Insufficient stock for product {product_id}")
        response.raise_for_status()
        return response.json()

@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    reserved_items = []
    total_amount = 0.0

    for item in payload.items:
        reserved = await reserve_product_stock(item.product_id, item.quantity)

        subtotal = float(reserved["price"]) * item.quantity

        reserved_items.append({
            "product_id": UUID(reserved["product_id"]),
            "product_name": reserved["product_name"],
            "price": float(reserved["price"]),
            "quantity": item.quantity,
        })

        total_amount += subtotal


    repo = OrderRepo(db)
    try:
        order = await repo.create_order(
        user_id=UUID(current_user.user_id),
        total_amount=total_amount,
    )
        for item in reserved_items:
            await repo.create_order_item(
                order_id=order.id,
                product_id=item["product_id"],
                product_name=item["product_name"],
                price=item["price"],
                quantity=item["quantity"],
            )
        await db.commit()

    except Exception:
        await db.commit()

        for item in reserved_items:
            await release_product_stock(item["product_id"], item["quantity"])
        raise

    created_order = await repo.get_order(order.id)
    if not created_order:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load created order",
        )
    return created_order

async def release_product_stock(product_id: UUID, quantity: int) -> None:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.PRODUCT_SERVICE_URL}/products/{product_id}/release",
            json={"quantity": quantity},
        )
        response.raise_for_status()
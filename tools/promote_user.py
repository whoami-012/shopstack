import argparse
import asyncio

from app.db.database import AsyncSessionLocal
from app.repos.user_repo import UserRepo


async def promote(email: str) -> None:
    async with AsyncSessionLocal() as session:
        repo = UserRepo(session)
        user = await repo.get_by_email(email)
        if not user:
            print(f"User not found: {email}")
            return

        user.role = "admin"
        await session.commit()
        print(f"Promoted to admin: {user.email}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Promote a user to admin by email")
    parser.add_argument("--email", required=True, help="User email to promote")
    args = parser.parse_args()
    asyncio.run(promote(args.email))


if __name__ == "__main__":
    main()

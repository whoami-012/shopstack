from app.repos.user_repo import UserRepo
from app.utils.security import hash_password, verify_password, create_access_token

class AuthService:
    def __init__(self, repo: UserRepo):
        self.repo = repo

    async def register(self, username, email, password):
        ph = hash_password(password)
        u = await self.repo.create(username=username, email=email, password_hash=ph, role="user")
        return u

    async def login(self, email, password):
        user = await self.repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            return None
        token = create_access_token(sub=str(user.id), role=user.role)
        return token
    
    async def update(self, email, username, password):
        user = await self.repo

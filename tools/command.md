cd /mnt/c/Users/muham/OneDrive/Desktop/E-Commerce
  JWT_SECRET=dev-secret \
  DATABASE_URL=postgresql+asyncpg://user:userpassword@localhost:5433/usersdb \
  PYTHONPATH=/mnt/c/Users/muham/OneDrive/Desktop/E-Commerce/user-service \
  /mnt/c/Users/muham/OneDrive/Desktop/E-Commerce/.venv/bin/python -m tools.promote_user --email mailid@gmail.com
# E-Commerce Microservices — Project Skeleton

This canvas provides a compact, practical skeleton you can use to start the e-commerce microservices project. It includes a recommended repo layout, minimal example files, startup commands, and short notes on where to expand.

---

## Repo layout (monorepo)

```
E-Commerce/
├─ infra/
│  ├─ docker-compose.yml
│  ├─ prometheus/
│  │  └─ prometheus.yml
│  └─ README.md        # how to run infra locally
├─ user-service/
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ models.py
│  │  ├─ schemas.py
│  │  └─ auth.py
│  └─ alembic/         # optional: migrations
├─ product-service/
│  └─ (same structure as user-service)
├─ cart-service/
├─ order-service/
├─ payment-service/
├─ notification-service/
└─ .gitignore
```

---

## infra/docker-compose.yml (what it contains)

* Traefik (gateway)
* postgres-user, postgres-product
* redis
* rabbitmq
* prometheus
* grafana
* jaeger
* user-service (build context)

> Note: keep `prometheus/prometheus.yml` as a file (not a directory). Avoid OneDrive path issues — prefer working inside WSL home if mounts misbehave.

---

## Minimal `user-service` skeleton (FastAPI)

### `user-service/app/main.py`

```py
from fastapi import FastAPI
app = FastAPI()

@app.get('/health')
def health():
    return {"status": "ok"}
```

### `user-service/requirements.txt`

```
fastapi
uvicorn
psycopg[binary]
redis
pyjwt
```

### `user-service/Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Minimal `prometheus/prometheus.yml`

```yaml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:8000']
```

---

## `.env.example` (shared env pattern)

```
# user-service
DATABASE_URL=postgresql://user:userpassword@postgres-user:5432/usersdb
REDIS_URL=redis://redis:6379/0
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
JWT_SECRET=dev-jwt-secret
```

---

## Quick local startup (infra)

```bash
# from infra/
docker compose pull
docker compose up --build
# open services: Traefik dashboard: http://localhost:8080
```

---

## Development tips & checklist

* Start with **User Service**: register/login, JWT, migrations. Use it as pattern for other services.
* Use **DB-per-service** (Postgres instances or schemas) to keep services decoupled.
* Use Redis for cart & sessions, and RabbitMQ for events.
* Add `/metrics` endpoint for Prometheus scraping.
* Keep secrets out of repo — use `.env` for local, and Docker secrets / Vault for prod.
* Move the repo into WSL home (`~/projects/...`) if OneDrive causes bind-mount errors.

---

If you want, I can scaffold any single service file-by-file (small, focused snippets) — tell me which service to expand next.

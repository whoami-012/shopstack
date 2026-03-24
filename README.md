# 🛒 Scalable E-Commerce Platform

A microservices-based e-commerce backend built using FastAPI, designed for scalability, modularity, and real-world production architecture. This project demonstrates modern backend engineering practices including service isolation, async processing, and event-driven communication.

---

## 🚀 Features

* Authentication & User Management (JWT-based)
* Product Catalog Service
* Cart Management System
* Order Processing Service
* Event-driven architecture using RabbitMQ
* Async database operations (SQLAlchemy + PostgreSQL)
* Modular microservices structure
* Role-based access (User / Admin)

---

## 🏗️ Architecture

The system follows a microservices architecture where each service is independent and communicates via APIs or message queues.

### Services

**User Service**

* Authentication (JWT)
* Role management (admin/user)
* CRUD operations

**Product Service**

* Product catalog
* Admin CRUD operations

**Cart Service**

* Add/remove/update items
* User-specific cart handling

**Order Service**

* Order creation & tracking
* Converts cart to order

**Notification Service**

* Consumes messages from RabbitMQ
* Handles asynchronous notifications

---

## 🔄 Event-Driven Flow

* Order created → event published
* Notification service consumes event
* Extendable to inventory, payments, analytics

---

## 🛠️ Tech Stack

* Backend: FastAPI
* Database: PostgreSQL
* ORM: SQLAlchemy (Async)
* Message Broker: RabbitMQ
* Authentication: JWT
* Migrations: Alembic

---

## 📁 Project Structure

```
/services
  /user-service
  /product-service
  /cart-service
  /order-service
  /notification-service

/shared
  /schemas
  /utils
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```
git clone <your-repo-url>
cd ecommerce-platform
```

### 2. Create Virtual Environment

```
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```
pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file in each service:

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
JWT_SECRET=your_secret
RABBITMQ_URL=amqp://guest:guest@localhost/
```

### 5. Run Migrations

```
alembic upgrade head
```

### 6. Start Service

```
uvicorn app.main:app --reload
```

---

## 🔑 Authentication

Use JWT token in headers:

```
Authorization: Bearer <token>
```

---

## 📡 API Overview

### User Service

* POST /register
* POST /login

### Product Service

* GET /products
* POST /products (Admin)

### Cart Service

* GET /cart
* POST /cart/items
* DELETE /cart/items/{id}

### Order Service

* POST /orders
* GET /orders

---

## 🧠 Key Concepts

* Microservices design
* Dependency injection (FastAPI)
* Async database operations
* Event-driven systems
* Repository + Service pattern

---

## 🔮 Future Improvements

* Payment integration (Stripe/Razorpay)
* Inventory service
* Analytics dashboard
* Email notifications
* Docker orchestration
* OAuth (Google login)

---

## 🤝 Contribution

Fork the repository, make improvements, and submit a pull request.

---

## 📌 Notes

This project is built for learning real-world backend architecture and showcasing produc

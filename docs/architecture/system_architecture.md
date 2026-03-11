
# System Architecture

## Overview

This document describes the high-level architecture of the e-commerce system, including its main components, technologies, and responsibilities.

The system follows a **client-server architecture**, with separated frontend and backend.

## Technologies

### Frontend
- React
- TypeScript
- Vite

### Backend
- ASP.NET Core Web API
- C#

### Database
- PostgreSQL (Supabase)

### Authentication
- JWT / Supabase Auth

### Payments
- PIX
- Bitcoin Lightning Network

## High-Level Architecture

```
Client (Browser)
    ↓
Frontend (React + TypeScript)
    ↓
HTTP / REST API
    ↓
Backend (ASP.NET Core Web API)
    ↓
Database (PostgreSQL)
```

## Responsibilities

### Frontend
- User interface
- User interaction
- API communication
- Authentication token storage

### Backend
- Business logic
- Authentication validation
- Order management
- Payment generation
- Cart management

### Database
- Persistent storage of system data
  - Users
  - Products
  - Carts
  - Orders
  - Payments

## Backend Architecture

The backend follows a **layered architecture** to separate responsibilities.

```
src/
├── Domain/
│   ├── Entities
│   └── Enums
├── Application/
│   ├── Services
│   └── DTOs
├── Infrastructure/
│   ├── Persistence
│   └── ExternalServices
└── API/
    └── Controllers
```

### Domain Layer

Contains core business entities and enums.

**Entities:**
- User
- Product
- Cart
- CartItem
- Order
- OrderItem
- Payment

**Enums:**
- UserRole
- OrderStatus
- PaymentStatus
- PaymentMethod

### Application Layer

Contains business logic and application services.

**Responsibilities:**
- Cart management
- Checkout process
- Order creation
- Payment generation
- Payment validation

### Infrastructure Layer

Responsible for external integrations.

**Examples:**
- Database access
- Supabase integration
- Payment providers

### API Layer

Handles HTTP requests and responses.

**Responsibilities:**
- Expose REST endpoints
- Request validation
- Response formatting
- Authentication middleware

**Main Controllers:**
- AuthController
- ProductsController
- CartController
- OrdersController
- PaymentsController

## Stateless Backend

The backend API is **stateless**, meaning the server does not store session data between requests.

**Authentication** is handled using JWT tokens. Each request must include a valid token:

```
Authorization: Bearer <token>
```

## Payment Flow

```
User adds product to cart
      ↓
User performs checkout
      ↓
Order is created
      ↓
Payment request generated
      ↓
User completes payment
      ↓
Payment confirmed
      ↓
Order status updated to Paid
```

## Database

The system uses **PostgreSQL** hosted on Supabase.

**Main Tables:**
- users
- products
- carts
- cart_items
- orders
- order_items
- payments

Each entity in the domain model maps to a corresponding database table.

## External Services

The system integrates with external services for specific functionalities.

| Service | Purpose |
|---------|---------|
| Supabase | Authentication and database hosting |
| PIX | Instant payment method |
| Lightning Network | Bitcoin payment network |

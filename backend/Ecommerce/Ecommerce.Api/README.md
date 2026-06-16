# E-Commerce Backend API

A robust, well-architected REST API for an e-commerce platform built with .NET 8 and PostgreSQL. This backend implements clean architecture principles with domain-driven design, featuring comprehensive authentication, payment processing, and order management.


## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Background Services](#background-services)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Overview

This e-commerce backend provides:

- **User Management**: Registration, authentication, and profile management
- **Product Catalog**: Browse and manage products with filtering and pagination
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: Create orders, track status, handle expirations
- **Payment Processing**: Integration with Mercado Pago, payment status tracking
- **Admin Dashboard**: Product management, order monitoring
- **Security**: JWT authentication, password validation, CPF validation
- **Background Jobs**: Automatic payment expiration, order cleanup
- **Real-time Updates**: Webhook support for payment notifications

---

## Architecture

### Design Pattern: Clean Architecture with DDD

```
┌─────────────────────────────────────────────────────┐
│              Controllers (API Layer)                 │
├─────────────────────────────────────────────────────┤
│         Application Services (Business Logic)        │
├─────────────────────────────────────────────────────┤
│         Domain Entities (Business Rules)             │
├─────────────────────────────────────────────────────┤
│    Infrastructure (Database, Payments, Logging)      │
└─────────────────────────────────────────────────────┘
```

### Key Principles

- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Injection**: Loose coupling between components
- **Domain-Driven Design**: Rich domain models with business logic encapsulation
- **Repository Pattern**: Data access abstraction
- **CQRS-inspired**: Separate read/write operations where appropriate
- **Value Objects**: Immutable objects for addresses, digital contacts

---

## Tech Stack

### Core Framework
- **.NET 8**: Latest LTS framework with performance improvements
- **C# 12**: Modern language features (records, nullable reference types)
- **ASP.NET Core 8**: Web framework for building REST APIs

### Database & ORM
- **PostgreSQL**: Robust relational database
- **Entity Framework Core**: ORM for database operations
- **Migrations**: Version-controlled database schema

### Authentication & Security
- **JWT (JSON Web Tokens)**: Stateless authentication
- **BCrypt.Net**: Password hashing with salt
- **Custom Validators**: Email, CPF, and password validation

### Payment Integration
- **Mercado Pago SDK**: Payment processing
- **Webhook Support**: Real-time payment notifications
- **Polling Service**: Background payment status checking

### Logging & Monitoring
- **Serilog** (recommended): Structured logging
- **Built-in ILogger**: ASP.NET Core logging abstraction

### CORS & API
- **CORS Configuration**: Cross-Origin Resource Sharing
- **Swagger/OpenAPI**: Interactive API documentation

---

## Project Structure

```
Ecommerce.Api/
│
├── Controllers/                          # HTTP endpoints
│   ├── AuthController.cs                # Authentication (register, login)
│   ├── CartController.cs                # Shopping cart operations
│   ├── OrderController.cs               # Order management
│   ├── ProductController.cs             # Product catalog
│   └── Webhook/
│       └── WebhooksController.cs        # Mercado Pago webhooks
│
├── Application/                          # Business logic layer
│   ├── Services/
│   │   ├── AuthService.cs              # User authentication
│   │   ├── CartService.cs              # Cart management
│   │   ├── OrderService.cs             # Order processing
│   │   ├── PaymentService.cs           # Payment handling
│   │   ├── ProductService.cs           # Product operations
│   │   ├── UserService.cs              # User management
│   │   └── Background/
│   │       ├── OrderExpirationService.cs    # Expire old orders
│   │       └── PaymentStatusPoller.cs       # Expire pending payments
│   │
│   ├── DTOS/                           # Data Transfer Objects
│   │   ├── Auth/                       # Login/Register DTOs
│   │   ├── User/                       # User DTOs
│   │   ├── Product/                    # Product DTOs
│   │   ├── Order/                      # Order DTOs
│   │   ├── Cart/                       # Cart DTOs
│   │   ├── Payment/                    # Payment DTOs
│   │   └── OrderItem/                  # Order Item DTOs
│   │
│   ├── Exceptions/                     # Custom exception classes
│   │   ├── UnauthorizedException.cs
│   │   ├── BadRequestException.cs
│   │   └── NotFoundException.cs
│   │
│   └── Common/
│       └── Security/
│           ├── PasswordValidator.cs    # Password validation rules
│           ├── EmailValidator.cs       # Email validation
│           └── CpfValidator.cs         # CPF validation (Brazilian ID)
│
├── Domain/                               # Business rules & entities
│   ├── Entities/
│   │   ├── User.cs                    # User aggregate root
│   │   ├── Product.cs                 # Product aggregate root
│   │   ├── Order.cs                   # Order aggregate root
│   │   ├── OrderItem.cs               # Order line items
│   │   ├── Cart.cs                    # Shopping cart
│   │   ├── CartItem.cs                # Cart items
│   │   ├── Payment.cs                 # Payment aggregate root
│   │   └── ValueObjects/
│   │       ├── Address.cs             # Physical address
│   │       └── DigitalContactInfo.cs  # Email/phone for digital products
│   │
│   ├── Enums/
│   │   ├── OrderStatus.cs             # Pending, Paid, Expired, etc.
│   │   ├── PaymentStatus.cs           # Pending, Confirmed, Expired, etc.
│   │   ├── PaymentMethod.cs           # PIX, Credit Card, etc.
│   │   ├── UserRole.cs                # Customer, Admin
│   │   └── ProductType.cs             # Physical, Digital
│   │
│   └── Entities/
│       └── Exceptions/
│           └── DomainException.cs      # Domain rule violations
│
├── Infrastructure/                       # Data access & external services
│   ├── Persistence/
│   │   ├── AppDbContext.cs            # EF Core DbContext
│   │   └── Configurations/            # Entity configurations
│   │       ├── UserConfiguration.cs
│   │       ├── ProductConfiguration.cs
│   │       ├── OrderConfiguration.cs
│   │       └── ...
│   │
│   ├── Migrations/                    # EF Core migrations
│   │   └── [timestamp]_[MigrationName].cs
│   │
│   └── Payments/
│       └── MercadoPagoProvider/
│           └── MercadoPagoService.cs  # Payment provider integration
│
├── Api/
│   └── Middleware/
│       └── ExceptionMiddleware.cs      # Global exception handling
│
├── Program.cs                           # Application startup & DI configuration
├── appsettings.json                     # Default configuration
├── appsettings.Development.json         # Development overrides
├── .env                                 # Environment variables (local)
└── Ecommerce.Api.csproj               # Project file with dependencies
```

---

## Prerequisites

- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))
- **Git** for version control
- **VS Code** or **Visual Studio 2022+** (recommended)

### Verify Installation

```powershell
# Check .NET version
dotnet --version

# Check PostgreSQL version
psql --version
```

---

## Installation & Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/matetocoti/e-commerce_project.git
cd e-commerce_project/backend/Ecommerce
```

### 2. Create `.env` File

Create a `.env` file in the `Ecommerce.Api` directory:

```env
# Database Configuration
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=ecommerce;Username=postgres;Password=your_postgres_password

# JWT Configuration
Jwt__Key=your_secret_key_here_minimum_32_characters_long
Jwt__Issuer=Ecommerce.Api
Jwt__Audience=Ecommerce.Clients
Jwt__ExpiresMinutes=60

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Restore Dependencies

```powershell
cd Ecommerce.Api
dotnet restore
```

### 4. Create Database

```powershell
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE ecommerce;
\q
```

### 5. Apply Migrations

```powershell
dotnet ef database update
```

Or create from scratch:

```powershell
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Configuration

### appsettings.json

```json
{
  "Logging": {
	"LogLevel": {
	  "Default": "Information",
	  "Microsoft.AspNetCore": "Warning"
	}
  },
  "AllowedHosts": "*"
}
```

### JWT Configuration

Configure in `.env`:

```env
Jwt__Key=your_very_long_secret_key_minimum_32_characters
Jwt__Issuer=Ecommerce.Api
Jwt__Audience=Ecommerce.Clients
Jwt__ExpiresMinutes=60
```

### CORS Configuration

Configured in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
	options.AddPolicy("Frontend", policy =>
	{
		policy
			.WithOrigins("http://localhost:5173")
			.AllowAnyHeader()
			.AllowAnyMethod();
	});
});
```

### Database Connection

PostgreSQL connection string format:

```
Host=localhost;Port=5432;Database=ecommerce;Username=postgres;Password=your_password
```

---

## Running the Application

### Development Mode

```powershell
dotnet run
```

The API will be available at `https://localhost:5001` or `http://localhost:5000`

### With Hot Reload

```powershell
dotnet watch run
```

### Using Visual Studio

1. Open `Ecommerce.sln`
2. Set `Ecommerce.Api` as startup project
3. Press `F5` to run with debugger

---

## API Documentation

### Swagger/OpenAPI

Access interactive API documentation at:

```
http://localhost:5000/swagger
```

### Base URL

```
http://localhost:5000/api
```

### Authentication

Include JWT token in request headers:

```
Authorization: Bearer {your_jwt_token}
```

### Key Endpoints

#### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

#### Products

```http
GET /api/product              # List all products
GET /api/product/{id}         # Get product details
POST /api/product             # Create product (admin)
PUT /api/product/{id}         # Update product (admin)
DELETE /api/product/{id}      # Delete product (admin)
```

#### Cart

```http
GET /api/cart                      # Get user's cart
POST /api/cart/add                 # Add item to cart
DELETE /api/cart/items/{productId} # Remove item from cart
```

#### Orders

```http
POST /api/order/checkout                # Create order from cart
GET /api/order                          # List user's orders
GET /api/order/{orderId}                # Get order details
```

#### Payments

```http
POST /api/payments/pay-order    # Process payment
POST /api/webhooks/mercadopago  # Webhook callback (Mercado Pago)
```

---

## Database

### Schema Overview

```
Users
  ├─ Id (GUID)
  ├─ Username (string)
  ├─ Email (string)
  ├─ PasswordHash (string)
  ├─ Role (UserRole)
  └─ CreatedAt, UpdatedAt

Products
  ├─ Id (GUID)
  ├─ Name (string)
  ├─ Description (text)
  ├─ Price (decimal)
  ├─ Stock (int)
  ├─ Type (ProductType)
  ├─ IsActive (bool)
  └─ CreatedAt, UpdatedAt

Orders
  ├─ Id (GUID)
  ├─ UserId (GUID FK)
  ├─ Status (OrderStatus)
  ├─ TotalAmount (decimal)
  ├─ Address (Address ValueObject)
  ├─ CreatedAt, UpdatedAt
  ├─ ExpiresAt
  └─ OrderItems (collection)

Payments
  ├─ Id (GUID)
  ├─ OrderId (GUID FK)
  ├─ Status (PaymentStatus)
  ├─ Method (PaymentMethod)
  ├─ Amount (decimal)
  ├─ ExternalPaymentId (string)
  └─ CreatedAt, UpdatedAt

Carts
  ├─ Id (GUID)
  ├─ UserId (GUID FK)
  └─ CartItems (collection)
```

### Migrations

View applied migrations:

```powershell
dotnet ef migrations list
```

Create new migration:

```powershell
dotnet ef migrations add MigrationName
dotnet ef database update
```

Revert last migration:

```powershell
dotnet ef database update PreviousMigrationName
```

---

## Authentication

### JWT Flow

1. **Register**: User creates account
   ```
   POST /api/auth/register
   { "username": "user", "email": "user@example.com", "password": "Pass@123" }
   ```

2. **Login**: Get JWT token
   ```
   POST /api/auth/login
   { "login": "user@example.com", "password": "Pass@123" }
   Response: { "token": "eyJhbGc...", "user": {...} }
   ```

3. **Use Token**: Include in Authorization header
   ```
   GET /api/cart
   Authorization: Bearer eyJhbGc...
   ```

### Password Requirements

- Minimum 8 characters
- Maximum 128 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit (0-9)
- At least one special character (!@#$%^&*)
- No whitespace

Example valid password: `MyPassword@123`

### Token Expiration

Default: 60 minutes (configurable via `Jwt__ExpiresMinutes`)

Tokens are validated on every request and rejected if expired.

---

## Payment Integration

### Mercado Pago Integration

#### Configuration

1. Sign up at [Mercado Pago Developer](https://www.mercadopago.com.br/developers)
2. Get your API credentials (Access Token)
3. Configure in `.env` (future implementation)

#### Payment Flow

1. **Create Payment**: Initialize payment in the frontend
2. **Webhook Notification**: Mercado Pago notifies via webhook
3. **Payment Status Poller**: Background service checks payment status every 5 minutes
4. **Order Confirmation**: Update order status when payment is confirmed

#### Testing Payments

**Development Mode**: Currently uses fake payment mode
- Payments are auto-confirmed for testing
- No real transactions are processed

**Production Mode**: Integrate with real Mercado Pago API
- Implement signature validation
- Configure webhook endpoint
- Use real payment credentials

#### Webhook Configuration

```
Endpoint: POST /api/webhooks/mercadopago
Formats Supported:
  - IPN: ?topic=payment&id=123
  - Webhook: ?type=payment&data.id=123
```

---

## Background Services

### Order Expiration Service

**Purpose**: Automatically expires orders that haven't been paid within their expiration window

**Schedule**: Every 1 minute

**Logic**:
- Finds orders with status `AwaitingPayment` where `DateTime.UtcNow >= ExpiresAt`
- Marks order as `Expired`
- Restitutes product stock
- Reactivates products if they now have stock

```csharp
// Configuration in Program.cs
builder.Services.AddHostedService<OrderExpirationService>();
```

### Payment Status Poller

**Purpose**: Expires pending payments older than 24 hours

**Schedule**: Every 5 minutes

**Logic**:
- Finds payments with status `Pending` and `CreatedAt < 24 hours ago`
- Marks payment as `Expired`
- Cleans up database without real transaction impact

```csharp
// Configuration in Program.cs
builder.Services.AddHostedService<PaymentStatusPoller>();
```

---

## Security Features

### Password Security

- **Hashing**: BCrypt with salt
- **Validation**: Custom validator with complexity requirements
- **Never Stored**: Plain passwords never stored in database

### Email Validation

- **RFC 5321 Compliance**: Validates email format and length (max 254 chars)
- **Prevents**: Invalid formats, consecutive dots, leading/trailing dots

### CPF Validation (Brazilian ID)

- **Algorithm**: Validates check digits using official formula
- **Prevents**: Invalid formats, all same digits, invalid check digits
- **Formatting**: Accepts formatted (XXX.XXX.XXX-XX) or unformatted (XXXXXXXXXXX)

### API Security

- **HTTPS**: Enforced in production (configurable in development)
- **CORS**: Configured to specific origins only
- **JWT**: Stateless authentication with expiration
- **Exception Handling**: No sensitive data in error responses

### Data Validation

- **Input Validation**: All DTOs validated before processing
- **Output Validation**: DTOs ensure only safe data is returned
- **Domain Validation**: Business rules enforced in entities

---

## Error Handling

### Exception Middleware

Global exception handler in `ExceptionMiddleware.cs`:

```
UnauthorizedException → 401 Unauthorized
BadRequestException → 400 Bad Request
NotFoundException → 404 Not Found
Generic Exception → 500 Internal Server Error
```

### Error Response Format

```json
{
  "message": "Descriptive error message"
}
```

### Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Order created |
| 201 | Created | New user registered |
| 204 | No Content | Item deleted |
| 400 | Bad Request | Invalid email |
| 401 | Unauthorized | Invalid token |
| 404 | Not Found | Product doesn't exist |
| 500 | Server Error | Database connection failed |

---

## Testing

### Unit Testing (Recommended Setup)

```powershell
dotnet new xunit -n Ecommerce.Tests
cd Ecommerce.Tests
dotnet add reference ../Ecommerce.Api/Ecommerce.Api.csproj
```

### Integration Testing

Test against real PostgreSQL instance with test database:

```powershell
# Create test database
createdb ecommerce_test

# Run tests
dotnet test --configuration Release
```

### Manual Testing with Postman

1. Import endpoints from Swagger
2. Create environment with variables:
   - `base_url`: `http://localhost:5000`
   - `token`: JWT token from login response
   - `user_id`: User ID from register/login
3. Test each endpoint

### Testing Endpoints Collection

A Postman collection is available in the project:
```
/backend/postman_collection.json
```

---

## Deployment

### Docker

Create `Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Ecommerce.Api.dll"]
```

Build and run:

```bash
docker build -t ecommerce-api .
docker run -p 5000:5000 --env-file .env ecommerce-api
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
	image: postgres:15
	environment:
	  POSTGRES_DB: ecommerce
	  POSTGRES_PASSWORD: your_password
	ports:
	  - "5432:5432"
	volumes:
	  - postgres_data:/var/lib/postgresql/data

  api:
	build: .
	depends_on:
	  - postgres
	ports:
	  - "5000:5000"
	environment:
	  ConnectionStrings__DefaultConnection: Host=postgres;Port=5432;Database=ecommerce;Username=postgres;Password=your_password
	env_file:
	  - .env

volumes:
  postgres_data:
```

Start:

```bash
docker-compose up -d
```

### Cloud Deployment

#### Azure App Service

1. Create PostgreSQL Database in Azure
2. Create App Service for ASP.NET Core
3. Configure connection string in App Service settings
4. Deploy via GitHub Actions:

```yaml
name: Deploy to Azure
on:
  push:
	branches: [main]

jobs:
  deploy:
	runs-on: ubuntu-latest
	steps:
	  - uses: actions/checkout@v2
	  - uses: azure/login@v1
		with:
		  creds: ${{ secrets.AZURE_CREDENTIALS }}
	  - name: Deploy
		run: |
		  cd backend/Ecommerce/Ecommerce.Api
		  dotnet publish -c Release
		  # Deploy command here
```

#### Railway / Render / Heroku

All support PostgreSQL and .NET applications. Follow their documentation for deployment.

---

## Project Highlights

### Clean Architecture Implementation

- ✅ Clear separation of concerns
- ✅ Business logic in domain layer
- ✅ Easy to test and maintain
- ✅ Framework-agnostic domain code

### Domain-Driven Design

- ✅ Rich domain models with behavior
- ✅ Value objects for complex types
- ✅ Domain exceptions for business rule violations
- ✅ Aggregate roots for entity management

### Production-Ready Features

- ✅ Comprehensive error handling
- ✅ Structured logging
- ✅ Input validation
- ✅ JWT authentication
- ✅ Background jobs for maintenance
- ✅ CORS configuration
- ✅ Database migrations

### Developer Experience

- ✅ Clear project structure
- ✅ XML documentation comments
- ✅ Dependency injection setup
- ✅ Environment-based configuration
- ✅ Swagger/OpenAPI documentation

---

## Troubleshooting

### Database Connection Failed

```
❌ Error: failed to connect to localhost (127.0.0.1):5432
```

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string in `.env`
3. Verify database exists: `psql -l`

### Port Already in Use

```
❌ Error: Address already in use
```

**Solution**:
```powershell
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### JWT Token Invalid

```
❌ Error: 401 Unauthorized
```

**Solution**:
1. Verify token in Authorization header: `Bearer {token}`
2. Check token hasn't expired (default 60 min)
3. Verify `Jwt__Key` matches in all services

### Migration Issues

```
❌ Error: Column already exists
```

**Solution**:
```powershell
# Revert to previous migration
dotnet ef database update PreviousMigration
# Delete problematic migration
dotnet ef migrations remove
# Create new migration
dotnet ef migrations add FixName
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style

- Follow Microsoft C# coding conventions
- Use meaningful variable names
- Document complex logic with comments
- Write unit tests for new features

---

## License

This project is private. All rights reserved.

---

## Contact & Support

- **Developer**: [@matetocoti](https://github.com/matetocoti)
- **Repository**: [e-commerce_project](https://github.com/matetocoti/e-commerce_project)

---

## Roadmap

- [ ] Admin dashboard backend
- [ ] Advanced payment methods
- [ ] Product reviews and ratings
- [ ] Inventory management system
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Analytics and reporting
- [ ] API rate limiting
- [ ] Enhanced search and filtering
- [ ] Multi-language support

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-16 | Initial release with core features |

---


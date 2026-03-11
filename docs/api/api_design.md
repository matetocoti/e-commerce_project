# API Design

This document defines the REST API endpoints for the e-commerce system.

## Authentication

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
    "email": "string",
    "name": "string",
    "password": "string"
}
```

**Response:** `201 Created`

```json
{
    "id": "uuid",
    "email": "string",
    "name": "string"
}
```

### Login User

**POST** `/auth/login`

**Request Body:**

```json
{
    "email": "string",
    "password": "string"
}
```

**Response:** `200 OK`

```json
{
    "token": "jwt-token",
    "user": {
        "id": "uuid",
        "email": "string",
        "name": "string"
    }
}
```

## Products

### List Products

**GET** `/products`

**Query Parameters:**

- `page` (integer, default: 1)
- `size` (integer, default: 20)

**Response:** `200 OK`

```json
{
    "products": [
        {
            "id": "uuid",
            "name": "string",
            "description": "string",
            "price": "decimal",
            "stock": "integer"
        }
    ],
    "total": "integer",
    "page": "integer"
}
```

### Get Product Details

**GET** `/products/{id}`

**Response:** `200 OK`

```json
{
    "id": "uuid",
    "name": "string",
    "description": "string",
    "price": "decimal",
    "stock": "integer"
}
```

## Cart

### Get Cart

**GET** `/cart`

**Response:** `200 OK`

```json
{
    "items": [
        {
            "id": "uuid",
            "productId": "uuid",
            "name": "string",
            "price": "decimal",
            "quantity": "integer"
        }
    ],
    "total": "decimal"
}
```

### Add Item to Cart

**POST** `/cart/items`

**Request Body:**

```json
{
    "productId": "uuid",
    "quantity": "integer"
}
```

**Response:** `200 OK`

```json
{
    "id": "uuid",
    "productId": "uuid",
    "quantity": "integer"
}
```

### Remove Item from Cart

**DELETE** `/cart/items/{id}`

**Response:** `204 No Content`

## Orders

### Create Order

**POST** `/checkout`

**Response:** `201 Created`

```json
{
    "id": "uuid",
    "status": "AwaitingPayment",
    "totalAmount": "decimal",
    "createdAt": "datetime"
}
```

### List Orders

**GET** `/orders`

**Response:** `200 OK`

```json
{
    "orders": [
        {
            "id": "uuid",
            "status": "AwaitingPayment",
            "totalAmount": "decimal",
            "createdAt": "datetime"
        }
    ]
}
```

### Get Order Details

**GET** `/orders/{id}`

**Response:** `200 OK`

```json
{
    "id": "uuid",
    "status": "Pending | AwaitingPayment | Paid | Cancelled | Expired",
    "totalAmount": "decimal",
    "items": [
        {
            "productId": "uuid",
            "productName": "string",
            "unitPrice": "decimal",
            "quantity": "integer"
        }
    ],
    "createdAt": "datetime"
}
```

## Payments

### Generate Payment

**POST** `/orders/{id}/payments`

**Request Body:**

```json
{
    "method": "PIX | LIGHTNING"
}
```

**Response:** `201 Created`

```json
{
    "paymentId": "uuid",
    "orderId": "uuid",
    "status": "Pending",
    "method": "PIX | LIGHTNING"
}
```

### Get Payment

**GET** `/payments/{id}`

**Response:** `200 OK`

```json
{
    "id": "uuid",
    "orderId": "uuid",
    "status": "Pending | Confirmed | Expired | Failed",
    "method": "PIX | LIGHTNING",
    "createdAt": "datetime"
}
```


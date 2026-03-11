# System Requirements

## Functional Requirements

### FR1 - User registration
- The system must allow users to create an account.

### FR2 - User authentication
- The system must allow users to login using email and password.

### FR3 - Product browsing
- Users must be able to view available products.

### FR4 - Add to cart
- Users must be able to add products to a cart.

### FR5 - Checkout
- Users must be able to create an order from the cart.

### FR6 - Payment generation
- The system must generate a payment request (PIX or Lightning).

### FR7 - Payment confirmation
- The system must confirm payments and update order status.

### FR8 - Order history
- Users must be able to view previous orders.






## Non-Functional Requirements

### NFR1 - Security
- Passwords must be stored using secure hashing.

### NFR2 - Stateless backend
- The backend API must be stateless.

### NFR3 - Payment expiration
- Orders must expire after a configurable time window.

### NFR4 - Scalability
- The system must support horizontal scaling.

### NFR5 - Data integrity
- Orders must preserve product pricing at purchase time.
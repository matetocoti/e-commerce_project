## Use Case: Checkout

## Preconditions
- User is authenticated
- Cart is not empty

## Main Flow
1. User initiates checkout
2. System creates Order
3. CartItems copied to OrderItems
4. System calculates total amount
5. System reserves stock
6. Cart is cleared
7. Order status set to AwaitingPayment

## Postconditions
- Order created
## Use Case: Generate Payment

## Preconditions
- User is authenticated
- Order exists
- Order status = AwaitingPayment

## Main Flow
1. User selects payment method
2. System creates Payment
3. System generates payment request (PIX or Lightning)
4. Payment status set to Pending

## Postconditions
- Payment request returned to user
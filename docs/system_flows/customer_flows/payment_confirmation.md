## Use Case: Payment Confirmation

## Preconditions
- Payment exists
- Payment status = Pending

## Main Flow
1. Payment provider sends confirmation
2. System validates payment
3. Payment status updated to Confirmed
4. Order status updated to Paid

## Postconditions
- Order marked as Paid
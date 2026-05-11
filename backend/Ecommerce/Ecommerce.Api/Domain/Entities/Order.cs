namespace Ecommerce.Api.Domain.Entities;

using Ecommerce.Api.Domain.Entities.Exceptions;
using Ecommerce.Api.Domain.Entities.ValueObject;
using Ecommerce.Api.Domain.Enums;

public class Order
{
    #region Properties
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(1);
    public Address? Address { get; set; }
    public DigitalContactInfo? DigitalContact { get; set; }
    #endregion

    #region Relationships
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public List<OrderItem> OrderItems { get; set; } = new();
    public List<Payment> Payments { get; set; } = new();
    #endregion

    #region Constructors
    public Order() { }

    public Order(Guid userId, List<OrderItem> orderItems, Address? address, DigitalContactInfo? digitalContact)
    {
        if (orderItems == null || orderItems.Count == 0)
            throw new DomainException("Order must have at least one item");

        ValidateSingleProductType(orderItems);

        var productType = GetOrderProductType(orderItems);

        ValidateDeliveryData(productType, address, digitalContact);

        Id = Guid.NewGuid();
        UserId = userId;
        OrderItems = orderItems;
        Address = address;
        DigitalContact = digitalContact;
        TotalAmount = orderItems.Sum(item => item.Subtotal);
        Status = OrderStatus.AwaitingPayment;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
        ExpiresAt = CreatedAt.AddHours(1);
    }
    #endregion

    #region Methods
    public void MarkAsPaid()
    {
        if (Status != OrderStatus.AwaitingPayment)
            throw new DomainException("Only orders awaiting payment can be paid");

        if (IsExpired())
            throw new DomainException("Expired orders cannot be paid");

        Status = OrderStatus.Paid;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Paid)
            throw new DomainException("Paid orders cannot be cancelled");

        if (Status == OrderStatus.Cancelled)
            throw new DomainException("Order is already cancelled");

        if (Status == OrderStatus.Expired)
            throw new DomainException("Expired orders cannot be cancelled");

        Status = OrderStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }



    // TODO:
    // Expiration currently relies only on ExpiresAt comparison.
    // This can create inconsistent states where the order is expired by time
    // but still marked as AwaitingPayment.
    // Future improvement:
    // - Synchronize expiration state with OrderStatus
    // - Centralize expiration validation
    // - Prevent payments after expiration consistently
    // - Add automatic expiration handling (background job / scheduler)
    public void Expire()
    {
        if (Status != OrderStatus.AwaitingPayment)
            return;

        Status = OrderStatus.Expired;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsExpired()
    {
        return DateTime.UtcNow > ExpiresAt;
    }

    public void AddPayment(Payment payment)
    {
        if (payment == null)
            throw new DomainException("Payment is required");

        if (Status != OrderStatus.AwaitingPayment)
            throw new DomainException("Cannot add payment to an order that is not awaiting payment");

        if (IsExpired())
            throw new DomainException("Cannot add payment to an expired order");

        if (Payments.Any(p => p.Status == PaymentStatus.Confirmed))
            throw new DomainException("Order already has a confirmed payment");

        Payments.Add(payment);
        UpdatedAt = DateTime.UtcNow;

        if (payment.Status == PaymentStatus.Confirmed)
            MarkAsPaid();
    }

    private static void ValidateSingleProductType(List<OrderItem> orderItems)
    {
        var firstType = orderItems.First().ProductType;

        if (orderItems.Any(item => item.ProductType != firstType))
            throw new DomainException("Order cannot contain mixed product types");
    }

    private static ProductType GetOrderProductType(List<OrderItem> orderItems)
    {
        return orderItems.First().ProductType;
    }

    private static void ValidateDeliveryData(ProductType productType, Address? address, DigitalContactInfo? digitalContact)
    {
        if (productType == ProductType.Physical)
        {
            if (address == null)
                throw new DomainException("Address is required for physical products");

            if (digitalContact != null)
                throw new DomainException("Digital contact must be null for physical products");
        }

        if (productType == ProductType.Digital)
        {
            if (digitalContact == null)
                throw new DomainException("Digital contact is required for digital products");

            if (address != null)
                throw new DomainException("Address must be null for digital products");
        }
    }

    public override bool Equals(object? obj)
    {
        return obj is Order order && Id == order.Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
    #endregion
}
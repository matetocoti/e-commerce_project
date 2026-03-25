namespace Ecommerce.Api.Domain.Entities;

using Ecommerce.Api.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

public class Order
{
    #region Properties
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(1);
    #endregion

    #region Relationships
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public List<OrderItem> OrderItems { get; set; } = new();
    public List<Payment> Payments { get; set; } = new();
    #endregion

    #region Constructors

    public Order() { }

    public Order(Guid userId, List<OrderItem> orderItems)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        OrderItems = orderItems;
        TotalAmount = orderItems.Sum(item => item.Subtotal);
        Status = OrderStatus.Pending;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
        ExpiresAt = CreatedAt.AddHours(1);
    }
    #endregion

    #region Methods
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
namespace Ecommerce.Api.Domain.Entities;

using Ecommerce.Api.Domain.Entities.Exceptions;
using Ecommerce.Api.Domain.Enums;

public class OrderItem
{
    #region Properties
    public Guid Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => UnitPrice * Quantity;
    #endregion

    #region Relationships
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    #endregion

    #region Constructors
    public OrderItem() { }

    public OrderItem(string productName, ProductType productType, decimal unitPrice, int quantity)
    {
        if (string.IsNullOrWhiteSpace(productName))
            throw new DomainException("Product name is required");

        if (unitPrice < 0)
            throw new DomainException("Unit price cannot be negative");

        if (quantity <= 0)
            throw new DomainException("Quantity must be greater than zero");

        Id = Guid.NewGuid();
        ProductName = productName;
        ProductType = productType;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }
    #endregion

    #region Methods
    public override bool Equals(object? obj)
    {
        return obj is OrderItem item && Id == item.Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
    #endregion
}
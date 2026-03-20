namespace Ecommerce.Api.Domain.Entities;

public class OrderItem
{
    #region Properties
    public Guid Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
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

    public OrderItem(string productName, decimal unitPrice, int quantity)
    {
        Id = Guid.NewGuid();
        ProductName = productName;
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
namespace Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Entities.Exceptions;

public class Product
{
    #region Properties
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion

    #region Relationships
    public List<OrderItem> OrderItems { get; set; } = new();
    public List<CartItem> CartItems { get; set; } = new();
    #endregion

    #region Constructors
    public Product() { }

    public Product(string name, string description, decimal price, int stock)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Price = price;
        Stock = stock;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    #endregion

    #region Methods
    public void Update(string name, string description, decimal price, int stock)
    {
        if (price < 0)
            throw new DomainException("Price cannot be negative");

        if (stock < 0)
            throw new DomainException("Stock cannot be negative");

        Name = name;
        Description = description;
        Price = price;
        Stock = stock;
        UpdatedAt = DateTime.UtcNow;
    }

    public override bool Equals(object? obj)
    {
        return obj is Product product && Id == product.Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
    #endregion
}
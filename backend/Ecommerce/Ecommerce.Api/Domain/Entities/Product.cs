namespace Ecommerce.Api.Domain.Entities;

using Ecommerce.Api.Domain.Entities.Exceptions;
using Ecommerce.Api.Domain.Enums;

public class Product
{
    #region Properties
    public Guid Id { get; private set; }
    public string? ImageUrl { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string? Info { get; private set; }
    public ProductType Type { get; private set; }
    public decimal Price { get; private set; }
    public int Stock { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;
    #endregion

    #region Relationships
    public List<OrderItem> OrderItems { get; private set; } = new();
    public List<CartItem> CartItems { get; private set; } = new();
    #endregion

    #region Constructors
    public Product() { }

    public Product(string? imageUrl, string name, string description, string? info, ProductType type, decimal price, int stock)
    {
        Validate(name, description, price, stock);

        Id = Guid.NewGuid();
        ImageUrl = imageUrl;
        Name = name;
        Description = description;
        Info = info;
        Type = type;
        Price = price;
        Stock = stock;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    #endregion

    #region Methods
    public void Update(string? imageUrl, string name, string description, string? info, ProductType type, decimal price, int stock)
    {
        Validate(name, description, price, stock);

        ImageUrl = imageUrl;
        Name = name;
        Description = description;
        Info = info;
        Type = type;
        Price = price;
        Stock = stock;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ToggleStatus()
    {
        IsActive = !IsActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool HasStock(int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity must be greater than zero");

        return Stock >= quantity;
    }

    public void ReduceStock(int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity must be greater than zero");

        if (Stock < quantity)
            throw new DomainException("Insufficient stock");

        Stock -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity must be greater than zero");

        Stock += quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    private static void Validate(string name, string description, decimal price, int stock)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Name is required");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Description is required");

        if (price < 0)
            throw new DomainException("Price cannot be negative");

        if (stock < 0)
            throw new DomainException("Stock cannot be negative");
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
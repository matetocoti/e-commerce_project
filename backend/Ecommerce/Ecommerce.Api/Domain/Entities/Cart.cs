namespace Ecommerce.Api.Domain.Entities;

public class Cart
{
    #region Properties
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    #endregion

    #region Relationships
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public List<CartItem> CartItems { get; set; } = new();
    #endregion

    #region Constructors
    public Cart() { }

    public Cart(User user)
    {
        Id = Guid.NewGuid();
        User = user;
        UserId = user.Id;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    #endregion

    #region Methods

    public void AddItem(Guid productId, int quantity)
    {
        var existingItem = CartItems.FirstOrDefault(ci => ci.ProductId == productId);

        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            CartItems.Add(new CartItem
            {
                ProductId = productId,
                Quantity = quantity
            });
        }
    }

    public override bool Equals(object? obj)
    {
        return obj is Cart cart && Id == cart.Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
    #endregion
}
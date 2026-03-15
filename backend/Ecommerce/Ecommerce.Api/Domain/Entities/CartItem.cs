namespace Ecommerce.Api.Domain.Entities;

public class CartItem
{
    #region Properties
    public Guid Id { get; set; }
    public int Quantity { get; set; }
    #endregion

    #region Relationships
    // Relationships (chaves FK)
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    #endregion

    #region Constructors
    public CartItem() { }

    public CartItem(Cart cart, Product product, int quantity)
    {
        Id = Guid.NewGuid();
        Cart = cart;
        CartId = cart.Id;
        Product = product;
        ProductId = product.Id;
        Quantity = quantity;
    }
    #endregion

    #region Methods
    public override bool Equals(object? obj)
    {
        return obj is CartItem item &&
               Id.Equals(item.Id);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Id);
    }
    #endregion
}
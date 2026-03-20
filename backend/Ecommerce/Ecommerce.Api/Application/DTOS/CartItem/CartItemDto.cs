namespace Ecommerce.Api.Application.DTOS.CartItem;

public class CartItemDto
{
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}
namespace Ecommerce.Api.Application.DTOS.CartItem;

public class AddCartItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}
namespace Ecommerce.Api.Application.DTOS.Cart;

using Ecommerce.Api.Application.DTOS.CartItem;

public class CartDto
{
    public Guid Id { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}
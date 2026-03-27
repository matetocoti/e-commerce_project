namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Cart;
using Ecommerce.Api.Application.DTOS.CartItem;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class CartService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task<CartDto> GetCartByUserIdAsync(Guid userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
            return new CartDto {Items = new List<CartItemDto>() };
        return MapToCartDto(cart);
    }

    public async Task AddItemToCartAsync(Guid userId, AddCartItemDto dto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
        {
            cart = new Cart { UserId = userId, CartItems = new List<CartItem>() };
            _context.Carts.Add(cart);
        }
        cart.AddItem(dto.ProductId ,dto.Quantity);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveItemFromCartAsync(Guid userId, Guid productId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null) return;
        var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
        if (item != null)
        {
            cart.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    private static CartDto MapToCartDto(Cart cart)
    {   
        return new CartDto
        {   
            Id = cart.Id,
            Items = cart.CartItems.Select(ci => new CartItemDto
            {
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                UnitPrice = ci.Product.Price,
                Quantity = ci.Quantity,
                Subtotal = ci.Quantity * ci.Product.Price
            }).ToList()
        };
    }
}




namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Cart;
using Ecommerce.Api.Application.DTOS.CartItem;
using Ecommerce.Api.Application.Exceptions;
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
            return new CartDto { Items = new List<CartItemDto>() };
        return MapToCartDto(cart);
    }

    public async Task AddItemToCartAsync(Guid userId, AddCartItemDto dto)
    {
        if (dto.Quantity <= 0)
            throw new BadRequestException("Quantity must be greater than 0.");

        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
            throw new NotFoundException("Product not found.");

        if (product.Stock < dto.Quantity)
            throw new BadRequestException("Insufficient product stock.");

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        
        if (cart == null)
        {
            cart = new Cart { UserId = userId, CartItems = new List<CartItem>() };
            _context.Carts.Add(cart);
        }
        
        cart.AddItem(dto.ProductId, dto.Quantity);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveItemFromCartAsync(Guid userId, Guid productId, int quantityToRemove = 0)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        
        if (cart == null)
            throw new NotFoundException("Cart not found.");

        var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
        
        if (item == null)
            throw new NotFoundException("Product not found in cart.");

        
        if (quantityToRemove <= 0)
        {
            cart.CartItems.Remove(item);
        }
        else if (quantityToRemove >= item.Quantity)
        {
            cart.CartItems.Remove(item);
        }
        else
        {
            item.Quantity -= quantityToRemove;
        }

        await _context.SaveChangesAsync();
    }

    public async Task ClearCartAsync(Guid userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
            throw new NotFoundException("Cart not found.");
        cart.CartItems.Clear();
        await _context.SaveChangesAsync();
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




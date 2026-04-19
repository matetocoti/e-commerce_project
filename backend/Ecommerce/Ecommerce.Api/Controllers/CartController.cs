namespace Ecommerce.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.CartItem;

using Microsoft.AspNetCore.Authorization;
using Ecommerce.Api.Application.Common.Interfaces;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController(CartService cartService ,ICurrentUserService currentUser) : ControllerBase
{
    
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = currentUser.GetUserId();
        var cart = await cartService.GetCartByUserIdAsync(userId);
        return Ok(cart);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddItem(AddCartItemDto dto)
    {
        var userId = currentUser.GetUserId();
        await cartService.AddItemToCartAsync(userId, dto);
        return Ok();
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem(Guid productId, [FromQuery] int? quantityToRemove = null)
    {
        var userId = currentUser.GetUserId();
        await cartService.RemoveItemFromCartAsync(userId, productId, quantityToRemove ?? 0);
        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = currentUser.GetUserId();
        await cartService.ClearCartAsync(userId);
        return NoContent();
    }

}

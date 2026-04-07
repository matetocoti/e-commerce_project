namespace Ecommerce.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.CartItem;
using Ecommerce.Api.Application.Exceptions;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController(CartService cartService) : ControllerBase
{
    #region Endpoints
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserIdFromToken();
        var cart = await cartService.GetCartByUserIdAsync(userId);
        return Ok(cart);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddItem(AddCartItemDto dto)
    {
        var userId = GetUserIdFromToken();
        await cartService.AddItemToCartAsync(userId, dto);
        return Ok();
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem(Guid productId, [FromQuery] int? quantityToRemove = null)
    {
        var userId = GetUserIdFromToken();
        await cartService.RemoveItemFromCartAsync(userId, productId, quantityToRemove ?? 0);
        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserIdFromToken();
        await cartService.ClearCartAsync(userId);
        return NoContent();
    }

    #endregion

    #region Helper Methods

    private Guid GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedException("Token inválido ou usuário não autenticado.");
        
        return userId;
    }
    #endregion
}

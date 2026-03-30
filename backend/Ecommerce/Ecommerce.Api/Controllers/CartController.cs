namespace Ecommerce.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.CartItem;
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
        try
        {
            var userId = GetUserIdFromToken();
            var cart = await cartService.GetCartByUserIdAsync(userId);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddItem(AddCartItemDto dto)
    {
        try
        {
            var userId = GetUserIdFromToken();
            await cartService.AddItemToCartAsync(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem(Guid productId)
    {
        var userId = GetUserIdFromToken();
        await cartService.RemoveItemFromCartAsync(userId, productId);
        return NoContent();
    }
    #endregion

    #region Helper Methods
    /// <summary>
    /// Extrai o ID do usuário do token JWT no contexto de autenticação.
    /// Garante que o usuário só possa acessar seu próprio carrinho.
    /// </summary>
    /// <returns>ID do usuário autenticado</returns>
    /// <exception cref="UnauthorizedAccessException">Lançada se o token não contiver um NameIdentifier válido</exception>
    private Guid GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedAccessException("Token inválido ou usuário não autenticado.");
        
        return userId;
    }
    #endregion
}

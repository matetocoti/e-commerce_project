namespace Ecommerce.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.CartItem;

[ApiController]
[Route("api/[controller]")]
public class CartController(CartService cartService) : ControllerBase
{
    #region Endpoints
    [HttpGet]
    public async Task<IActionResult> GetCart(Guid userId)
    {
        try
        {
            var cart = await cartService.GetCartByUserIdAsync(userId);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("add")]
    public async Task<IActionResult> AddItem(Guid userId, AddCartItemDto dto)
    {
        try
        {
            await cartService.AddItemToCartAsync(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem([FromQuery] Guid userId, Guid productId)
    {
        await cartService.RemoveItemFromCartAsync(userId, productId);
        return NoContent();
    }
    #endregion
}

namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController(OrderService orderService) : ControllerBase
{
    #region Endpoints
    
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
    {
        var userId = GetUserIdFromToken();
        var order = await orderService.CheckoutAsync(userId, dto);
        return Ok(order);
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetUserIdFromToken();
        var orders = await orderService.GetOrdersByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var userId = GetUserIdFromToken();
        var order = await orderService.GetOrderByIdAsync(id);
        
        
        if (order == null)
            throw new NotFoundException("Order not found.");
        
        return Ok(order);
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
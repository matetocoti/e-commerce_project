namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Common.Interfaces;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController(OrderService orderService ,ICurrentUserService currentUser) : ControllerBase
{
   
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
    {
        var userId = currentUser.GetUserId();
        var order = await orderService.CheckoutAsync(userId, dto);
        return Ok(order);
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = currentUser.GetUserId();
        var orders = await orderService.GetOrdersByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var userId = currentUser.GetUserId();
        var order = await orderService.GetOrderByIdAsync(id);
        if (order == null)
            throw new NotFoundException("Order not found.");
        return Ok(order);
    }
}
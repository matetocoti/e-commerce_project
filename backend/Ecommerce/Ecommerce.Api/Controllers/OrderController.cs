namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.DTOS.Order;
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
    public async Task<IActionResult> GetUserOrders(int page = 1,int pageSize = 5){
        var userId = currentUser.GetUserId();

        var orders = await orderService.GetOrdersByUserIdAsync(
            userId,
            page,
            pageSize
         );

        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var order = await orderService.GetOrderByIdAsync(id);
        return Ok(order);
    }

    [HttpGet("{id}/status")]
    public async Task<IActionResult> GetOrderStatusById(Guid id)
    {

        var orderStatus = await orderService.GetOrderStatusByIdAsync(id);
        return Ok(orderStatus);
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var userId = currentUser.GetUserId();
        await orderService.CancelOrderAsync(userId, id);
        return NoContent();
    }
}
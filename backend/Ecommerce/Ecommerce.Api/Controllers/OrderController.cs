namespace Ecommerce.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.Services;


[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    #region Endpoints
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(Guid userId)
    {
        try
        {
            var order = await _orderService.CheckoutAsync(userId);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders(Guid userId)
    {
        try
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    #endregion
}
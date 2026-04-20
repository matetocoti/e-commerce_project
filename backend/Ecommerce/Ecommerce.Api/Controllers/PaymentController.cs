namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.Common.Interfaces;
using Ecommerce.Api.Application.DTOS.Payment;
using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentController(PaymentService paymentService, ICurrentUserService currentUser) : ControllerBase
{
    [HttpPost("{orderId}")]
    public async Task<IActionResult> Pay(Guid orderId, [FromBody] PayOrderRequestDto request)
    {
        var userId = currentUser.GetUserId();
        await paymentService.PayOrderAsync(userId, orderId, request.Method);
        return NoContent();
    }
}
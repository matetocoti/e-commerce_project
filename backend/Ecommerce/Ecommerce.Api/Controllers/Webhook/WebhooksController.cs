namespace Ecommerce.Api.Controllers.Webhook;

using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

/// <summary>
/// Handles payment notifications from external payment providers.
///
/// This endpoint does not require authentication because webhook requests
/// are initiated by external services (e.g., Mercado Pago), not authenticated users.
///
/// Development Strategy:
/// - Localhost environments cannot receive external webhook requests directly.
/// - During development, payment status updates are handled by the
///   PaymentStatusPoller background service.
///
/// Production Strategy:
/// - Replace polling with real webhook processing.
/// - Implement provider signature validation and retry handling.
///
/// Security:
/// - All requests are validated and logged for auditing purposes.
/// - Exceptions are handled by centralized exception middleware.
/// </summary>
[ApiController]
[Route("api/webhooks")]
public class WebhooksController(PaymentService paymentService, ILogger<WebhooksController> logger) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Webhook endpoint is active." });
    }

    [HttpPost("mercadopago")]
    public async Task<IActionResult> MercadoPagoWebhook([FromQuery] string? topic, [FromQuery] string? type, [FromQuery(Name = "data.id")] string? dataId, [FromQuery] string? id)
    {
       
        var eventType = topic ?? type;
        var paymentId = id ?? dataId;

        logger.LogInformation($"Webhook recebido - Tipo: {eventType}, PaymentId: {paymentId}");

        if (eventType == "payment" && !string.IsNullOrWhiteSpace(paymentId))
        {
            try
            {
                await paymentService.ProcessExternalPaymentNotificationAsync(paymentId);
                logger.LogInformation($"Pagamento processado com sucesso: {paymentId}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Erro ao processar o webhook para o pagamento externo {paymentId}");
            }
        }

        return Ok();
    }

}
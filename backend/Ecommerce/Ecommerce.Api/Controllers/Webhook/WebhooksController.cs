namespace Ecommerce.Api.Controllers.Webhook;

using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Infrastructure.Payments.MercadoPagoProvider;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Infrastructure.Payments.MercadoPagoProvider;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;


[ApiController]
[Route("api/webhooks")]
public class WebhooksController(MercadoPagoService mercadoPagoService, PaymentService paymentService) : ControllerBase
{
}
namespace Ecommerce.Api.Application.Common.Interfaces;
using Ecommerce.Api.Domain.Enums;

// Interface para o serviço de pagamento, responsável por processar pagamentos de pedidos
public interface IPaymentService
{
    Task ProcessAsync(Guid orderId, PaymentMethod method);
}

namespace Ecommerce.Api.Infrastructure.Payments.MercadoPagoProvider;

using MercadoPago.Client.Payment;
using MercadoPago.Client.Common;
using MercadoPago.Resource.Payment;
using Ecommerce.Api.Application.Exceptions; 
using System.Threading.Tasks;

public class MercadoPagoService
{
    public async Task<Payment> CreatePixPaymentAsync(decimal amount, string description, string email, string cpf)
    {
        var client = new PaymentClient();

        var request = new PaymentCreateRequest
        {
            TransactionAmount = amount,
            Description = description,
            PaymentMethodId = "pix",
            Payer = new PaymentPayerRequest
            {
                Email = email,
                Identification = new IdentificationRequest
                {
                    Type = "CPF",
                    Number = cpf
                }
            }
        };
        try
        {
            Payment payment = await client.CreateAsync(request);
            return payment;
        }
        catch (MercadoPago.Error.MercadoPagoException ex)
        {
            var detail = ex.Message;
            throw new PaymentGatewayException($"Falha ao processar pagamento no provedor externo: {detail}");
        }
    }
}
namespace Ecommerce.Api.Infrastructure.Payments.MercadoPagoProvider;

using MercadoPago.Client.Payment;
using MercadoPago.Client.Common;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

public class MercadoPagoService
{
    private readonly MercadoPagoOptions _options;

    public MercadoPagoService(IOptions<MercadoPagoOptions> options)
    {
        _options = options.Value;
        MercadoPagoConfig.AccessToken = _options.AccessToken;
    }


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
        Payment payment = await client.CreateAsync(request);
        return payment;
    }
}
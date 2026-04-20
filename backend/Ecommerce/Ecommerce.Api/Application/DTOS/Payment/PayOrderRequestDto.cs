namespace Ecommerce.Api.Application.DTOS.Payment;

using Ecommerce.Api.Domain.Enums;


public class PayOrderRequestDto
{
    public PaymentMethod Method { get; set; }
}
namespace Ecommerce.Api.Application.DTOS.Payment;

using Ecommerce.Api.Domain.Enums;


public class CreatePaymentDto
{
    public Guid OrderId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
}
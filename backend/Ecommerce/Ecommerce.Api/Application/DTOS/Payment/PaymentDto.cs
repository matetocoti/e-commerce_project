namespace Ecommerce.Api.Application.DTOS.Payment;
using Ecommerce.Api.Domain.Enums;

public class PaymentDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime ?PaidAt { get; set; } 
    public string ?ExternalPaymentId { get; set; } = string.Empty; 

    public PixResponseDto? PixResponseDto { get; set; }
}
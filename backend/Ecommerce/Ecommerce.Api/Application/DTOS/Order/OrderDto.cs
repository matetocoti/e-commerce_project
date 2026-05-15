namespace Ecommerce.Api.Application.DTOS.Order;

using Ecommerce.Api.Application.DTOS.OrderItem;
using Ecommerce.Api.Application.DTOS.Payment;
using Ecommerce.Api.Domain.Entities.ValueObject;

public class OrderDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public Address? Address { get; set; }
    public DigitalContactInfo? DigitalContact { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public List<PaymentDto> Payments { get; set; } = new();

}
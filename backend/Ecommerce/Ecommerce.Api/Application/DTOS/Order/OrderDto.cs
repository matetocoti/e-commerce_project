namespace Ecommerce.Api.Application.DTOS.Order;

using Ecommerce.Api.Application.DTOS.OrderItem;

public class OrderDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}
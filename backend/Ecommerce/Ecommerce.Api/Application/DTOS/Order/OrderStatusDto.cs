namespace Ecommerce.Api.Application.DTOS.Order;

using Ecommerce.Api.Domain.Enums;

public class OrderStatusDto
{
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
}
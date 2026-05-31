namespace Ecommerce.Api.Application.DTOS.Order;


public class OrderStatusDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
}
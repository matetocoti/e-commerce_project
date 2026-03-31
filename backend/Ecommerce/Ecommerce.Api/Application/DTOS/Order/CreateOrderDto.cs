namespace Ecommerce.Api.Application.DTOS.Order;

public class CreateOrderDto
{
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
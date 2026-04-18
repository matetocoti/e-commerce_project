namespace Ecommerce.Api.Application.DTOS.Order;

public class CreateOrderDto
{
    // Physical
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? ZipCode { get; set; }
    public string? State { get; set; }
    public string? Notes { get; set; }

    // Digital
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}
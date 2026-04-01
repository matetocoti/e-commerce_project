using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.Application.DTOS.Order;

public class CreateOrderDto
{
    [Required]
    public string Street { get; set; } = string.Empty;
    [Required]
    public string City { get; set; } = string.Empty;
    [Required]
    public string ZipCode { get; set; } = string.Empty;
    [Required]
    public string State { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
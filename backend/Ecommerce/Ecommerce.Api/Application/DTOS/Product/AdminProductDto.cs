namespace Ecommerce.Api.Application.DTOS.Product;

using Ecommerce.Api.Domain.Enums;



public class AdminProductDto
{
    public Guid Id { get; set; }
    public string? ImageUrl { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Info { get; set; }
    public ProductType Type { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
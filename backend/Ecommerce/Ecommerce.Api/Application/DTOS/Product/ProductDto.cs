namespace Ecommerce.Api.Application.DTOS.Product;

public class ProductDto
{
    public Guid Id { get; set; }
    public string? ImageUrl { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Info { get; set; }
    public string Type { get; set; } = string.Empty;
}
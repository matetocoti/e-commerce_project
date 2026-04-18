namespace Ecommerce.Api.Application.DTOS.Product;

public class CreateProductDto
{
    public string? ImageUrl { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Info { get; set; }
    public int Type { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}
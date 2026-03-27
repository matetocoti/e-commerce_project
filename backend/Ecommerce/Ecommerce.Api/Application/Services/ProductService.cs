namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


public class ProductService(AppDbContext context)
{

    #region Methods
    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        var products = await context.Products.Where(p => p.IsActive).ToListAsync();
        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product == null)
            throw new KeyNotFoundException("Product not found.");
        return MapToDto(product);
    }


    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
        };
    }

    #endregion
}
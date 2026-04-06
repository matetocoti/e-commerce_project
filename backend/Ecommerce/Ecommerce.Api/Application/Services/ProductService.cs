namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


public class ProductService(AppDbContext context)
{

    #region Methods

    #region public methods
    public async Task<List<ProductDto>> GetAllAsync(int page, int pageSize)
    {
        return await context.Products
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description
            })
            .ToListAsync();
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product == null)
            throw new KeyNotFoundException("Product not found.");
        return MapToDto(product);
    }



    #endregion

    #region admin methods
    public async Task<AdminProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product(dto.Name, dto.Description, dto.Price, dto.Stock);
        context.Products.Add(product);
        await context.SaveChangesAsync();
        return MapToAdminDto(product);
    }

    public async Task<AdminProductDto> GetProductAdminAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new KeyNotFoundException("Product not found.");
        return MapToAdminDto(product);
    }

    public async Task<List<AdminProductDto>> GetAllProductsAdminAsync(int page, int pageSize)
    {
        return await context.Products
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new AdminProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                Stock = p.Stock,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();
    }

    #endregion

    #region private methods
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
    private AdminProductDto MapToAdminDto(Product product)
    {
        return new AdminProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
    #endregion


    #endregion
}
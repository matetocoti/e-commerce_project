namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Api.Domain.Enums;


public class ProductService(AppDbContext context)
{

    #region Methods

    #region public methods
    public async Task<List<ProductDto>> GetAllAsync(int page, int pageSize)
    {
        var products = await context.Products
            .Where(p => p.IsActive)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product == null)
            throw new NotFoundException("Product not found.");
        return MapToDto(product);
    }

    public async Task<List<ProductDto>> SearchProductsAsync(string query, int page, int pageSize)
    {
        var products = await context.Products
            .Where(p => p.IsActive && (p.Name.Contains(query) || p.Description.Contains(query)))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return products.Select(MapToDto).ToList();
    }

    #endregion

    #region admin methods
    public async Task<AdminProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product(dto.ImageUrl, dto.Name, dto.Description, dto.Info, dto.Type, dto.Price, dto.Stock);
        context.Products.Add(product);
        await context.SaveChangesAsync();
        return MapToAdminDto(product);
    }

    public async Task<AdminProductDto> GetProductAdminAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new NotFoundException("Product not found.");
        return MapToAdminDto(product);
    }

    public async Task<List<AdminProductDto>> GetAllProductsAdminAsync(int page, int pageSize)
    {
        var products = await context.Products
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
             .ToListAsync();
        return products.Select(MapToAdminDto).ToList();
    }

    public async Task<AdminProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new NotFoundException("Product Not Found!");
        product.Update(dto.ImageUrl, dto.Name, dto.Description, dto.Info, dto.Type, dto.Price, dto.Stock);
        await context.SaveChangesAsync();
        return MapToAdminDto(product);
    }
    
    public async Task DeactivateProductAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new NotFoundException("Product Not Found!");
        product.Deactivate();
        await context.SaveChangesAsync();
    }

    #endregion

    #region private methods
    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            ImageUrl = product.ImageUrl,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Info = product.Info,
            Type = product.Type
        };
    }
    private AdminProductDto MapToAdminDto(Product product)
    {
        return new AdminProductDto
        {
            Id = product.Id,
            ImageUrl = product.ImageUrl,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            Info = product.Info,
            Type = product.Type
        };
    }
    #endregion

    #endregion
}
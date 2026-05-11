namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Api.Application.Common.Extensions;
using Ecommerce.Api.Application.DTOS.Product.queries;

public class ProductService(AppDbContext context)
{

    #region public methods
    public async Task<List<ProductDto>> GetAllAsync(PublicProductQueryParams query)
    {

       var filters = new AdminProductQueryParams
        {
            Page = query.Page,
            PageSize = query.PageSize,
            Search = query.Search,
            Type = query.Type,
            MinPrice = query.MinPrice,
            MaxPrice = query.MaxPrice,
            IsActive = true // Only active products for public queries
        };

        var productsQuery = context.Products
            .AsQueryable()
            .ApplyFilters(filters);

        var products = await productsQuery
            .OrderByDescending(p => !string.IsNullOrWhiteSpace(p.ImageUrl))
            .ThenBy(p => p.Name)
            .ThenBy(p => p.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
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

    public async Task<List<AdminProductDto>> GetAllProductsAdminAsync(AdminProductQueryParams query)
    {
        
        var productsQuery = context.Products
            .AsQueryable()
            .ApplyFilters(query);


        var products = await productsQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
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

    public async Task ToggleProductStatusAsync(Guid id)
    {
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            throw new NotFoundException("Product not found!");

        product.ToggleStatus();

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
}
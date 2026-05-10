namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Api.Domain.Enums;
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

        var productsQuery = ApplyFilters(context.Products.AsQueryable(), filters);

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
        

        var productsQuery = ApplyFilters(context.Products.AsQueryable(), query);

        
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


    #region Delete after frontend implementation
    public async Task DeactivateProductAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new NotFoundException("Product Not Found!");
        product.Deactivate();
        await context.SaveChangesAsync();
    }

    public async Task ActivateProductAsync(Guid id)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new NotFoundException("Product Not Found!");
        product.Activate();
        await context.SaveChangesAsync();
    }
    #endregion

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

    // Centralized filtering logic for product queries.
    // Used by both public and admin endpoints to ensure consistency and
    // provide a single point of maintenance for all filtering rules.
    private static IQueryable<Product> ApplyFilters(IQueryable<Product> query,AdminProductQueryParams filters)
    {
        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        if (filters.Type.HasValue)
            query = query.Where(p => p.Type == filters.Type.Value);

        if (filters.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filters.MinPrice.Value);

        if (filters.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filters.MaxPrice.Value);

        if (filters.HasImage.HasValue)
        {
            query = filters.HasImage.Value
                ? query.Where(p => !string.IsNullOrWhiteSpace(p.ImageUrl))
                : query.Where(p => string.IsNullOrWhiteSpace(p.ImageUrl));
        }

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var normalizedSearch = filters.Search.Trim().ToLower();

            query = query.Where(p =>
                p.Name.ToLower().Contains(normalizedSearch) ||
                p.Description.ToLower().Contains(normalizedSearch)
            );
        }

        return query;
    }
    #endregion
}
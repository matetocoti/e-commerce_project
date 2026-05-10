using Ecommerce.Api.Application.DTOS.Product.queries;
using Ecommerce.Api.Domain.Entities;

namespace Ecommerce.Api.Application.Common.Extensions;



// Moved to a dedicated extension class to improve
// maintainability, readability and reuse.

// My own words:
// My own code was getting really big and complex for the ProductService class, so I decided to extract the filtering logic into a separate extension method. This way, the code is cleaner, easier to maintain, and can be reused across different parts of the application.
public static class ProductQueryExtensions
{
    // Centralized filtering logic for product queries.
    // Used by both public and admin endpoints to ensure consistency and
    // provide a single point of maintenance for all filtering rules.
    public static IQueryable<Product> ApplyFilters(this IQueryable<Product> query, AdminProductQueryParams filters)
    {
        if (filters.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filters.IsActive.Value);

        if (filters.Type.HasValue)
            query = query.Where(p => p.Type == filters.Type.Value);

        if (filters.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filters.MinPrice.Value);

        if (filters.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filters.MaxPrice.Value);

        if (filters.OutOfStock == true)
        {
            query = query.Where(p => p.Stock == 0);
        }
        else if (filters.HasLowStock == true)
        {
            query = query.Where(p => p.Stock > 0 && p.Stock <= 5);
        }
        else
        {
            if (filters.OutOfStock == false)
                query = query.Where(p => p.Stock > 0);

            if (filters.HasLowStock == false)
                query = query.Where(p => p.Stock > 5);
        }

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
}

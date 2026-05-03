using Ecommerce.Api.Domain.Enums;

namespace Ecommerce.Api.Application.DTOS.Product;


public class PublicProductQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 5;

    public ProductType? Type { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

}
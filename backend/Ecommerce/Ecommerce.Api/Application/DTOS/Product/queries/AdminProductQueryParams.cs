namespace Ecommerce.Api.Application.DTOS.Product.queries;
public class AdminProductQueryParams : PublicProductQueryParams
{
    public bool? IsActive { get; set; }
}
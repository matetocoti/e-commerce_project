namespace Ecommerce.Api.Application.DTOS.Product;
public class AdminProductQueryParams : PublicProductQueryParams
{
    public bool? IsActive { get; set; }
}
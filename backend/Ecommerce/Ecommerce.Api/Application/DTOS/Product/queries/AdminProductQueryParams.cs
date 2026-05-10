namespace Ecommerce.Api.Application.DTOS.Product.queries;
public class AdminProductQueryParams : PublicProductQueryParams
{
    public bool? IsActive { get; set; }
    public bool? HasImage { get; set; }

    public bool? HasLowStock { get; set; }
    public bool? OutOfStock { get; set; }
}
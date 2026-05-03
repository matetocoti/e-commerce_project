namespace Ecommerce.Api.Controllers;

using Ecommerce.Api.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Application.DTOS.Product.queries;

[ApiController]
[Route("api/[controller]")]
public class ProductController(ProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllProducts([FromQuery] PublicProductQueryParams query)
    {
        var result = await productService.GetAllAsync(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var result = await productService.GetProductByIdAsync(id);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProducts(string query, int page = 1, int pageSize = 2)
    {
        var result = await productService.SearchProductsAsync(query, page, pageSize);
        return Ok(result);
    }
}
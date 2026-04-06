using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/Product")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class AdminProductController(ProductService productService) : ControllerBase
{


    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        try
        {
            var product = await productService.GetProductAdminAsync(id);
            return Ok(product);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts(int page = 1, int pageSize = 2)
    {
        var products = await productService.GetAllProductsAdminAsync(page, pageSize);
        return Ok(products);
    }


    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var createdProduct = await productService.CreateProductAsync(dto);
        return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
    }

 
}
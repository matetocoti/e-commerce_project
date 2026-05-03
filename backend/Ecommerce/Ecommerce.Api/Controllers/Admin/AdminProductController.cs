namespace Ecommerce.Api.Controllers.Admin;


using Ecommerce.Api.Application.DTOS.Product;
using Ecommerce.Api.Application.DTOS.Product.queries;
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
        var product = await productService.GetProductAdminAsync(id);
        return Ok(product);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts([FromQuery] AdminProductQueryParams query)
    {
        var products = await productService.GetAllProductsAdminAsync(query);
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var createdProduct = await productService.CreateProductAsync(dto);
        return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
    {
        var updatedProduct = await productService.UpdateProductAsync(id, dto);
        return Ok(updatedProduct);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeactivateProduct(Guid id)
    {
        await productService.DeactivateProductAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/activate")]
    public async Task<IActionResult> ActivateProduct(Guid id)
    {
        await productService.ActivateProductAsync(id);
        return NoContent();
    }
}
namespace Ecommerce.Api.Application.Services.Background;

using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;


public class ProductStockManagementService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ProductStockManagementService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(5); 

    public ProductStockManagementService(IServiceProvider serviceProvider,ILogger<ProductStockManagementService> logger){
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Serviço de gerenciamento de estoque iniciado");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ManageProductStockAsync();
                await Task.Delay(_interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Serviço de gerenciamento de estoque parado");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao gerenciar estoque de produtos");
            }
        }
    }

    private async Task ManageProductStockAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Encontra produtos ativos com estoque = 0
        var productsOutOfStock = await context.Products
            .Where(p => p.IsActive && p.Stock == 0)
            .ToListAsync();

        if (!productsOutOfStock.Any())
        {
            _logger.LogDebug("Nenhum produto sem estoque encontrado");
            return;
        }

        // Desativa cada produto
        foreach (var product in productsOutOfStock)
        {
            if (product.IsActive)
            {
                product.ToggleStatus();
                _logger.LogInformation($"Produto desativado: {product.Name} (ID: {product.Id})");
            }
        }

        context.Products.UpdateRange(productsOutOfStock);
        await context.SaveChangesAsync();

        _logger.LogInformation($"{productsOutOfStock.Count} produtos foram desativados por falta de estoque");
    }
}
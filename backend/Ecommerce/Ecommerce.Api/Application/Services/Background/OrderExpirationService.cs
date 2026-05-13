namespace Ecommerce.Api.Application.Services.Background;

using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ecommerce.Api.Domain.Entities;


public class OrderExpirationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderExpirationService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

    public OrderExpirationService(IServiceProvider serviceProvider, ILogger<OrderExpirationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Serviço de expiração de pedidos iniciado");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireOrdersAsync();
                await Task.Delay(_interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Serviço de expiração de pedidos parado");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao expirar pedidos");
            }
        }
    }

    private async Task ExpireOrdersAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        
        var expiredOrders = await context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Status == OrderStatus.AwaitingPayment && DateTime.UtcNow >= o.ExpiresAt)
            .ToListAsync();

        if (!expiredOrders.Any())
        {
            _logger.LogDebug("Nenhum pedido expirado encontrado");
            return;
        }

        
        foreach (var order in expiredOrders)
        {
            try
            {
                order.Expire();
                ReplenishProductStock(order);
                _logger.LogInformation($"Pedido expirado: {order.Id} - Estoque restituído");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao expirar pedido {order.Id}");
            }
        }

        context.Orders.UpdateRange(expiredOrders);
        await context.SaveChangesAsync();

        _logger.LogInformation($"{expiredOrders.Count} pedidos foram expirados com sucesso");
    }

    private void ReplenishProductStock(Order order)
    {
        foreach (var orderItem in order.OrderItems)
        {
            var product = orderItem.Product;
            product.IncreaseStock(orderItem.Quantity);
            if (!product.IsActive && product.Stock > 0)
            {
                product.ToggleStatus();
            }
        }
    }
}
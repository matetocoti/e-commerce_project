namespace Ecommerce.Api.Application.Services;

using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
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
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireOrdersAsync();
                await Task.Delay(_interval, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao expirar pedidos");
            }
        }
    }

    private async Task ExpireOrdersAsync()
    {

        // Create a new scope lifetime to get a new instance of AppDbContext
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var expiredOrders = await context.Orders
            .Where(o => o.Status == OrderStatus.AwaitingPayment && DateTime.UtcNow >= o.ExpiresAt)
            .ToListAsync();

        if (!expiredOrders.Any())
            return;

        ExpireEachOrder(expiredOrders);

        context.Orders.UpdateRange(expiredOrders);
        await context.SaveChangesAsync();

        _logger.LogInformation($"{expiredOrders.Count} pedidos foram expirados");
    }

    private void ExpireEachOrder(List<Order> expiredOrders)
    {
        foreach (var order in expiredOrders)
        {
            order.Expire();
        }
    }
}
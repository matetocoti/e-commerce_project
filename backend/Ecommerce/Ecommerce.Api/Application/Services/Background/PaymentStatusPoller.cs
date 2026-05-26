namespace Ecommerce.Api.Application.Services.Background;

using Ecommerce.Api.Application.Services;
using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Background service that polls payment status every 15 seconds.
/// 
/// DEVELOPMENT ONLY - This is a temporary solution for local testing.
/// 
/// Instead of relying on real-time webhooks (which can't be triggered on localhost),
/// this poller checks ONE pending payment every 15 seconds to simulate webhook behavior.
/// 
/// In production, replace with actual webhook integration from Mercado Pago.
/// </summary>
public class PaymentStatusPoller(IServiceScopeFactory scopeFactory, ILogger<PaymentStatusPoller> logger) : BackgroundService
{
    private const int PollingIntervalSeconds = 15;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("PaymentStatusPoller started - Checking payment status every {IntervalSeconds} seconds", PollingIntervalSeconds);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckNextPendingPaymentAsync();
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation("PaymentStatusPoller stopped");
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in PaymentStatusPoller loop");
            }

            await Task.Delay(TimeSpan.FromSeconds(PollingIntervalSeconds), stoppingToken);
        }
    }


    private async Task CheckNextPendingPaymentAsync()
    {
        using var scope = scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var paymentService = scope.ServiceProvider.GetRequiredService<PaymentService>();

        
        var order = await context.Orders
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Status == OrderStatus.AwaitingPayment
                                    && o.Payments.Any(p => p.Status == PaymentStatus.Pending));

        if (order == null)
        {
            logger.LogDebug("No orders with pending payments found");
            return;
        }

        
        var pendingPayment = order.Payments
            .FirstOrDefault(p => p.Status == PaymentStatus.Pending && !string.IsNullOrEmpty(p.ExternalPaymentId));

        if (pendingPayment == null)
        {
            logger.LogDebug("No pending payments found in order {OrderId}", order.Id);
            return;
        }

        try
        {
            logger.LogInformation("Polling payment status - OrderId: {OrderId}, PaymentId: {PaymentId}, ExternalId: {ExternalPaymentId}",
                order.Id, pendingPayment.Id, pendingPayment.ExternalPaymentId);

            await paymentService.ProcessExternalPaymentNotificationAsync(pendingPayment.ExternalPaymentId);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to check payment status for Order: {OrderId}, Payment: {PaymentId}", order.Id, pendingPayment.Id);
        }
    }
}
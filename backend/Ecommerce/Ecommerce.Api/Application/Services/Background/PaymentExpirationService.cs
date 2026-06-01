namespace Ecommerce.Api.Application.Services.Background;

using Ecommerce.Api.Domain.Entities;
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
/// Background service that automatically expires pending payments older than 24 hours.
/// 
/// Purpose: Clean up expired pending payments using the domain's ExpirePendingPayment method.
/// Runs every 5 minutes to keep the database clean without heavy load.
/// </summary>
public class PaymentExpirationService(IServiceScopeFactory scopeFactory, ILogger<PaymentExpirationService> logger) : BackgroundService
{
    private const int CheckIntervalMinutes = 5;
    private const int PaymentExpirationHours = 24;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("PaymentExpirationService started - Expiring pending payments older than {Hours} hours every {Minutes} minutes",
            PaymentExpirationHours, CheckIntervalMinutes);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireOldPendingPaymentsAsync();
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation("PaymentExpirationService stopped");
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in PaymentExpirationService");
            }

            await Task.Delay(TimeSpan.FromMinutes(CheckIntervalMinutes), stoppingToken);
        }
    }

  
    private async Task ExpireOldPendingPaymentsAsync()
    {
        using var scope = scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var expirationThreshold = DateTime.UtcNow.AddHours(-PaymentExpirationHours);

        
        var expiredPayments = await context.Payments
            .Where(p => p.Status == PaymentStatus.Pending && p.CreatedAt < expirationThreshold)
            .ToListAsync();

        if (expiredPayments.Count == 0)
        {
            logger.LogDebug("No expired pending payments found");
            return;
        }

        
        foreach (var payment in expiredPayments)
        {
            Payment.ExpirePendingPayment(payment);
        }

        context.Payments.UpdateRange(expiredPayments);
        await context.SaveChangesAsync();

        logger.LogInformation("Successfully expired {Count} pending payments (older than {Hours} hours)",
            expiredPayments.Count, PaymentExpirationHours);
    }
}


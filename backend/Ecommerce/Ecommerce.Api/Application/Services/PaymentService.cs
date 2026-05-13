using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Application.Services;

public class PaymentService(AppDbContext context)
{
    

    #region public methods

    public async Task PayOrderAsync(Guid userId, Guid orderId, PaymentMethod method)
    {
        
        var order = await GetOrderAsync(userId, orderId);
       
        var payment = CreatePayment(order, method);
        order.AddPayment(payment);


        context.Payments.Add(payment);
        await context.SaveChangesAsync();
    }

    #endregion

    #region private methods

   
    private async Task<Order> GetOrderAsync(Guid userId, Guid orderId)
    {
        var order = await context.Orders
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
         

        if (order == null)
            throw new NotFoundException("Order not found.");

        return order;
    }

    private Payment CreatePayment(Order order, PaymentMethod method)
    {
        // OBS: Fake mode (ambiente dev/teste)
        if (IsFakeMode())
        {
            return Payment.CreateConfirmed(
                order.TotalAmount,
                method,
                order.Id
            );
        }

        // Fluxo real (ainda não implementado)
        if (method == PaymentMethod.PIX)
            throw new BadRequestException("Payment method not available.");

        if (method == PaymentMethod.LIGHTNING)
            throw new BadRequestException("Payment method not available.");

        throw new BadRequestException("Invalid payment method.");
    }

    // If necessary ,disable fake mode and implement real payment processing logic (e.g., integrating with a payment gateway).
    // If it is on fake mode, it will create a confirmed payment without actually processing it.
    private bool IsFakeMode()
    {
        return true; // depois trocar por config
    }

    #endregion

    
}
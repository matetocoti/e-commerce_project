namespace Ecommerce.Api.Application.Services;

using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Ecommerce.Api.Infrastructure.Payments.MercadoPagoProvider; 
using Microsoft.EntityFrameworkCore;
using Ecommerce.Api.Application.Common.Security;
using Ecommerce.Api.Application.DTOS.Payment;




public class PaymentService(AppDbContext context, MercadoPagoService mercadoPagoService)
{
    #region public methods

    
    public async Task<PaymentDto> PayOrderAsync(Guid userId, Guid orderId, PayOrderRequestDto request)
    {
        var order = await GetOrderAsync(userId, orderId);
        var (payment, paymentDto) = await CreatePaymentAsync(order, request);
        order.AddPayment(payment);
        context.Payments.Add(payment);
        await context.SaveChangesAsync();
        return paymentDto;
    }

    public async Task ProcessExternalPaymentNotificationAsync(string externalPaymentId)
    {
      
        if (!long.TryParse(externalPaymentId, out long mpPaymentId))
            return; 

        var mpPaymentDetails = await mercadoPagoService.GetPaymentByIdAsync(mpPaymentId);

        if (mpPaymentDetails.Status != "approved")
            return;

        var payment = await context.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.ExternalPaymentId == externalPaymentId)
            ?? throw new NotFoundException($"Payment with external ID {externalPaymentId} not found.");

        var order = payment.Order
            ?? throw new NotFoundException("Order associated with payment not found.");

        if (payment.Status == PaymentStatus.Confirmed)
            return;

        payment.MarkAsConfirmed();
        order.MarkAsPaid();

        context.Payments.Update(payment);
        context.Orders.Update(order);
        await context.SaveChangesAsync();
    }

    #endregion

    #region private methods

    private async Task<Order> GetOrderAsync(Guid userId, Guid orderId)
    {
        var order = await context.Orders
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId)
            ?? throw new NotFoundException("Order not found.");
        return order;
    }


    
    private async Task<(Payment ,PaymentDto)> CreatePaymentAsync(Order order, PayOrderRequestDto request)
    {
        IsDataValid(request.CustomerEmail, request.CustomerCpf);

        // To test the integration without hitting the real gateway, we can return fake data when in "fake mode". In production, this would be false.
        if (IsFakeMode())
        {
            var fakePayment = Payment.CreateConfirmed(order.TotalAmount, request.Method, order.Id);
            return (fakePayment, new PaymentDto { 
                Amount = fakePayment.Amount, 
                Method = fakePayment.Method, 
                PixResponseDto = new PixResponseDto { 
                    PixCopyAndPaste = "FAKE_PIX_CODE_12345", 
                    PixLink = "FAKE_PIX_LINK_12345" 
                }
            });
        }

        if (request.Method == PaymentMethod.PIX)
        {
            
            var description = $"Pedido {order.Id}";
            var mpResponse = await mercadoPagoService.CreatePixPaymentAsync(order.TotalAmount, description, request.CustomerEmail, request.CustomerCpf);

            // Create a pending payment record in our system with the external payment ID from MercadoPago
            var payment = Payment.CreatePending(
                order.TotalAmount,
                request.Method,
                order.Id,
                mpResponse.Id?.ToString() ?? throw new BadRequestException("Failed to get external payment ID") 
            );

            
            var pixData = new { 
                QrCode = mpResponse.PointOfInteraction?.TransactionData?.QrCodeBase64 ?? "",
                LinkPix = mpResponse.PointOfInteraction?.TransactionData?.TicketUrl ?? ""
            };


            PaymentDto paymentR = new PaymentDto
            {
                Amount = payment.Amount,
                Method = payment.Method,
                ExternalPaymentId = payment.ExternalPaymentId,
                PixResponseDto = new PixResponseDto
                {
                    PixCopyAndPaste = pixData.QrCode,
                    PixLink = pixData.LinkPix
                }
            };


            return (payment, paymentR);
        }

        throw new BadRequestException("Payment method not available.");
    }

    private static bool IsFakeMode()
    {
        return true; // Mudamos para false para testar a integração
    }

    #endregion

    private static bool IsDataValid(string email, string cpf)
    {
        var (isEmailValid, emailMessage) = EmailValidator.Validate(email);
        if (!isEmailValid)
            throw new BadRequestException(emailMessage);
        var (isCpfValid, cpfMessage) = CpfValidator.Validate(cpf);
        if (!isCpfValid)
            throw new BadRequestException(cpfMessage);
        return true;
    }
}
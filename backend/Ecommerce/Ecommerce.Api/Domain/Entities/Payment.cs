namespace Ecommerce.Api.Domain.Entities;

using Ecommerce.Api.Domain.Entities.Exceptions;
using Ecommerce.Api.Domain.Enums;

public class Payment
{
    #region Properties

    public Guid Id { get; private set; }
    public decimal Amount { get; private set; }
    public PaymentMethod Method { get; private set; }
    public PaymentStatus Status { get; private set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; private set; }
    public string? ExternalPaymentId { get; private set; }

    #endregion

    #region Relationships

    public Guid OrderId { get; private set; }
    public Order Order { get; private set; } = null!;

    #endregion

    #region Constructors

    
    private Payment() { }

    public Payment(decimal amount, PaymentMethod method, Guid orderId)
    {
        Id = Guid.NewGuid();
        Amount = amount;
        Method = method;
        Status = PaymentStatus.Pending;

        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;

        OrderId = orderId;
    }

    #endregion

    #region Methods

    public void MarkAsConfirmed()
    {
        if (Status == PaymentStatus.Confirmed)
            return;

        if (Status != PaymentStatus.Pending)
            throw new DomainException("Only pending payments can be confirmed.");

        Status = PaymentStatus.Confirmed;
        ConfirmedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }


    public static Payment CreatePending(decimal amount, PaymentMethod method, Guid orderId, string externalPaymentId)
    {
        var payment = new Payment(amount, method, orderId)
        {
            ExternalPaymentId = externalPaymentId 
        };

        return payment;
    }

    public static Payment CreateConfirmed(decimal amount, PaymentMethod method, Guid orderId)
    {
        var payment = new Payment(amount, method, orderId);
        payment.MarkAsConfirmed();
        return payment;
    }

    public static void ExpirePendingPayment(Payment payment)
    {
        
        if (payment.Status != PaymentStatus.Pending)
            throw new DomainException("Only pending payments can be expired.");
        if (!(payment.CreatedAt < DateTime.UtcNow.AddHours(-24)))
            throw new DomainException("Only payments that have been pending for more than 24 hours can be expired.");
        payment.Status = PaymentStatus.Expired;
        payment.UpdatedAt = DateTime.UtcNow;
    }

    #endregion

    #region Equality

    public override bool Equals(object? obj)
    {
        return obj is Payment payment && Id == payment.Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }

    #endregion
}
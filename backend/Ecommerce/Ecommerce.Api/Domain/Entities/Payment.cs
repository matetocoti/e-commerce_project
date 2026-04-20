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

    // Marca quando o pagamento foi confirmado
    public DateTime? ConfirmedAt { get; private set; }

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

    public static Payment CreateConfirmed(decimal amount, PaymentMethod method, Guid orderId)
    {
        var payment = new Payment(amount, method, orderId);
        payment.MarkAsConfirmed();
        return payment;
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
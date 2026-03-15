namespace Ecommerce.Api.Domain.Entities;

using Ecommerce.Api.Domain.Enums;

public class Payment
{
    #region Properties
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Marca quando o pagamento foi confirmado (pode ser nulo até confirmação)
    public DateTime? ConfirmedAt { get; set; }
    #endregion

    #region Relationships
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    #endregion

    #region Constructors
    public Payment() { }

    public Payment(decimal amount, PaymentMethod method, Order order)
    {
        Id = Guid.NewGuid();
        Amount = amount;
        Method = method;
        Status = PaymentStatus.Pending;

        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        ConfirmedAt = null;

        Order = order;
        OrderId = order.Id;
    }
    #endregion

    #region Methods
    public void UpdateStatus(PaymentStatus status)
    {
        if (Status == status) return;

        Status = status;
        UpdatedAt = DateTime.UtcNow;

        if (status == PaymentStatus.Confirmed)
            ConfirmedAt = DateTime.UtcNow;
    }

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
namespace Ecommerce.Api.Domain.Entities.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message){}
}
using System.ComponentModel.DataAnnotations;
using Ecommerce.Api.Application.Exceptions;

namespace Ecommerce.Api.Application.Common.Security;

public static class EmailValidator
{
    private const int MaxEmailLength = 254;

    public static (bool IsValid, string ErrorMessage) Validate(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return (false, "Email is required.");

        email = email.Trim().ToLower();

        if (email.Length > MaxEmailLength)
            return (false, $"Email must not exceed {MaxEmailLength} characters.");

        var emailValidator = new EmailAddressAttribute();
        if (!emailValidator.IsValid(email))
            return (false, "Invalid email format.");

        if (email.StartsWith(".") || email.EndsWith("."))
            return (false, "Email cannot start or end with a dot.");

        if (email.Contains(".."))
            return (false, "Email cannot contain consecutive dots.");

        var localPart = email.Split('@')[0];
        if (localPart.Length > 64)
            return (false, "Local part of email must not exceed 64 characters.");

        return (true, string.Empty);
    }
}
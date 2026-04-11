namespace Ecommerce.Api.Application.Common.Security;

public static class PhoneValidator
{
    private const int MinLength = 10;
    private const int MaxLength = 11;
    public static (bool IsValid, string ErrorMessage) Validate(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return (true, string.Empty);
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        if (digits.Length < MinLength || digits.Length > MaxLength)
            return (false, "Phone number must have between 10 and 11 digits.");
        return (true, string.Empty);
    }
}
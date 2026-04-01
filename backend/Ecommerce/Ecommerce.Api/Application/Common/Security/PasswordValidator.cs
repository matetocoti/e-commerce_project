namespace Ecommerce.Api.Application.Common.Security;

public static class PasswordValidator
{
    private const int MinLength = 8;
    private const int MaxLength = 128;

    public static (bool IsValid, string ErrorMessage) Validate(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return (false, "Password cannot be empty.");

        if (password.Length < MinLength)
            return (false, $"Password must be at least {MinLength} characters long.");

        if (password.Length > MaxLength)
            return (false, $"Password must not exceed {MaxLength} characters.");

        if (password.Any(char.IsWhiteSpace))
            return (false, "Password cannot contain whitespace characters.");

        bool hasUpperCase = false;
        bool hasLowerCase = false;
        bool hasDigit = false;
        bool hasSpecialChar = false;

        foreach (char c in password)
        {
            if (char.IsUpper(c)) hasUpperCase = true;
            else if (char.IsLower(c)) hasLowerCase = true;
            else if (char.IsDigit(c)) hasDigit = true;
            else if (!char.IsLetterOrDigit(c)) 
                hasSpecialChar = true;

            if (hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar)
                break;
        }

        if (!hasUpperCase)
            return (false, "Password must contain at least one uppercase letter (A-Z).");

        if (!hasLowerCase)
            return (false, "Password must contain at least one lowercase letter (a-z).");

        if (!hasDigit)
            return (false, "Password must contain at least one digit (0-9).");

        if (!hasSpecialChar)
            return (false, "Password must contain at least one special character (!@#$%^&*).");

        return (true, string.Empty);
    }
}
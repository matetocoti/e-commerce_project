namespace Ecommerce.Api.Application.Common.Security;


public static class CpfValidator
{
    private const int CpfLength = 11;
    private const int FirstDigitPosition = 9;
    private const int SecondDigitPosition = 10;
    private const int VerificationDivisor = 11;

    public static (bool IsValid, string ErrorMessage) Validate(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return (false, "CPF cannot be empty.");

        
        var sanitizedCpf = new string(cpf.Where(char.IsDigit).ToArray());

        if (sanitizedCpf.Length != CpfLength)
            return (false, $"CPF must contain exactly {CpfLength} digits.");
        if (sanitizedCpf.Distinct().Count() == 1)
            return (false, "CPF is invalid: all digits are the same.");

        var digits = ExtractDigits(sanitizedCpf);

        
        var firstDigitValidation = ValidateCheckDigit(digits, FirstDigitPosition);
        if (!firstDigitValidation.IsValid)
            return (false, firstDigitValidation.ErrorMessage);

        
        var secondDigitValidation = ValidateCheckDigit(digits, SecondDigitPosition);
        if (!secondDigitValidation.IsValid)
            return (false, secondDigitValidation.ErrorMessage);

        return (true, string.Empty);
    }
    private static int[] ExtractDigits(string cpf)
    {
        return cpf.Select(c => int.Parse(c.ToString())).ToArray();
    }

    private static (bool IsValid, string ErrorMessage) ValidateCheckDigit(int[] digits, int position)
    {
        int sum = 0;
        int multiplier = position + 1;

        
        for (int i = 0; i < position; i++)
        {
            sum += digits[i] * multiplier;
            multiplier--;
        }

        
        int remainder = (sum * 10) % VerificationDivisor;
        int expectedDigit = remainder == 10 ? 0 : remainder;

        if (digits[position] != expectedDigit)
            return (false, $"CPF is invalid: check digit at position {position} does not match.");

        return (true, string.Empty);
    }

    public static string Format(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return string.Empty;

        var sanitized = new string(cpf.Where(char.IsDigit).ToArray());

        if (sanitized.Length != CpfLength)
            return string.Empty;

        return $"{sanitized[0..3]}.{sanitized[3..6]}.{sanitized[6..9]}-{sanitized[9..11]}";
    }
}
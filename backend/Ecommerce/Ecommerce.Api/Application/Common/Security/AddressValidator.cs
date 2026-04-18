using System.Text.RegularExpressions;
using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.Exceptions;

namespace Ecommerce.Api.Application.Common.Security;

public static class AddressValidator
{
    // Brazilian CEP format: 12345-678
    // Validates exactly 5 digits, a hyphen, and 3 digits (e.g., 01001-000)
    // Note: This is specific to Brazil postal codes (CEP)
    private static readonly Regex CepRegex = new(@"^\d{5}-\d{3}$");
    

    public static void Validate(CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Street))
            throw new BadRequestException("Street is required.");

        if (string.IsNullOrWhiteSpace(dto.City))
            throw new BadRequestException("City is required.");

        if (string.IsNullOrWhiteSpace(dto.ZipCode))
            throw new BadRequestException("ZipCode is required.");

        if (!CepRegex.IsMatch(dto.ZipCode))
            throw new BadRequestException("ZipCode must be in format 12345-678.");

        if (string.IsNullOrWhiteSpace(dto.State))
            throw new BadRequestException("State is required.");
    }
}
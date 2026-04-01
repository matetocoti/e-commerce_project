using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.Exceptions;

namespace Ecommerce.Api.Application.Common.Security;

public static class AddressValidator
{
    public static void Validate(CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Street))
            throw new BadRequestException("Street is required.");

        if (string.IsNullOrWhiteSpace(dto.City))
            throw new BadRequestException("City is required.");

        if (string.IsNullOrWhiteSpace(dto.ZipCode))
            throw new BadRequestException("ZipCode is required.");

        if (string.IsNullOrWhiteSpace(dto.State))
            throw new BadRequestException("State is required.");
    }
}
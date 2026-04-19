namespace Ecommerce.Api.Application.Common.Security;
using Ecommerce.Api.Application.Common.Interfaces;
using Ecommerce.Api.Application.Exceptions;
using System.Security.Claims;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid GetUserId()
    {
        var user = httpContextAccessor.HttpContext?.User;

        var userIdClaim = user?.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedException("Token inválido ou usuário não autenticado.");

        return userId;
    }
}
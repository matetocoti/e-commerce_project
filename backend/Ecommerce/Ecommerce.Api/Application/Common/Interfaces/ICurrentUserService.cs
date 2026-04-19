namespace Ecommerce.Api.Application.Common.Interfaces;
using System.Security.Claims;

public interface ICurrentUserService
{
    Guid GetUserId();
}
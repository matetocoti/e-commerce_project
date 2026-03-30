namespace Ecommerce.Api.Application.DTOS.Auth;
using Ecommerce.Api.Application.DTOS.User;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new UserDto();
}
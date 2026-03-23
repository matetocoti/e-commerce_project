namespace Ecommerce.Api.Application.DTOS.Auth;

public class LoginUserDto
{
    // For simplicity, we allow users to login with either their email or username
    // simply by using a single "Login" field. The AuthService will handle the logic to determine
    public string Login { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
namespace Ecommerce.Api.Application.Services;
using BCrypt.Net;
using Ecommerce.Api.Application.DTOS.Auth;
using Ecommerce.Api.Application.DTOS.User;
using Ecommerce.Api.Domain.Entities;


public class AuthService(UserService userService)
{
    private readonly UserService _userService = userService;

    public async Task<UserDto> RegisterAsync(RegisterUserDto request)
    {
        
        var existingUser = await _userService.GetByEmailOrUsernameAsync(request.Email);

        if (existingUser == null)
        {
            existingUser = await _userService.GetByEmailOrUsernameAsync(request.Username);
        }

        if (existingUser != null)
            throw new Exception("Email or username already in use.");

        
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.HashPassword(request.Password),
        };

        var createdUser = await _userService.CreateAsync(user);

        // 📤 retorno correto (DTO de saída)
        return new UserDto
        {
            Id = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email,
            Role = createdUser.Role
        };
    }
    public async Task<UserDto> LoginAsync(LoginUserDto request)
    {
        var user = await _userService.GetByEmailOrUsernameAsync(request.Login);
        if (user == null || !BCrypt.Verify(request.Password, user.PasswordHash)) 
            throw new Exception("Invalid login credentials.");
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        };
    }
}
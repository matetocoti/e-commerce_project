namespace Ecommerce.Api.Application.Services;
using BCrypt.Net;
using Ecommerce.Api.Application.DTOS.Auth;
using Ecommerce.Api.Application.DTOS.User;
using Ecommerce.Api.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;


public class AuthService(UserService userService, IConfiguration config)
{
    public async Task<UserDto> RegisterAsync(RegisterUserDto request)
    {

        var existingUser = await userService
            .GetByEmailOrUsernameAsync(request.Email)
            ?? await userService.GetByEmailOrUsernameAsync(request.Username);

        if (existingUser != null)
            throw new Exception("Email or username already in use.");
        if (request.Password != request.ConfirmPassword)
            throw new Exception("Passwords do not match.");

        var user = new User(
            request.Username,
            request.Email,
            BCrypt.HashPassword(request.Password)
        );

        var createdUser = await userService.CreateAsync(user);

        
        return new UserDto
        {
            Id = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email,
            Role = createdUser.Role,
            CreatedAt = createdUser.CreatedAt,
            UpdatedAt = createdUser.UpdatedAt
        };
    }
    public async Task<AuthResponseDto> LoginAsync(LoginUserDto request)
    {
        var user = await userService.GetByEmailOrUsernameAsync(request.Login);

        if (user == null || !BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Invalid login credentials.");

        var token = GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }
        };
    }

    private string GenerateToken(User user)
    {
        var keyString = config["Jwt:Key"]
            ?? throw new Exception("JWT Key not configured");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(keyString)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

        var expiresMinutes = int.Parse(config["Jwt:ExpiresMinutes"]!);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}
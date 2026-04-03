namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.User;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class UserService(AppDbContext context)
{
    private readonly AppDbContext _context = context;
    public async Task<UserDto> GetUserByIdAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null!;
        return MapToDto(user);
    }
    public async Task<User?> GetByEmailOrUsernameAsync(string login)
    {
        return await _context.Users
        .FirstOrDefaultAsync(u =>
            u.Email == login || u.Username == login);
    }

    public async Task<User> CreateAsync(User user)
    {

        if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Username))
            throw new ArgumentException("Invalid user data");

        var exists = await _context.Users
            .AnyAsync(u => u.Email == user.Email || u.Username == user.Username);

        if (exists)
            throw new Exception("User already exists");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    private UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
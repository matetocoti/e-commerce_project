namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.Common.Security;
using Ecommerce.Api.Application.DTOS.User;
using Ecommerce.Api.Application.Exceptions;
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
        var user = await _context.Users
        .FirstOrDefaultAsync(u =>
            u.Email == login || u.Username == login);
        return user;
    }
    public async Task<User> CreateAsync(User user)
    {

        if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Username))
            throw new ArgumentException("Invalid user data");

        var exists = await _context.Users
            .AnyAsync(u => u.Email == user.Email || u.Username == user.Username);

        if (exists)
            throw new BadRequestException("User already exists");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }
    public async Task UpdatePhoneNumberAsync(Guid userId, string? phoneNumber)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new NotFoundException("User not found");
        var (isValid, error) = PhoneValidator.Validate(phoneNumber);
        if (!isValid)
            throw new BadRequestException(error);
        user.UpdatePhoneNumber(phoneNumber);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
    public async Task UpdateUsernameAsync(Guid userId, string username)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Username == username && u.Id != userId);
        var user = await _context.Users.FindAsync(userId);
        if (userExists)
            throw new BadRequestException("Username already taken");
        if (user == null)
            throw new NotFoundException("User not found");
        user.UpdateUsername(username);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
    private UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            PhoneNumber = user.PhoneNumber,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
namespace Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Enums;



public class User
{
    #region Properties
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; private set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion

    #region Relationships
    public List<Order> Orders { get; set; } = new();
    public Cart? Cart { get; set; } = null;
    #endregion

    #region Constructors
    public User() { } 

    public User(string username, string email, string passwordHash, UserRole role = UserRole.Customer, string? phoneNumber = null)
    {
        Id = Guid.NewGuid();
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        PhoneNumber = string.IsNullOrWhiteSpace(phoneNumber) ? null : phoneNumber;
    }
    #endregion

    #region Methods

    public void UpdatePhoneNumber(string? phoneNumber)
    {
        PhoneNumber = string.IsNullOrWhiteSpace(phoneNumber) ? null : phoneNumber;
        UpdatedAt = DateTime.UtcNow;
    }

    public override bool Equals(object? obj)
    {
        return obj is User user && Id == user.Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
    #endregion

}
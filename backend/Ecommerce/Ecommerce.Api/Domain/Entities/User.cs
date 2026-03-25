namespace Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Enums;



public class User
{
    #region Properties
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
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

    public User(string username, string email, string passwordHash, UserRole role = UserRole.Customer)
    {
        Id = Guid.NewGuid();
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    #endregion

    #region Methods
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
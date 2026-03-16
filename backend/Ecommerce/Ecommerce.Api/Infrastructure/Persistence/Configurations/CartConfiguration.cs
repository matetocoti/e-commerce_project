namespace Ecommerce.Api.Infrastructure.Persistence.Configurations;

using Ecommerce.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.ToTable("Carts");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.UserId)
            .IsRequired();
        builder.Property(c => c.CreatedAt)
            .IsRequired();
    }
}   
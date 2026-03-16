namespace Ecommerce.Api.Infrastructure.Persistence.Configurations;

using Ecommerce.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.UserId)
            .IsRequired();
        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);
        builder.Property(o => o.CreatedAt)
            .IsRequired();
    }
}
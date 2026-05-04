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

        builder.Property(o => o.Status)
            .IsRequired();

        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        builder.Property(o => o.CreatedAt)
            .IsRequired();

        builder.Property(o => o.UpdatedAt)
            .IsRequired();

        builder.Property(o => o.ExpiresAt)
            .IsRequired();

        

        // Address (VO)
        builder.OwnsOne(o => o.Address, address =>
        {
            address.Property(a => a.Street).HasMaxLength(200);
            address.Property(a => a.City).HasMaxLength(100);
            address.Property(a => a.ZipCode).HasMaxLength(20);
            address.Property(a => a.State).HasMaxLength(50);
            address.Property(a => a.Notes).HasMaxLength(500);
        });

        // DigitalContact (VO)
        builder.OwnsOne(o => o.DigitalContact, dc =>
        {
            dc.Property(d => d.Email).HasMaxLength(200);
            dc.Property(d => d.PhoneNumber).HasMaxLength(20);
        });

        // Relationships
        builder.HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId);

        builder.HasMany(o => o.Payments)
            .WithOne(p => p.Order)
            .HasForeignKey(p => p.OrderId);
    }
}
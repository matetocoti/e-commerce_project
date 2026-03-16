namespace Ecommerce.Api.Infrastructure.Persistence.Configurations;

using Ecommerce.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

// Obs: isso poderia tambem ter sido feito usando Data Annotations, mas a abordagem Fluent API é mais flexível e permite uma configuração mais detalhada das entidades.

// A classe ProductConfiguration é responsável por configurar as entidades para o Entity Framework Core.
public class  ProductConfiguration : IEntityTypeConfiguration<Product>
{
    // O método Configure é chamado pelo Entity Framework Core para configurar a entidade Product.
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        // Configura a chave primária da entidade Product.
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);
        // Configura as propriedades da entidade Product.
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(p => p.Description)
            .HasMaxLength(1000);
        builder.Property(p => p.Price)
            .HasPrecision(18, 2);
        builder.Property(p => p.Stock)
            .IsRequired();
        builder.Property(p => p.IsActive)
            .IsRequired();

    }
}

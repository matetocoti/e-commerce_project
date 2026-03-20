namespace Ecommerce.Api.Application.Services;
using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.DTOS.OrderItem;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;



public class OrderService
{
    private readonly AppDbContext _context;

    // Injeção de dependência do DbContext
    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    // Método para checkout do carrinho e criação do pedido
    // Este método realiza as seguintes etapas:
    // 1. Busca o carrinho do usuário, incluindo os itens e os produtos relacionados
    // 2. Valida se o carrinho existe e contém itens
    // 3. Cria os OrderItems a partir dos CartItems
    // 4. Cria a entidade Order com os OrderItems
    // 5. Persiste o Order no banco de dados
    // 6. Remove o carrinho do usuário
    // 7. Retorna um OrderDto com os detalhes do pedido criado
    public async Task<OrderDto> CheckoutAsync(Guid userId)
    {
        // 1. Buscar cart com itens e produtos
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        // 2. Validação
        if (cart == null || !cart.CartItems.Any())
            throw new Exception("Cart is empty");

        // 3. Criar OrderItems
        var orderItems = cart.CartItems.Select(ci => new OrderItem
        {
            Id = Guid.NewGuid(),
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            UnitPrice = ci.Product.Price,
            Quantity = ci.Quantity,
        }).ToList();

        // 4. Criar Order
        var order = new Order(cart.User, orderItems);

        // 5. Persistir
        _context.Orders.Add(order);

        // 6. Remover cart
        _context.Carts.Remove(cart);

        await _context.SaveChangesAsync();

        // 7. Retornar DTO
        return MapToDto(order);
    }
    public async Task<List<OrderDto>> GetOrdersByUserIdAsync(Guid userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ToListAsync();
        return orders.Select(MapToDto).ToList();
    }
    public async Task<OrderDto> GetOrderByIdAsync(Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null)
            throw new Exception("Order not found");
        return MapToDto(order);
    }

    // Método que converte a entidade Order para OrderDto, incluindo os itens do pedido
    // Auxiliar para mapear entidade Order para OrderDto
    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            Status = order.Status.ToString(),
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            ExpiresAt = order.ExpiresAt,
            Items = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductName = item.ProductName,
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity,
                Subtotal = item.Subtotal
            }).ToList()
        };
    }
}
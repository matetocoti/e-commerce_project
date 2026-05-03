namespace Ecommerce.Api.Application.Services;

using Ecommerce.Api.Application.Common.Security;
using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.DTOS.OrderItem;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Entities.ValueObject;
using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


public class OrderService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    // Método para checkout do carrinho e criação do pedido
    // Este método realiza as seguintes etapas:
    // 1. Busca o carrinho do usuário, incluindo os itens e os produtos relacionados
    // 2. Valida se o carrinho existe e contém itens
    // 3. Cria os OrderItems a partir dos CartItems
    // 4. Cria a entidade Order com os OrderItems
    // 5. Persiste o Order no banco de dados
    // 6. Remove o carrinho do usuário
    // 7. Retorna um OrderDto com os detalhes do pedido criado
    public async Task<OrderDto> CheckoutAsync(Guid userId, CreateOrderDto createOrderDto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.CartItems.Any())
            throw new BadRequestException("Cart is empty.");

        foreach (var cartItem in cart.CartItems) { 
            if (!cartItem.Product.IsActive) 
                throw new BadRequestException($"Product '{cartItem.Product.Name}' is not available.");
            cartItem.Product.ReduceStock(cartItem.Quantity);
        }


        var orderItems = cart.CartItems.Select(ci => new OrderItem
        {
            Id = Guid.NewGuid(),
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            ProductType = ci.Product.Type,
            UnitPrice = ci.Product.Price,
            Quantity = ci.Quantity,
        }).ToList();

        var productType = orderItems.First().ProductType;

        Address? address = null;
        DigitalContactInfo? digitalContact = null;

        if (productType == ProductType.Physical)
        {
            AddressValidator.Validate(createOrderDto);

            address = new Address
            {
                Street = createOrderDto.Street,
                City = createOrderDto.City,
                ZipCode = createOrderDto.ZipCode,
                State = createOrderDto.State,
                Notes = createOrderDto.Notes
            };
        }
        else
        {
            
            if (string.IsNullOrWhiteSpace(createOrderDto.Email))
                throw new BadRequestException("Email is required for digital products");

            digitalContact = new DigitalContactInfo
            {
                Email = createOrderDto.Email,
                PhoneNumber = createOrderDto.PhoneNumber
            };
        }

        var order = new Order(userId, orderItems, address, digitalContact);



        _context.Orders.Add(order);

        cart.CartItems.Clear();
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return MapToDto(order);
    }
    public async Task CancelOrderAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.Status != OrderStatus.AwaitingPayment)
            throw new BadRequestException("Only orders awaiting payment can be cancelled.");

        foreach (var item in order.OrderItems)
        {
            item.Product.IncreaseStock(item.Quantity);
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
    public async Task<List<OrderDto>> GetOrdersByUserIdAsync(Guid userId, int page = 1,int pageSize = 5){
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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
    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            Status = order.Status.ToString(),
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            ExpiresAt = order.ExpiresAt,
            Address = order.Address,
            DigitalContact = order.DigitalContact,
            Items = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductName = item.ProductName,
                ProductType = item.ProductType.ToString(),
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity,
                Subtotal = item.Subtotal
            }).ToList()
        };
    }
}
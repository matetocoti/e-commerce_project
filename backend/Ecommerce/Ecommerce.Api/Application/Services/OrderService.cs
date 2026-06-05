namespace Ecommerce.Api.Application.Services;

using Ecommerce.Api.Application.Common.Security;
using Ecommerce.Api.Application.DTOS.Order;
using Ecommerce.Api.Application.DTOS.OrderItem;
using Ecommerce.Api.Application.DTOS.Payment;
using Ecommerce.Api.Application.Exceptions;
using Ecommerce.Api.Domain.Entities;
using Ecommerce.Api.Domain.Entities.ValueObject;
using Ecommerce.Api.Domain.Enums;
using Ecommerce.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


public class OrderService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

 
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

            // Using ! because validation ensures these fields are not null or empty.
            address = new Address
            {
                Street = createOrderDto.Street!,
                City = createOrderDto.City!,
                ZipCode = createOrderDto.ZipCode!,
                State = createOrderDto.State!,
                Notes = createOrderDto.Notes!
            };
        }
        else
        {
            
            var (isEmailValid, emailValidationMessage) = EmailValidator.Validate(createOrderDto.Email);
            var (isPhoneNumberValid, phoneNumberValidationMessage) = PhoneValidator.Validate(createOrderDto.PhoneNumber);

            if (!isEmailValid)
                throw new BadRequestException(emailValidationMessage);
            if (!isPhoneNumberValid)
                throw new BadRequestException(phoneNumberValidationMessage);

            digitalContact = new DigitalContactInfo
            {
                Email = createOrderDto.Email!,
                PhoneNumber = createOrderDto.PhoneNumber!
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

        StockReplenishmentTask(order);

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task<List<OrderDto>> GetOrdersByUserIdAsync(Guid userId, int page = 1,int pageSize = 5)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
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
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null)
            throw new NotFoundException("Order not found.");
        return MapToDto(order);
    }

    public async Task<OrderStatusDto> GetOrderStatusByIdAsync(Guid orderId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null)
            throw new NotFoundException("Order not found.");
        return new OrderStatusDto
        {
            Id = order.Id,
            Status = order.Status.ToString(),
        };
    }

    // TODO: Create separate DTOs for order list and order details views.
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
            }).ToList(),
            Payments = order.Payments.Select(payment => new PaymentDto
            {
                Id = payment.Id,
                Amount = payment.Amount,
                Method = payment.Method,
                Status = payment.Status,
                PaidAt = payment.ConfirmedAt 
            }).ToList(),
        };
    }
    private static void StockReplenishmentTask(Order order)
    {
        foreach (var item in order.OrderItems)
        {
            item.Product.IncreaseStock(item.Quantity);
        }
    }
}
using OrderApi.Models.Orders;
using OrderApi.Domains;
using OrderApi.Data;
using Microsoft.EntityFrameworkCore;

namespace OrderApi.Services.Orders
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<OrderResultDto> CreateOrder(OrderCreateDto dto)
        {

            string content = dto.Content;
            int attempts = await Cooking();

            var order = new Order(content, attempts);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var result = new OrderResultDto {
                Message = $"Your order has been received.\n" +
                $"Order details:\n" +
                $"-ID: {order.Id}\n" +
                $"-Order date: {order.Date}\n" +
                $"-Content: {dto.Content}\n"
            };

            return result;
        }

        public async Task<OrderGetDto?> GetOrder(Guid id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null) return null;

            return new OrderGetDto
            {
                Id = id,
                Date = order.Date,
                Content = order.Content,
                Attempts = order.Attempts
            };
        }

        public async Task<List<OrderGetDto>> GetOrders()
        {
            var orders = await _context.Orders
                .OrderByDescending(o => o.Date)
                .ToListAsync();

            return orders.Select(o => new OrderGetDto {
                Id = o.Id,
                Date = o.Date,
                Content = o.Content,
                Attempts = o.Attempts
            }).ToList();
        }

        private async Task<int> Cooking()
        {
            await Task.Delay(3000);

            var rand = new Random();
            int result = rand.Next(100);
            int attempts = 1;

            while (result < 50)
            {
                result = rand.Next(100);
                attempts++;
            }

            return attempts;
        }
    }
}
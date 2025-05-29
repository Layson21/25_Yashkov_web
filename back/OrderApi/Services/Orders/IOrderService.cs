using OrderApi.Models.Orders;

namespace OrderApi.Services.Orders
{
    public interface IOrderService
    {
        Task<OrderResultDto> CreateOrder(OrderCreateDto dto);
        Task<List<OrderGetDto>> GetOrders();
        Task<OrderGetDto?> GetOrder(Guid id);
    }
}
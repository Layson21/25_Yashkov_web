using Microsoft.AspNetCore.Mvc;
using OrderApi.Models.Orders;
using OrderApi.Services.Orders;

namespace OrderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService) 
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto order)
        {
            var result = await _orderService.CreateOrder(order);
            return Ok(result.Message);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            var order = await _orderService.GetOrder(id);
            if (order == null)
                return NotFound($"Order with ID = {id} not found.");

            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var result = await _orderService.GetOrders();
            return Ok(result);
        }
    }
}

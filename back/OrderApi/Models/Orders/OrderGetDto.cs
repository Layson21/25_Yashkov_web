namespace OrderApi.Models.Orders
{
    public class OrderGetDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string Content { get; set; }
        public int Attempts { get; set; }
    }
}
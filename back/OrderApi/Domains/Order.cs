namespace OrderApi.Domains
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Date { get; set; } = DateTime.Now;
        public string Content { get; set; }
        public int Attempts { get; set; }

        public Order(string content, int result)
        {
            Content = content;
            Attempts = result;
        }

        public Order() { }
    }
}
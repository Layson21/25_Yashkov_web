using Microsoft.EntityFrameworkCore;
using OrderApi.Domains;

namespace OrderApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) {}

        public DbSet<Order> Orders { get; set; }
    }
}
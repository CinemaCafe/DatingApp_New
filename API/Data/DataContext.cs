using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // DBSet represent tables inside our datatabse
        public DbSet<AppUser> Users { get; set; }
    }
}
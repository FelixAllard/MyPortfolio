using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace PortfolioAPI.Data;



public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Comment> Comments { get; set; }
    public DbSet<Project> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Ensures Identity is set up

        modelBuilder.Entity<Comment>()
            .HasOne<ApplicationUser>()  
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId);
    }
}


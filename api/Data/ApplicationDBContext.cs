using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) 
            : base(dbContextOptions)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<DishIngredient> DishIngredients { get; set; }
        public DbSet<DishImage> DishImages { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<Dish>().ToTable("Dishes");
            modelBuilder.Entity<DishIngredient>().ToTable("DishIngredients");
            modelBuilder.Entity<DishImage>().ToTable("DishImages");
            modelBuilder.Entity<ProductImage>().ToTable("ProductImages");

            modelBuilder.Entity<DishIngredient>()
                .HasOne(di => di.Dish)
                .WithMany(d => d.Ingredients)
                .HasForeignKey(di => di.DishId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DishImage>()
                .HasOne(di => di.Dish)
                .WithMany(d => d.Images)
                .HasForeignKey(di => di.DishId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion; // Для ValueConverter
using System.Text.Json;
using api.Enums;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
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

            // Имена таблиц
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<Dish>().ToTable("Dishes");
            modelBuilder.Entity<DishIngredient>().ToTable("DishIngredients");
            modelBuilder.Entity<DishImage>().ToTable("DishImages");
            modelBuilder.Entity<ProductImage>().ToTable("ProductImages");

            // Связь: Ингредиенты блюда -> Блюдо
            modelBuilder.Entity<DishIngredient>()
                .HasOne(di => di.Dish)
                .WithMany(d => d.Ingredients)
                .HasForeignKey(di => di.DishId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь: Картинки блюда -> Блюдо
            modelBuilder.Entity<DishImage>()
                .HasOne(di => di.Dish)
                .WithMany(d => d.Images)
                .HasForeignKey(di => di.DishId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь: Картинки продукта -> Продукт
            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // 1. Конвертер типов флагов для Блюда (Dish) — использует DishFlags
            var dishFlagsConverter = new ValueConverter<List<DishEnums.DishFlags>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null), 
                v => JsonSerializer.Deserialize<List<DishEnums.DishFlags>>(v, (JsonSerializerOptions)null) ?? new List<DishEnums.DishFlags>()
            );

            modelBuilder.Entity<Dish>()
                .Property(d => d.Flags)
                .HasConversion(dishFlagsConverter);

            // 2. Конвертер типов флагов для Продукта (Product) — использует ИМЕННО ProductFlags
            var productFlagsConverter = new ValueConverter<List<ProductEnums.ProductFlags>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null), 
                v => JsonSerializer.Deserialize<List<ProductEnums.ProductFlags>>(v, (JsonSerializerOptions)null) ?? new List<ProductEnums.ProductFlags>()
            );

            modelBuilder.Entity<Product>()
                .Property(p => p.Flags)
                .HasConversion(productFlagsConverter);
        }
    }
}

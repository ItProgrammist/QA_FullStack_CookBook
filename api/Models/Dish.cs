using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static api.Enums.DishEnums;

namespace api.Models
{
    public class Dish
    {
        [Required(ErrorMessage = "The name of the product shouldn't be empty")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Minimal length: 2 characters")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(5)]
        public List<string>? ImageUrls { get; set; } = new();

        [Required]
        [Range(0, double.MaxValue)]
        public double Calories { get; set; }

        [Required]
        [Range(0, 100)]
        public double Proteins { get; set; }

        [Required]
        [Range(0, 100)]
        public double Fats { get; set; }

        [Required]
        [Range(0, 100)]
        public double Carbohydrates { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "There's should be at least 1 product in the dish")]
        public List<DishIngredient> Ingredients { get; set; } = new();

        [Required]
        [Range(0.01, double.MaxValue)]
        public double PortionSize { get; set; }

        [Required]
        public DishCategory Category { get; set; }

        public DishFlags Flags { get; set; } = DishFlags.None;

        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; private set; }
    }

    public class DishIngredient
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // Собственный ID записи

        [ForeignKey("Dish")]
        public Guid DishId { get; set; }
        public Dish Dish { get; set; } = null!;

        [ForeignKey("Product")]
        public Guid ProductId { get; set; }

        public Product Product { get; set; } = null!;

        [Required]
        [Range(0.01, double.MaxValue)]
        public double Amount { get; set; }
    }

}
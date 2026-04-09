using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static api.Enums.ProductEnums;

namespace api.Models
{
    public class Product
    {
        [Required(ErrorMessage = "The name of the product shouldn't be empty")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Minimal length: 2 characters")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(5)]
        public List<string>? ImageUrls { get; set; } = new();

        [Required(ErrorMessage = "The calories shouldn't be empty")]
        [Range(0, double.MaxValue)]
        public double Calories { get; set; }

        [Required(ErrorMessage = "The proteins shouldn't be empty")]
        [Range(0, 100)]
        public double Proteins { get; set; }

        [Required(ErrorMessage = "The fats shouldn't be empty")]
        [Range(0, 100)]
        public double Fats { get; set; }

        [Required(ErrorMessage = "The carbs shouldn't be empty")]
        [Range(0, 100)]
        public double Carbohydrates { get; set; }

        public string? Ingredients { get; set; } = null;

        [Required(ErrorMessage = "The category shouldn't be empty")]
        public ProductCategory Category { get; set; }

        [Required(ErrorMessage = "This shouldn't be empty")]
        public CookingNecessity CookingNecessity { get; set; }

        [Required]
        public ProductFlags Flags { get; set; } = ProductFlags.None;

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? UpdatedAt { get; private set; }
    }
}
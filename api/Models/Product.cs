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
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "The name of the product shouldn't be empty")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Minimal length: 2 characters")]
        public string Name { get; set; } = string.Empty;

        // [MaxLength(5)]
        // public List<ProductImage> Images { get; set; } = new();
        public List<ProductImage> Images { get; set; } = new();

        [Required(ErrorMessage = "The calories shouldn't be empty")]
        [Range(0, double.MaxValue)]
        public double Calories { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Значение не может быть отрицательным")]
        public double Proteins { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Значение не может быть отрицательным")]
        public double Fats { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Значение не может быть отрицательным")]
        public double Carbohydrates { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string? Ingredients { get; set; } = null;

        [Required(ErrorMessage = "The category shouldn't be empty")]
        public ProductCategory Category { get; set; }

        [Required(ErrorMessage = "This shouldn't be empty")]
        public CookingNecessity CookingNecessity { get; set; }

        [Required]
        // public ProductFlags Flags { get; set; } = ProductFlags.None;
        public List<ProductFlags> Flags { get; set; } = new List<ProductFlags>();

        // [Required]
        // [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        // public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        // [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        // public DateTime? UpdatedAt { get; private set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    // public class ProductImage
    // {
    //     [Key]
    //     public Guid Id { get; set; } = Guid.NewGuid();

    //     [Required]
    //     public string Url { get; set; } = string.Empty;

    //     [Required]
    //     public Guid ProductId { get; set; }

    //     public Product Product { get; set; } = null!;
    // }

    [Table("ProductImages")]
    public class ProductImage
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public byte[] Data { get; set; } = Array.Empty<byte>();

        [Required]
        public string ContentType { get; set; } = "image/jpeg";

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
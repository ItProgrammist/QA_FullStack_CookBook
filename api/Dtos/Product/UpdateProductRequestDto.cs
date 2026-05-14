using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static api.Enums.ProductEnums;

namespace api.Dtos.Product
{
    public class UpdateProductRequestDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        // public List<UpdateProductImageDto> Images { get; set; } = new();

        public List<UpdateProductFileImageDto> Images { get; set; } = new();


        [Range(0, double.MaxValue)]
        public double Calories { get; set; }

        [Range(0, 100)]
        public double Proteins { get; set; }

        [Range(0, 100)]
        public double Fats { get; set; }

        [Range(0, 100)]
        public double Carbohydrates { get; set; }

        public string? Ingredients { get; set; }

        [Required]
        public ProductCategory Category { get; set; }

        [Required]
        public CookingNecessity CookingNecessity { get; set; }

        // public ProductFlags Flags { get; set; } = ProductFlags.None;
        public List<ProductFlags> Flags { get; set; } = new List<ProductFlags>();


    }

    public class UpdateProductFileImageDto
    {
        [Required]
        public string Base64Data { get; set; } = string.Empty;
        public string ContentType { get; set; } = "image/jpeg";
    }

    public class UpdateProductImageDto
    {
        [Required]
        public string Url { get; set; } = string.Empty;
    }
}

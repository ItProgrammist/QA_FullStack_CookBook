using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static api.Enums.ProductEnums;

namespace api.Dtos.Product
{
    public class CreateProductRequestDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        // public List<CreateProductImageDto> Images { get; set; } = new();
        public List<CreateProductFileImageDto> Images { get; set; } = new();


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

        public string? Ingredients { get; set; }

        [Required]
        public ProductCategory Category { get; set; }

        [Required]
        public CookingNecessity CookingNecessity { get; set; }

        // public ProductFlags Flags { get; set; } = ProductFlags.None;
        public List<ProductFlags> Flags { get; set; } = new List<ProductFlags>();


    }

    public class CreateProductFileImageDto
    {
        [Required]
        public string Base64Data { get; set; } = string.Empty;
        public string ContentType { get; set; } = "image/jpeg";
    }

    public class CreateProductImageDto
    {
        [Required]
        public string Url { get; set; } = string.Empty;

    }
}

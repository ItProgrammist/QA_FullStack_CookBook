using System;
using System.Collections.Generic;
using static api.Enums.ProductEnums;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Product
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Calories { get; set; }
        public double Proteins { get; set; }
        public double Fats { get; set; }
        public double Carbohydrates { get; set; }
        public string? Ingredients { get; set; }
        public ProductCategory Category { get; set; }
        public CookingNecessity CookingNecessity { get; set; }
        // public ProductFlags Flags { get; set; } = ProductFlags.None;
        public List<ProductFlags> Flags { get; set; } = new List<ProductFlags>();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // public List<ProductImageDto> Images { get; set; } = new();

        public List<FileProductImageDto> Images { get; set; } = new();

        public class ProductImageDto
        {
            public Guid Id { get; set; }
            public string Url { get; set; } = string.Empty;
        }

        

    }

    public class FileProductImageDto
        {
            [Required]
            public Guid Id { get; set; }
            public string Base64Data { get; set; } = string.Empty;
            public string ContentType { get; set; } = "image/jpeg";
        }


}

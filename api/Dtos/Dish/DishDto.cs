using System;
using System.Collections.Generic;
using static api.Enums.DishEnums;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Dish
{
    public class DishDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Calories { get; set; }
        public double Proteins { get; set; }
        public double Fats { get; set; }
        public double Carbohydrates { get; set; }
        public double PortionSize { get; set; }
        public DishCategory Category { get; set; }
        public DishFlags Flags { get; set; } = DishFlags.None;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // public List<DishImageDto> Images { get; set; } = new();
        public List<FileDishImageDto> Images { get; set; } = new();

        public List<DishIngredientDto> Ingredients { get; set; } = new();

        // public class DishImageDto
        // {
        //     public Guid Id { get; set; }
        //     public string Url { get; set; } = string.Empty;
        // }





    }

    public class FileDishImageDto
    {
        [Required]
        public Guid Id { get; set; }
        public string Base64Data { get; set; } = string.Empty;
        public string ContentType { get; set; } = "image/jpeg";
    }

    public class DishIngredientDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public double Amount { get; set; }
    }


}

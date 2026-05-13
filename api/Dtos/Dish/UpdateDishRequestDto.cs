using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static api.Enums.DishEnums;

namespace api.Dtos.Dish
{
    public class UpdateDishRequestDto : IValidatableObject
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        public List<UpdateDishFileImageDto> Images { get; set; } = new();

        [Range(0, double.MaxValue)]
        public double Calories { get; set; }

        [Range(0, 100)]
        public double Proteins { get; set; }

        [Range(0, 100)]
        public double Fats { get; set; }

        [Range(0, 100)]
        public double Carbohydrates { get; set; }

        [MinLength(1, ErrorMessage = "Dish must have at least one ingredient")]
        public List<UpdateDishIngredientDto> Ingredients { get; set; } = new();

        [Range(0.01, double.MaxValue)]
        public double PortionSize { get; set; }

        [Required]
        public DishCategory Category { get; set; }

        public DishFlags Flags { get; set; } = DishFlags.None;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            double totalMacros = Proteins + Fats + Carbohydrates;
            if (totalMacros > 100)
            {
                yield return new ValidationResult(
                    $"Сумма БЖУ ({totalMacros}г) не может превышать 100 грамм.",
                    new[] { nameof(Proteins), nameof(Fats), nameof(Carbohydrates) }
                );
            }
        }
    }

    public class UpdateDishFileImageDto
    {
        [Required]
        public string Base64Data { get; set; } = string.Empty;
        public string ContentType { get; set; } = "image/jpeg";
    }

    public class UpdateDishImageDto
    {
        [Required]
        public string Url { get; set; } = string.Empty;
    }

    public class UpdateDishIngredientDto
    {
        [Required]
        public Guid ProductId { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public double Amount { get; set; }
    }
}

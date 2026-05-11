using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using api.Dtos.Dish;

namespace api.Mappers
{
    public static class DishMappers
    {
        public static DishDto ToDishDto(this Dish dishModel)
        {
            return new DishDto
            {
                Id = dishModel.Id,
                Name = dishModel.Name,
                Calories = dishModel.Calories,
                Proteins = dishModel.Proteins,
                Fats = dishModel.Fats,
                Carbohydrates = dishModel.Carbohydrates,
                PortionSize = dishModel.PortionSize,
                Category = dishModel.Category,
                Flags = dishModel.Flags,
                CreatedAt = dishModel.CreatedAt,
                UpdatedAt = dishModel.UpdatedAt,

                // Mapping Ingredients
                Ingredients = dishModel.Ingredients?
                    .Select(i => new DishIngredientDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.Product?.Name ?? "Unknown",
                        Amount = i.Amount
                    }).ToList() ?? new List<DishIngredientDto>(),

                // Mapping Images: byte[] -> Base64 String
                Images = dishModel.Images?
                    .Select(img => new FileDishImageDto
                    {
                        Id = img.Id, // Safe to include Id here
                        Base64Data = Convert.ToBase64String(img.Data),
                        ContentType = img.ContentType
                    }).ToList() ?? new List<FileDishImageDto>()
            };
        }

        public static Dish ToDishFromCreateDTO(this CreateDishRequestDto dishDto)
        {
            return new Dish
            {
                Name = dishDto.Name,
                Calories = dishDto.Calories,
                Proteins = dishDto.Proteins,
                Fats = dishDto.Fats,
                Carbohydrates = dishDto.Carbohydrates,
                PortionSize = dishDto.PortionSize,
                Category = dishDto.Category,
                Flags = dishDto.Flags,
                CreatedAt = DateTime.UtcNow,

                // Mapping Ingredients for DB
                Ingredients = dishDto.Ingredients?
                    .Select(i => new DishIngredient
                    {
                        ProductId = i.ProductId,
                        Amount = i.Amount
                    }).ToList() ?? new List<DishIngredient>(),

                // Mapping Images: Base64 String -> byte[]
                Images = dishDto.Images?
                    .Select(imgDto => new DishImage
                    {
                        Data = Convert.FromBase64String(imgDto.Base64Data),
                        ContentType = imgDto.ContentType
                    }).ToList() ?? new List<DishImage>()
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using api.Dtos.Product;
using api.Models;
using api.Dtos.Product;
   
namespace api.Mappers
{
    public static class ProductMappers
    {
        public static ProductDto ToProductDto(this Product productModel)
        {
            return new ProductDto
            {
                Id = productModel.Id,
                Name = productModel.Name,
                Calories = productModel.Calories,
                Proteins = productModel.Proteins,
                Fats = productModel.Fats,
                Carbohydrates = productModel.Carbohydrates,
                Ingredients = productModel.Ingredients,
                Category = productModel.Category,
                CookingNecessity = productModel.CookingNecessity,
                Flags = productModel.Flags,
                CreatedAt = productModel.CreatedAt,
                UpdatedAt = productModel.UpdatedAt,
                
                Images = productModel.Images?
                    .Select(img => img.ToProductImageDto())
                    .ToList() ?? new List<FileProductImageDto>()
            };
        }

        public static FileProductImageDto ToProductImageDto(this api.Models.ProductImage imageModel)
        {
            return new FileProductImageDto
            {
                Id = imageModel.Id,
                // Binary Data -> Base64 String
                Base64Data = Convert.ToBase64String(imageModel.Data),
                ContentType = imageModel.ContentType
            };
        }

        public static Product ToProductFromCreateDTO(this CreateProductRequestDto productDto)
        {
            return new Product
            {
                Name = productDto.Name,
                Calories = productDto.Calories,
                Proteins = productDto.Proteins,
                Fats = productDto.Fats,
                Carbohydrates = productDto.Carbohydrates,
                Ingredients = productDto.Ingredients,
                Category = productDto.Category,
                CookingNecessity = productDto.CookingNecessity,
                Flags = productDto.Flags,
                CreatedAt = DateTime.UtcNow,
                
                // Base64 String from Client -> byte[] for DB
                Images = productDto.Images?
                    .Select(imgDto => new api.Models.ProductImage 
                    { 
                        Data = Convert.FromBase64String(imgDto.Base64Data),
                        ContentType = imgDto.ContentType
                    })
                    .ToList() ?? new List<api.Models.ProductImage>()
            };
        }

        public static Product ToProductFromUpdateDTO(this UpdateProductRequestDto productDto)
        {
            return new Product
            {
                Name = productDto.Name,
                Calories = productDto.Calories,
                Proteins = productDto.Proteins,
                Fats = productDto.Fats,
                Carbohydrates = productDto.Carbohydrates,
                Ingredients = productDto.Ingredients,
                Category = productDto.Category,
                CookingNecessity = productDto.CookingNecessity,
                Flags = productDto.Flags,
                UpdatedAt = DateTime.UtcNow,
                
                Images = productDto.Images?
                    .Select(imgDto => new api.Models.ProductImage 
                    { 
                        Data = Convert.FromBase64String(imgDto.Base64Data),
                        ContentType = imgDto.ContentType
                    })
                    .ToList() ?? new List<api.Models.ProductImage>()
            };
        }
    }
}

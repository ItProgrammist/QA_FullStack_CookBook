using System;
using System.Collections.Generic;
using System.Linq;
using api.Data;
using api.Dtos.Product;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public ProductController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(
            [FromQuery] string? search,
            [FromQuery] int? category,
            [FromQuery] int? cookingNecessity,
            [FromQuery] int? flags,
            [FromQuery] string? sortBy)
        {
            var query = _context.Products.Include(p => p.Images).AsQueryable();

            if (category.HasValue)
            {
                query = query.Where(p => (int)p.Category == category.Value);
            }

            if (cookingNecessity.HasValue)
            {
                query = query.Where(p => (int)p.CookingNecessity == cookingNecessity.Value);
            }

            if (flags.HasValue && flags.Value > 0)
            {
                var targetFlag = (api.Enums.ProductEnums.ProductFlags)flags.Value;
                query = query.Where(d => d.Flags.Contains(targetFlag));
                // query = query.Where(p => (int)p.Flags == flags.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                query = sortBy.ToLower() switch
                {
                    "calories" => query.OrderBy(p => p.Calories),
                    "proteins" => query.OrderBy(p => p.Proteins),
                    "fats" => query.OrderBy(p => p.Fats),
                    "carbohydrates" => query.OrderBy(p => p.Carbohydrates),
                    "name" => query.OrderBy(p => p.Name),
                    _ => query.OrderBy(p => p.Name)
                };
            }
            else
            {
                query = query.OrderBy(p => p.Name);
            }

            var products = query.ToList().Select(s => s.ToProductDto());

            return Ok(products);
        }


        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] Guid id)
        {
            var product = _context.Products
                .Include(p => p.Images)
                .FirstOrDefault(x => x.Id == id);

            if (product == null) return NotFound();

            return Ok(product.ToProductDto());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateProductRequestDto productDto)
        {
            var productModel = productDto.ToProductFromCreateDTO();
            _context.Products.Add(productModel);
            _context.SaveChanges();

            _context.Entry(productModel).Collection(p => p.Images).Load();

            return CreatedAtAction(nameof(GetById), new { id = productModel.Id }, productModel.ToProductDto());
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] Guid id, [FromBody] UpdateProductRequestDto productDto)
        {
            var productExists = _context.Products.Any(x => x.Id == id);
            if (!productExists) return NotFound();

            var oldImages = _context.ProductImages.Where(img => img.ProductId == id);
            _context.ProductImages.RemoveRange(oldImages);

            var productModel = _context.Products.FirstOrDefault(x => x.Id == id);

            productModel.Name = productDto.Name;
            productModel.Calories = productDto.Calories;
            productModel.Proteins = productDto.Proteins;
            productModel.Fats = productDto.Fats;
            productModel.Carbohydrates = productDto.Carbohydrates;
            productModel.Ingredients = productDto.Ingredients;
            productModel.Category = productDto.Category;
            productModel.CookingNecessity = productDto.CookingNecessity;
            productModel.Flags = productDto.Flags;
            productModel.UpdatedAt = DateTime.UtcNow;

            if (productDto.Images != null)
            {
                foreach (var imgDto in productDto.Images)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = id,
                        Data = Convert.FromBase64String(imgDto.Base64Data),
                        ContentType = imgDto.ContentType
                    });
                }
            }

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Ошибка параллельного доступа к базе данных. Попробуйте еще раз.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка при обновлении базы данных: " + ex.Message);
            }

            _context.Entry(productModel).Collection(p => p.Images).Load();

            return Ok(productModel.ToProductDto());
        }


        [HttpDelete("{id:guid}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            var productModel = _context.Products.Find(id);
            if (productModel == null) return NotFound();

            _context.Products.Remove(productModel);
            _context.SaveChanges();
            return NoContent();
        }
    }
}

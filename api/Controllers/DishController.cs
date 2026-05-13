using System;
using System.Collections.Generic;
using System.Linq;
using api.Data;
using api.Dtos.Dish;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/dish")]
    [ApiController]
    public class DishController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public DishController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(
            [FromQuery] string? search,
            [FromQuery] int? category,
            [FromQuery] int? flags)
        {
            var query = _context.Dishes
                .Include(d => d.Images)
                .Include(d => d.Ingredients)
                    .ThenInclude(i => i.Product)
                .AsQueryable();

            if (category.HasValue)
            {
                query = query.Where(d => (int)d.Category == category.Value);
            }

            if (flags.HasValue && flags.Value > 0)
            {
                query = query.Where(d => (int)d.Flags == flags.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(d => d.Name.Contains(search));
            }

            query = query.OrderBy(d => d.Name);

            var dishes = query.ToList().Select(s => s.ToDishDto());

            return Ok(dishes);
        }


        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] Guid id)
        {
            var dish = _context.Dishes
                .Include(d => d.Images)
                .Include(d => d.Ingredients)
                    .ThenInclude(i => i.Product)
                .FirstOrDefault(x => x.Id == id);

            if (dish == null) return NotFound();

            return Ok(dish.ToDishDto());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateDishRequestDto dishDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            foreach (var ingredient in dishDto.Ingredients)
            {
                var productExists = _context.Products.Any(p => p.Id == ingredient.ProductId);
                if (!productExists)
                {
                    return BadRequest($"Продукт с ID {ingredient.ProductId} не существует в системе. Сначала создайте продукт.");
                }
            }

            var dishModel = dishDto.ToDishFromCreateDTO();

            _context.Dishes.Add(dishModel);
            _context.SaveChanges();

            var result = _context.Dishes
                .Include(d => d.Ingredients)
                    .ThenInclude(i => i.Product)
                .Include(d => d.Images)
                .First(x => x.Id == dishModel.Id);

            return CreatedAtAction(nameof(GetById), new { id = dishModel.Id }, result.ToDishDto());
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] Guid id, [FromBody] UpdateDishRequestDto dishDto)
        {
            var dishModel = _context.Dishes.FirstOrDefault(x => x.Id == id);
            if (dishModel == null) return NotFound();

            var oldIngredients = _context.DishIngredients.Where(i => i.DishId == id);
            var oldImages = _context.DishImages.Where(img => img.DishId == id);

            _context.DishIngredients.RemoveRange(oldIngredients);
            _context.DishImages.RemoveRange(oldImages);
            _context.SaveChanges();

            dishModel.Name = dishDto.Name;
            dishModel.Calories = dishDto.Calories;
            dishModel.Proteins = dishDto.Proteins;
            dishModel.Fats = dishDto.Fats;
            dishModel.Carbohydrates = dishDto.Carbohydrates;
            dishModel.PortionSize = dishDto.PortionSize;
            dishModel.Category = dishDto.Category;
            dishModel.Flags = dishDto.Flags;
            dishModel.UpdatedAt = DateTime.UtcNow;

            if (dishDto.Ingredients != null)
            {
                foreach (var i in dishDto.Ingredients)
                {
                    _context.DishIngredients.Add(new DishIngredient
                    {
                        DishId = id,
                        ProductId = i.ProductId,
                        Amount = i.Amount
                    });
                }
            }

            if (dishDto.Images != null)
            {
                foreach (var imgDto in dishDto.Images)
                {
                    _context.DishImages.Add(new DishImage
                    {
                        DishId = id,
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
                return StatusCode(500, "Ошибка параллельного доступа. Попробуйте еще раз.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }

            var result = _context.Dishes
                .Include(d => d.Ingredients).ThenInclude(i => i.Product)
                .Include(d => d.Images)
                .First(x => x.Id == id);

            return Ok(result.ToDishDto());
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            var dishModel = _context.Dishes.Find(id);
            if (dishModel == null) return NotFound();

            _context.Dishes.Remove(dishModel);
            _context.SaveChanges();
            return NoContent();
        }
    }
}

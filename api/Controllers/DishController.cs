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
        [FromQuery] List<int>? flags)
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

            if (flags != null && flags.Any())
            {
                var preFilteredList = query.ToList();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    preFilteredList = preFilteredList.Where(d => d.Name.Contains(search, StringComparison.OrdinalIgnoreCase)).ToList();
                }

                var filteredDishes = preFilteredList
                    .Where(d => d.Flags.Any(f => flags.Contains((int)f)))
                    .OrderBy(d => d.Name)
                    .Select(s => s.ToDishDto());

                return Ok(filteredDishes);
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

            double totalBju = dishDto.Proteins + dishDto.Fats + dishDto.Carbohydrates;

            if (totalBju > dishDto.PortionSize)
            {
                ModelState.AddModelError("BjuSum", $"Сумма БЖУ ({totalBju}г) не может превышать общий вес одной порции ({dishDto.PortionSize}г).");
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

            // =========================================================================
            // 2.4 ТЗ: СЕРВЕРНАЯ ПРОВЕРА СЛЕДОВАНИЯ ФЛАГОВ РЕЦЕПТА
            // =========================================================================
            if (dishDto.Flags != null && dishDto.Flags.Any())
            {
                var ingredientIds = dishDto.Ingredients.Select(i => i.ProductId).ToList();
                var databaseProducts = _context.Products.Where(p => ingredientIds.Contains(p.Id)).ToList();

                foreach (var flag in dishDto.Flags)
                {
                    int flagValue = (int)flag;

                    if (flagValue == 1 && databaseProducts.Any(p => p.Flags == null || !p.Flags.Select(f => (int)f).Contains(1)))
                    {
                        return BadRequest("Ошибка ТЗ (Пункт 2.4): Нельзя установить флаг 'Веган' для блюда, так как в его составе есть не-веганские продукты.");
                    }
                    if (flagValue == 2 && databaseProducts.Any(p => p.Flags == null || !p.Flags.Select(f => (int)f).Contains(2)))
                    {
                        return BadRequest("Ошибка ТЗ (Пункт 2.4): Нельзя установить флаг 'Без глютена' для блюда, так как в его составе есть продукты с глютеном.");
                    }
                    if (flagValue == 3 && databaseProducts.Any(p => p.Flags == null || !p.Flags.Select(f => (int)f).Contains(3)))
                    {
                        return BadRequest("Ошибка ТЗ (Пункт 2.4): Нельзя установить флаг 'Без сахара' для блюда, так как в его составе есть сахарсодержащие продукты.");
                    }
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            double totalBju = dishDto.Proteins + dishDto.Fats + dishDto.Carbohydrates;

            if (totalBju > dishDto.PortionSize)
            {
                ModelState.AddModelError("BjuSum", $"Сумма БЖУ ({totalBju}г) не может превышать общий вес одной порции ({dishDto.PortionSize}г).");
                return BadRequest(ModelState);
            }

            var dishModel = _context.Dishes.FirstOrDefault(x => x.Id == id);
            if (dishModel == null) return NotFound();

            // =========================================================================
            // 2.4 ТЗ: СЕРВЕРНАЯ ПРОВЕРА СЛЕДОВАНИЯ ФЛАГОВ ПРИ ОБНОВЛЕНИИ
            // =========================================================================
            if (dishDto.Ingredients != null && dishDto.Ingredients.Any() && dishDto.Flags != null && dishDto.Flags.Any())
            {
                var ingredientIds = dishDto.Ingredients.Select(i => i.ProductId).ToList();
                var databaseProducts = _context.Products.Where(p => ingredientIds.Contains(p.Id)).ToList();

                foreach (var flag in dishDto.Flags)
                {
                    int flagValue = (int)flag;

                    if (flagValue == 1 && databaseProducts.Any(p => p.Flags == null || !p.Flags.Select(f => (int)f).Contains(1)))
                    {
                        return BadRequest("Ошибка ТЗ (Пункт 2.4): Нельзя установить флаг 'Веган' для блюда, так как в его составе есть не-веганские продукты.");
                    }
                    if (flagValue == 2 && databaseProducts.Any(p => p.Flags == null || !p.Flags.Select(f => (int)f).Contains(2)))
                    {
                        return BadRequest("Ошибка ТЗ (Пункт 2.4): Нельзя установить флаг 'Без глютена' для блюда, так как в его составе есть продукты с глютеном.");
                    }
                    if (flagValue == 3 && databaseProducts.Any(p => p.Flags == null || !p.Flags.Select(f => (int)f).Contains(3)))
                    {
                        return BadRequest("Ошибка ТЗ (Пункт 2.4): Нельзя установить флаг 'Без сахара' для блюда, так как в его составе есть сахарсодержащие продукты.");
                    }
                }
            }

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

            // ИСПРАВЛЕНИЕ ТЗ: Прибавляем требуемые +7 часов к серверному времени UTC (Tomsk/Novosibirsk zone)
            dishModel.UpdatedAt = DateTime.UtcNow.AddHours(7);

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

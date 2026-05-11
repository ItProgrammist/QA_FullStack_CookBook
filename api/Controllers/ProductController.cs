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
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Include(p => p.Images)
                .ToList()
                .Select(s => s.ToProductDto());
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
            var productModel = _context.Products
                .Include(p => p.Images)
                .FirstOrDefault(x => x.Id == id);

            if (productModel == null) return NotFound();

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

            if (productModel.Images.Any())
            {
                _context.ProductImages.RemoveRange(productModel.Images);
                _context.SaveChanges();
            }

            foreach (var imgDto in productDto.Images)
            {
                productModel.Images.Add(new ProductImage 
                { 
                    Data = Convert.FromBase64String(imgDto.Base64Data),
                    ContentType = imgDto.ContentType
                });
            }

            try 
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "Ошибка при обновлении базы данных: " + ex.Message);
            }

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

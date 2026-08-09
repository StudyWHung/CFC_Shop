using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CfcShop.Api.Data;
using CfcShop.Api.Models.Entities;
using CfcShop.Api.DTOs.Categories;

namespace CfcShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Description = c.Description
            })
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/categories/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .Where(c => c.CategoryId == id)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Description = c.Description
            })
            .FirstOrDefaultAsync();

        if (category == null)
        {
            return NotFound(new { message = $"Không tìm thấy danh mục với ID = {id}" });
        }

        return Ok(category);
    }

    // POST: api/categories
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var category = new Category
        {
            CategoryName = dto.CategoryName,
            Description = dto.Description
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var resultDto = new CategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, resultDto);
    }

    // PUT: api/categories/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound(new { message = $"Không tìm thấy danh mục với ID = {id}" });
        }

        category.CategoryName = dto.CategoryName;
        category.Description = dto.Description;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.CategoryId == id);

        if (category == null)
        {
            return NotFound(new { message = $"Không tìm thấy danh mục với ID = {id}" });
        }

        if (category.Products.Any())
        {
            return BadRequest(new { message = "Không thể xóa danh mục đang có sản phẩm." });
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CfcShop.Api.Data;
using CfcShop.Api.Models.Entities;
using CfcShop.Api.DTOs.Products;

namespace CfcShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/products?categoryId=1&search=jersey
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] int? categoryId,
        [FromQuery] string? search)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsNoTracking();

        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(p => p.ProductName.ToLower().Contains(searchLower) || p.ProductCode.ToLower().Contains(searchLower));
        }

        var products = await query
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductCode = p.ProductCode,
                ProductName = p.ProductName,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.CategoryName : string.Empty
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .Where(p => p.ProductId == id)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductCode = p.ProductCode,
                ProductName = p.ProductName,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.CategoryName : string.Empty
            })
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id}" });
        }

        return Ok(product);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = $"Danh mục có ID = {dto.CategoryId} không tồn tại." });
        }

        var codeExists = await _context.Products.AnyAsync(p => p.ProductCode.ToLower() == dto.ProductCode.Trim().ToLower());
        if (codeExists)
        {
            return BadRequest(new { message = $"Mã sản phẩm '{dto.ProductCode}' đã tồn tại." });
        }

        var product = new Product
        {
            ProductCode = dto.ProductCode,
            ProductName = dto.ProductName,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Reload category name for response
        var categoryName = await _context.Categories
            .Where(c => c.CategoryId == product.CategoryId)
            .Select(c => c.CategoryName)
            .FirstOrDefaultAsync() ?? string.Empty;

        var resultDto = new ProductDto
        {
            ProductId = product.ProductId,
            ProductCode = product.ProductCode,
            ProductName = product.ProductName,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            CategoryName = categoryName
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, resultDto);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id}" });
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = $"Danh mục có ID = {dto.CategoryId} không tồn tại." });
        }

        var codeExists = await _context.Products.AnyAsync(p => p.ProductId != id && p.ProductCode.ToLower() == dto.ProductCode.Trim().ToLower());
        if (codeExists)
        {
            return BadRequest(new { message = $"Mã sản phẩm '{dto.ProductCode}' đã tồn tại." });
        }

        product.ProductCode = dto.ProductCode;
        product.ProductName = dto.ProductName;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.ImageUrl = dto.ImageUrl;
        product.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id}" });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

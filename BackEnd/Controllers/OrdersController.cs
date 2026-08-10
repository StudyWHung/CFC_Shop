using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CfcShop.Api.Data;
using CfcShop.Api.DTOs.Orders;
using CfcShop.Api.Models.Entities;

namespace CfcShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/orders (Checkout)
    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (dto.Items == null || dto.Items.Count == 0)
        {
            return BadRequest(new { message = "Giỏ hàng không có sản phẩm nào để đặt hàng." });
        }

        // 1. Trích xuất UserId an toàn từ JWT Token Claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return Unauthorized(new { message = "Không tìm thấy thông tin tài khoản người dùng." });
        }

        // 2. Thực thi Transaction đảm bảo tính toàn vẹn và trừ kho an toàn
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToListAsync();

            if (products.Count != productIds.Count)
            {
                return BadRequest(new { message = "Một hoặc nhiều sản phẩm trong giỏ hàng không tồn tại." });
            }

            decimal totalAmount = 0;
            var orderDetails = new List<OrderDetail>();
            var responseItems = new List<OrderDetailItemDto>();

            // 3. Kiểm tra số lượng tồn kho và khấu trừ
            foreach (var item in dto.Items)
            {
                var product = products.First(p => p.ProductId == item.ProductId);

                if (product.StockQuantity < item.Quantity)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new
                    {
                        message = $"Sản phẩm '{product.ProductName}' chỉ còn {product.StockQuantity} chiếc trong kho, không đủ đáp ứng số lượng {item.Quantity} chiếc bạn đặt."
                    });
                }

                // Trừ tồn kho thực tế trong CSDL
                product.StockQuantity -= item.Quantity;

                var lineTotal = product.Price * item.Quantity;
                totalAmount += lineTotal;

                var orderDetail = new OrderDetail
                {
                    ProductId = product.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };
                orderDetails.Add(orderDetail);

                responseItems.Add(new OrderDetailItemDto
                {
                    ProductId = product.ProductId,
                    ProductCode = product.ProductCode,
                    ProductName = product.ProductName,
                    ImageUrl = product.ImageUrl,
                    UnitPrice = product.Price,
                    Quantity = item.Quantity
                });
            }

            // 4. Tạo mã đơn hàng độc quyền chuẩn Chelsea FC
            var randomSuffix = new Random().Next(1000, 9999);
            var orderCode = $"CFC-ORD-{DateTime.UtcNow:yyyyMMdd}-{randomSuffix}";

            var order = new Order
            {
                OrderCode = orderCode,
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                Status = "Completed",
                OrderDetails = orderDetails
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            var responseDto = new OrderResponseDto
            {
                OrderId = order.OrderId,
                OrderCode = order.OrderCode,
                UserId = user.UserId,
                CustomerName = user.FullName,
                CustomerEmail = user.Email,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                Items = responseItems
            };

            return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, responseDto);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = $"Đã xảy ra lỗi trong quá trình xử lý đơn hàng: {ex.Message}" });
        }
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrders()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        var isAdmin = roleClaim.Equals("Admin", StringComparison.OrdinalIgnoreCase);

        var query = _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .AsNoTracking();

        if (!isAdmin)
        {
            query = query.Where(o => o.UserId == userId);
        }

        var orders = await query
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderResponseDto
            {
                OrderId = o.OrderId,
                OrderCode = o.OrderCode,
                UserId = o.UserId,
                CustomerName = o.User != null ? o.User.FullName : "Khách hàng",
                CustomerEmail = o.User != null ? o.User.Email : string.Empty,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                Items = o.OrderDetails.Select(od => new OrderDetailItemDto
                {
                    OrderDetailId = od.OrderDetailId,
                    ProductId = od.ProductId,
                    ProductCode = od.Product != null ? od.Product.ProductCode : string.Empty,
                    ProductName = od.Product != null ? od.Product.ProductName : string.Empty,
                    ImageUrl = od.Product != null ? od.Product.ImageUrl : string.Empty,
                    UnitPrice = od.UnitPrice,
                    Quantity = od.Quantity
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrderById(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        var isAdmin = roleClaim.Equals("Admin", StringComparison.OrdinalIgnoreCase);

        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .AsNoTracking()
            .Where(o => o.OrderId == id && (isAdmin || o.UserId == userId))
            .Select(o => new OrderResponseDto
            {
                OrderId = o.OrderId,
                OrderCode = o.OrderCode,
                UserId = o.UserId,
                CustomerName = o.User != null ? o.User.FullName : "Khách hàng",
                CustomerEmail = o.User != null ? o.User.Email : string.Empty,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                Items = o.OrderDetails.Select(od => new OrderDetailItemDto
                {
                    OrderDetailId = od.OrderDetailId,
                    ProductId = od.ProductId,
                    ProductCode = od.Product != null ? od.Product.ProductCode : string.Empty,
                    ProductName = od.Product != null ? od.Product.ProductName : string.Empty,
                    ImageUrl = od.Product != null ? od.Product.ImageUrl : string.Empty,
                    UnitPrice = od.UnitPrice,
                    Quantity = od.Quantity
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound(new { message = $"Không tìm thấy đơn hàng #{id} hoặc bạn không có quyền xem." });
        }

        return Ok(order);
    }
}

using System.ComponentModel.DataAnnotations;

namespace CfcShop.Api.DTOs.Products;

public class CreateProductDto
{
    [Required(ErrorMessage = "Mã sản phẩm là bắt buộc")]
    [MaxLength(50)]
    public string ProductCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
    [MaxLength(200)]
    public string ProductName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0.01, 1000000, ErrorMessage = "Giá sản phẩm phải lớn hơn 0")]
    public decimal Price { get; set; }

    [Range(0, 10000, ErrorMessage = "Số lượng kho không hợp lệ")]
    public int StockQuantity { get; set; }

    public string? ImageUrl { get; set; }

    [Required(ErrorMessage = "Danh mục là bắt buộc")]
    public int CategoryId { get; set; }
}

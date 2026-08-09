using System.ComponentModel.DataAnnotations;

namespace CfcShop.Api.DTOs.Categories;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}

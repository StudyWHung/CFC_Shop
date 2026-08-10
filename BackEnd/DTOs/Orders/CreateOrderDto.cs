using System.ComponentModel.DataAnnotations;

namespace CfcShop.Api.DTOs.Orders;

public class CreateOrderItemDto
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, 1000, ErrorMessage = "Số lượng phải từ 1 đến 1000")]
    public int Quantity { get; set; }
}

public class CreateOrderDto
{
    [Required(ErrorMessage = "Danh sách sản phẩm không được rỗng")]
    [MinLength(1, ErrorMessage = "Đơn hàng phải có ít nhất 1 sản phẩm")]
    public List<CreateOrderItemDto> Items { get; set; } = new();

    public string? Note { get; set; }
}

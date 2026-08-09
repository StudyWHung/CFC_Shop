namespace CfcShop.Api.Models.Entities;

public class Order
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled

    // Navigation properties
    public User? User { get; set; }
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}

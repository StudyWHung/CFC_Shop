using Microsoft.EntityFrameworkCore;
using CfcShop.Api.Models.Entities;

namespace CfcShop.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Decimal precision
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderDetail>()
            .Property(od => od.UnitPrice)
            .HasPrecision(18, 2);

        // Relationships & Foreign Keys
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.User)
            .WithMany(u => u.CartItems)
            .HasForeignKey(ci => ci.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany(p => p.CartItems)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderDetail>()
            .HasOne(od => od.Order)
            .WithMany(o => o.OrderDetails)
            .HasForeignKey(od => od.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderDetail>()
            .HasOne(od => od.Product)
            .WithMany(p => p.OrderDetails)
            .HasForeignKey(od => od.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Unique Indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.ProductCode)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderCode)
            .IsUnique();

        // Seed Data: Roles
        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, RoleName = "Admin" },
            new Role { RoleId = 2, RoleName = "User" }
        );

        // Seed Data: Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Email = "admin@cfcshop.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FullName = "System Administrator",
                RoleId = 1,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                UserId = 2,
                Email = "user@cfcshop.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                FullName = "Demo User",
                RoleId = 2,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Seed Data: Sample Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, CategoryName = "Home & Away Kits", Description = "Official Chelsea FC Match Kits and Jerseys" },
            new Category { CategoryId = 2, CategoryName = "Training Wear", Description = "Tracksuits, Jackets, and Training Apparel" },
            new Category { CategoryId = 3, CategoryName = "Accessories & Headwear", Description = "Scarves, Caps, Bags, and Gloves" },
            new Category { CategoryId = 4, CategoryName = "Souvenirs & Collectibles", Description = "Mugs, Keychains, Flags, and Memorabilia" }
        );

        // Seed Data: Sample Chelsea FC Products
        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, ProductCode = "KIT-CFC-001", ProductName = "Chelsea FC 2024/25 Home Jersey", Description = "Official Chelsea FC 2024/25 Home Jersey featuring breathable Dri-FIT technology.", Price = 89.99m, StockQuantity = 50, ImageUrl = "/images/products/home-kit.jpg", CategoryId = 1 },
            new Product { ProductId = 2, ProductCode = "KIT-CFC-002", ProductName = "Chelsea FC Away Jersey 2024/25", Description = "Official Chelsea FC 2024/25 Away Jersey with modern design and premium fabric.", Price = 89.99m, StockQuantity = 40, ImageUrl = "/images/products/away-kit.jpg", CategoryId = 1 },
            new Product { ProductId = 3, ProductCode = "TRN-CFC-001", ProductName = "Chelsea FC Anthem Track Jacket", Description = "Comfortable Chelsea FC Anthem Track Jacket for training and casual wear.", Price = 75.00m, StockQuantity = 30, ImageUrl = "/images/products/anthem-jacket.jpg", CategoryId = 2 },
            new Product { ProductId = 4, ProductCode = "ACC-CFC-001", ProductName = "Official Chelsea Scarf - Blue & White", Description = "Classic blue and white knitted Chelsea FC fan scarf.", Price = 25.00m, StockQuantity = 100, ImageUrl = "/images/products/chelsea-scarf.jpg", CategoryId = 3 },
            new Product { ProductId = 5, ProductCode = "SOU-CFC-001", ProductName = "Chelsea FC Crest Ceramic Mug", Description = "High quality ceramic mug with official Chelsea FC crest.", Price = 15.00m, StockQuantity = 75, ImageUrl = "/images/products/crest-mug.jpg", CategoryId = 4 }
        );
    }
}

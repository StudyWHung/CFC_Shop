# Project Memory Log - CFC_Shop

## [2026-08-09] - Hoàn thành Step 1 & Step 2 (Backend Core, PostgreSQL & Documentation)
### 1. Backend & PostgreSQL Integration (Step 1)
- Khởi tạo dự án .NET 8 Web API tại thư mục `BackEnd/`.
- Cấu hình Entity Framework Core với PostgreSQL (`cfc_shop_db`, port 5432, password `123456`).
- Tạo đủ 7 Entities (`Role`, `User`, `Category`, `Product`, `CartItem`, `Order`, `OrderDetail`).
- Thực thi `dotnet ef database update` khởi tạo CSDL `cfc_shop_db` và nạp Seed Data.

### 2. Nâng cấp CSDL theo Option A (Schema Enhancement)
- Bổ sung `ProductCode` (Mã SKU), `Description` (Mô tả), `CreatedAt` vào bảng `Products`.
- Bổ sung `OrderCode` (Mã đơn hàng) vào bảng `Orders` và `CreatedAt` vào `Users`.
- Thiết lập Unique Index cho `User.Email`, `Product.ProductCode`, và `Order.OrderCode`.
- Tạo EF Core Migration `AddCodesAndDescriptions` và cập nhật thành công lên PostgreSQL `cfc_shop_db`.

### 3. Core APIs & DTOs (Step 2)
- Cập nhật DTOs (`ProductDto`, `CreateProductDto`, `UpdateProductDto`) và `ProductsController` để xử lý `ProductCode` và `Description`, hỗ trợ tìm kiếm sản phẩm theo cả tên và mã sản phẩm.
- Cấu hình CORS cho phép kết nối từ Next.js (`http://localhost:3000`).

### 4. Git & Documentation System Setup
- Khởi tạo Git repository và cấu hình Remote Origin (`https://github.com/StudyWHung/CFC_Shop.git`).
- Tạo hệ thống tài liệu quản lý dự án trong `docs/`: `docs/rules.md`, `docs/tech_stack.md`, `docs/memory.md`.


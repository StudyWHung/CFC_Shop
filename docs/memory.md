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

### 5. Repository Cleanup & Migration Architecture Audit
- Tạo file `.gitignore` chuẩn ở thư mục gốc để tự động loại bỏ các thư mục rác tự sinh (`.vs/`, `bin/`, `obj/`, `*.user`).
- Kiểm tra toàn bộ cấu trúc dự án: XÁC NHẬN dự án gọn gàng, chia tầng rõ ràng (`Controllers`, `DTOs`, `Models/Entities`, `Data`), không có file code dư thừa hay lỗi logic.
- Phân tích chi tiết vai trò của 5 file trong `Migrations/` (`InitialCreate`, `AddCodesAndDescriptions`, `ModelSnapshot`).

## [2026-08-10] - Hoàn thành Step 3 (Backend Auth & Security - JWT, BCrypt, Roles)
### 1. Authentication & JWT Integration
- Cài đặt 2 gói NuGet: `Microsoft.AspNetCore.Authentication.JwtBearer` (v8.0.4) và `BCrypt.Net-Next` (v4.0.3).
- Cấu hình Jwt key, issuer, audience và thời gian hết hạn trong `appsettings.json`.
- Tạo bộ DTOs Auth trong `DTOs/Auth/`: `RegisterDto`, `LoginDto`, `AuthResponseDto`, `UserProfileDto`.
- Triển khai `IAuthService` & `AuthService` hỗ trợ:
  - Đăng ký người dùng mới (Role `User`), băm mật khẩu với BCrypt.
  - Đăng nhập xác thực BCrypt, phát hành Token JWT chứa Claims (`UserId`, `Email`, `Role`, `FullName`).
  - Lấy thông tin cá nhân `GetProfileAsync`.

### 2. Controllers & Role Authorization
- Tạo `AuthController` với các endpoint: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (`[Authorize]`).
- Phân quyền hệ thống: Gắn `[Authorize(Roles = "Admin")]` bảo vệ các endpoint Thêm/Sửa/Xóa ở `ProductsController` và `CategoriesController`.
- Cấu hình SwaggerGen hỗ trợ nút **Authorize (Bearer JWT)** trực tiếp trên giao diện Swagger UI.

### 3. Database Migration & Seed Data
- Nạp Seed Data cho 2 tài khoản sẵn có trong `AppDbContext`:
  - Admin: `admin@cfcshop.com` / `Admin@123` (Role `Admin`).
  - User: `user@cfcshop.com` / `User@123` (Role `User`).
- Tạo EF Core Migration `AddAuthAndSeedUsers` và cập nhật thành công lên CSDL PostgreSQL.




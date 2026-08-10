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

## [2026-08-10] - Hoàn thành Step 4 (Frontend Next.js 14, LocalStorage, Dropdowns & Màn CRUD)
### 1. Khởi tạo & Cấu trúc Dự án Next.js 14
- Khởi tạo thành công dự án Next.js 14 (App Router) với TypeScript, Tailwind CSS và Lucide Icons trong thư mục `FrontEnd/`.
- Thiết lập bảng màu Chelsea FC (`#034694`, `#001433`, `#dba111`) và các hiệu ứng giao diện thể thao hiện đại.
- Cấu hình thư viện gọi API `lib/api.ts` kết nối với Backend .NET 8 Web API.

### 2. Thực hành Kỹ năng LocalStorage & Dropdowns
- **LocalStorage**:
  - `CartContext.tsx`: Quản lý giỏ hàng tự động lưu/phục hồi từ `localStorage.getItem('cfc_cart')` / `setItem` (F5 hoặc tắt trình duyệt không mất giỏ hàng).
  - `AuthContext.tsx`: Lưu trữ JWT Token và User Session vào `localStorage`.
- **Hệ thống 5 Dropdown**:
  1. *Dropdown Bộ Sưu Tập* trên Navbar.
  2. *Dropdown Tài Khoản / Avatar* trên Navbar.
  3. *Dropdown Lọc Danh Mục* tại thanh Filter Store.
  4. *Dropdown Sắp Xếp Giá / Tên* tại thanh Filter Store.
  5. *Dropdown Chọn Danh Mục* trong Form Modal Thêm/Sửa Sản Phẩm (CRUD).

### 3. Xây dựng Màn hình CRUD Quản trị Sản phẩm (`/admin/products`)
- **C (Create)**: Form Modal thêm sản phẩm mới (SKU, Tên, Dropdown Danh mục, Giá, Tồn kho, Ảnh, Mô tả).
- **R (Read)**: Bảng dữ liệu sản phẩm đầy đủ kèm 4 thẻ Thống kê (Tổng sản phẩm, Tồn kho, Giá TB, Danh mục).
- **U (Update)**: Nút "Sửa" mở Modal nạp sẵn dữ liệu cũ để cập nhật.
- **D (Delete)**: Nút "Xóa" kèm Popup xác nhận an toàn.

## [2026-08-10] - Tối Ưu Toàn Diện: Chuẩn Hóa Hình Ảnh, Phân Quyền Role & Tinh Gọn UI
### 1. Chuẩn hóa Hình ảnh Cục bộ (Local Assets)
- Thiết lập thư mục ảnh tĩnh chuẩn tại `FrontEnd/public/images/`:
  - `chelsea-logo.svg`: Logo sư tử Chelsea FC chính thức.
  - `hero-chelsea.jpg`: Ảnh nền sân vận động Stamford Bridge độ nét cao với hiệu ứng gradient xanh hoàng gia.
  - `products/`: Lưu trữ 5 ảnh sản phẩm thực tế (`home-kit.jpg`, `away-kit.jpg`, `anthem-jacket.jpg`, `chelsea-scarf.jpg`, `crest-mug.jpg`).
- Cập nhật Seed Data trong `AppDbContext.cs` và áp dụng Migration `UpdateProductImagePaths` cập nhật trực tiếp vào CSDL PostgreSQL.

### 2. Phân Quyền Role Rạch Ròi & Cài Đặt Route Guard
- **Role `User` / Khách vãng lai**: 
  - Chỉ là khách hàng mua sắm, xem sản phẩm, lọc danh mục, thêm giỏ hàng.
  - Ẩn toàn bộ 100% các nút và link liên quan đến CRUD/Quản trị.
  - Thiết lập Route Guard tại `/admin/products`: Nếu truy cập bằng tài khoản User hoặc chưa đăng nhập sẽ hiển thị màn hình cảnh báo **"403 Forbidden - Quyền Truy Cập Bị Từ Chối"** và bị chặn xem bảng dữ liệu.
- **Role `Admin`**: 
  - Được hiển thị mục "Trang Quản Trị CRUD" bên trong Dropdown Avatar khi đăng nhập với tài khoản Admin.
  - Toàn quyền truy cập và thao tác Thêm / Sửa / Xóa tại `/admin/products`.

### 3. Tinh Gọn Giao Diện & Tắt Dev Indicator
- Dọn dẹp triệt để các nút CRUD rải rác: xóa nút CRUD giữa Navbar, xóa nút CRUD trên Hero Banner, xóa cột CRUD ở Footer.
- Xóa bỏ dòng chữ thông tin công nghệ framework ở chân Footer để giao diện thuần E-Commerce.
- Xóa bỏ khối nút "Thử Nhanh Tài Khoản Mẫu (1-Click Test)" trong Modal Đăng nhập (`AuthModal.tsx`).
- Tắt hoàn toàn nút tròn đen "N" (Next.js Dev Indicator) qua `next.config.ts` và `globals.css` để góc màn hình sạch sẽ.
- Toàn bộ dự án biên dịch thành công `npm run build` với 0 lỗi.







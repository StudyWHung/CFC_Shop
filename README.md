# 🦁 Chelsea FC Fan Store — Pride of London (CFC Shop)

Dự án website thương mại điện tử mua sắm áo đấu, trang phục và đồ lưu niệm chính hãng dành riêng cho người hâm mộ câu lạc bộ **Chelsea FC**, được xây dựng theo kiến trúc **Full-Stack Monorepo hiện đại** với hiệu năng cao, bảo mật JWT và trải nghiệm người dùng cao cấp.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### 💻 Front-End
* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
* **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
* **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) (Bảng màu nhận diện Chelsea FC: Royal Blue, Navy & Gold)
* **Giao tiếp Mạng:** [Axios](https://axios-http.com/) với Interceptors tự động đính kèm JWT Bearer Token
* **Biểu tượng (Icons):** [Lucide React](https://lucide.dev/)
* **Lưu trữ Cục bộ:** HTML5 `localStorage` (Tự động đồng bộ giỏ hàng và duy trì phiên đăng nhập)

### ⚙️ Back-End
* **Nền tảng:** [ASP.NET Core Web API 9.0 (.NET 9)](https://dotnet.microsoft.com/)
* **ORM:** [Entity Framework Core 9.0](https://learn.microsoft.com/en-us/ef/core/) (Npgsql Provider)
* **Xác thực & Phân quyền:** JWT Bearer Authentication & BCrypt Password Hashing
* **Tài liệu API:** Swagger UI / OpenAPI hỗ trợ nút Authorize Token trực tiếp

### 🗄️ Cơ Sở Dữ Liệu
* **Hệ quản trị CSDL:** [PostgreSQL](https://www.postgresql.org/) (Database: `cfc_shop_db`)

---

## ✨ Tính Năng Nổi Bật

### 🛍️ Dành cho Khách Hàng (Storefront)
1. **Trang chủ sống động:** Banner sân vận động Stamford Bridge độ nét cao, hiệu ứng cuộn mượt đến danh sách sản phẩm.
2. **Tìm kiếm & Bộ lọc tức thì:** Lọc theo danh mục (Áo sân nhà, Áo sân khách, Đồ tập luyện...) và Sắp xếp giá tăng/giảm, tên A-Z mượt mà với `useMemo`.
3. **Giỏ hàng thông minh (Cart Persistence):** Ngăn kéo trượt bên phải (Slide-out Drawer), tự động đồng bộ vào `localStorage` (F5 hoặc tắt trình duyệt không mất giỏ hàng).
4. **Hóa đơn thành công (Order Success Modal):** Cửa sổ chúc mừng hiển thị mã đơn hàng và danh sách sản phẩm sau khi thanh toán.
5. **Xác thực linh hoạt:** Đăng nhập & Đăng ký tài khoản nhanh chóng với cửa sổ AuthModal.

### 🛡️ Dành cho Quản Trị Viên (Admin Dashboard)
1. **Bảo mật phân quyền (Route Guard):** Chặn người dùng thường (`403 Forbidden`), chỉ cho phép tài khoản quyền **Admin** truy cập đường dẫn `/admin/products`.
2. **Thống kê kho hàng tự động:** 4 thẻ số liệu thời gian thực (Tổng sản phẩm, Tổng tồn kho, Giá trung bình, Số danh mục đang hoạt động).
3. **Quản trị CRUD trọn gói:**
   * **Create (Thêm mới):** Nhập mã SKU, tên áo, giá bán, tồn kho, ảnh và chọn danh mục.
   * **Read (Xem danh sách):** Bảng dữ liệu thông minh với cảnh báo tồn kho ít (< 10 chiếc).
   * **Update (Chỉnh sửa):** Tự động điền dữ liệu cũ lên form để cập nhật nhanh.
   * **Delete (Xóa):** Hộp thoại cảnh báo màu đỏ xác nhận lần 2 trước khi xóa khỏi PostgreSQL.

---

## 📁 Cấu Trúc Thư Mục Dự Án (Monorepo)

```
CFC_Shop/
├── BackEnd/                    # ASP.NET Core Web API 9.0
│   ├── Controllers/            # AuthController, ProductsController, CategoriesController
│   ├── Data/                   # AppDbContext & Cấu hình CSDL PostgreSQL
│   ├── DTOs/                   # Data Transfer Objects (Request/Response)
│   ├── Migrations/             # EF Core Migrations
│   ├── Models/                 # Role, User, Category, Product
│   ├── Services/               # IAuthService & AuthService (BCrypt, JWT)
│   ├── Program.cs              # Khởi tạo Middleware, CORS, JWT & DI
│   └── appsettings.json        # Chuỗi kết nối PostgreSQL & Cấu hình JWT
│
├── FrontEnd/                   # Next.js 16 + React 19 + Tailwind v4
│   ├── public/                 # Logo Chelsea SVG, Ảnh sân Stamford Bridge, Ảnh sản phẩm
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── layout.tsx      # Root Layout & Metadata SEO
│   │   │   ├── page.tsx        # Trang chủ Storefront
│   │   │   ├── globals.css     # CSS toàn cục & Tailwind v4 Theme
│   │   │   ├── icon.svg        # Favicon huy hiệu Chelsea FC
│   │   │   └── admin/products/ # Trang Quản Trị CRUD Sản Phẩm (Route Guard)
│   │   ├── components/         # 11 Linh kiện UI (Navbar, ProductCard, Modals, Drawer...)
│   │   ├── context/            # AuthContext & CartContext (LocalStorage Engine)
│   │   ├── lib/                # api.ts (Axios Client & Request Interceptors)
│   │   └── types/              # Định nghĩa Interface TypeScript chuẩn Type Safety
│   ├── .env.local              # Biến môi trường API URL
│   └── package.json            # Thư viện & Script FrontEnd
│
├── docs/                       # Tài liệu tiến độ & Hướng dẫn kỹ thuật
├── package.json                # Root package điều khiển chạy toàn bộ dự án
└── README.md                   # Tài liệu chính của dự án
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
* **Node.js** >= 18.x
* **.NET SDK** >= 9.0
* **PostgreSQL** Server đang chạy tại cổng `5432`

---

### 2. Thiết lập Cơ sở dữ liệu (PostgreSQL)
1. Mở file [BackEnd/appsettings.json](file:///d:/Hinet/CFC_Shop/BackEnd/appsettings.json) và kiểm tra mật khẩu PostgreSQL của bạn:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=cfc_shop_db;Username=postgres;Password=123456"
   }
   ```
2. Mở terminal tại thư mục `BackEnd` và chạy lệnh cập nhật CSDL:
   ```bash
   dotnet ef database update
   ```

---

### 3. Khởi chạy toàn bộ hệ thống (Từ thư mục gốc)

* **Chạy BackEnd API (Port 5000):**
  ```bash
  npm run backend
  ```
  👉 Truy cập Swagger UI: `http://localhost:5000/swagger`

* **Chạy FrontEnd (Port 3000) (Mở thêm 1 terminal mới):**
  ```bash
  npm run dev
  ```
  👉 Truy cập Website Store: `http://localhost:3000/`

---

## 🔑 Tài Khoản Mẫu Đăng Nhập (Seed Data)

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@cfcshop.com` | `Admin@123` | Toàn quyền Quản trị CRUD Sản phẩm tại `/admin/products` |
| **Khách hàng** | `user@cfcshop.com` | `User@123` | Mua sắm, xem áo đấu, quản lý giỏ hàng |

---

## 💙 Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ cộng đồng True Blues & học tập phát triển Full-Stack hiện đại.

* **© 2026 Chelsea FC Fan Store. All rights reserved.**

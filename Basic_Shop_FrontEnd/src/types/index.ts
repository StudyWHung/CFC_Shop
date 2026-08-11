/**
 * =============================================================================
 * FILE ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPESCRIPT INTERFACES)
 * 
 * Mục đích: 
 * - Đảm bảo tính an toàn dữ liệu (Type Safety) trong toàn bộ dự án.
 * - Giúp IDE tự động gợi ý code (IntelliSense) và cảnh báo lỗi khi truyền sai kiểu dữ liệu giữa các Component.
 * =============================================================================
 */

// 1. Kiểu dữ liệu danh mục mô hình (Ví dụ: Huyền thoại, Đội hình hiện tại...)
export interface Category {
  id: string;
  name: string;        // Tên hiển thị (VD: "Huyền Thoại (Legends)", "Đội Hình Hiện Tại")
  slug: string;        // Chuỗi không dấu để lọc URL/State (VD: "legends", "current-squad")
  description?: string;// Mô tả ngắn về danh mục
}

// 1.1. Kiểu dữ liệu Tuyến thi đấu / Vị trí của cầu thủ (FW: Tiền đạo, MF: Tiền vệ, DF: Hậu vệ, GK: Thủ môn)
export type PlayerRole = "FW" | "MF" | "DF" | "GK";

export interface RoleFilterOption {
  id: string;
  name: string;
  role: PlayerRole | "all";
}

// 2. Kiểu dữ liệu 1 Sản Phẩm Mô Hình Cầu Thủ (Figure)
export interface Product {
  id: string;          // Mã định danh duy nhất (VD: "fig-01")
  name: string;        // Tên mô hình (VD: "Mô hình Cole Palmer - Cold Celebration 15cm")
  playerName: string;  // Tên cầu thủ (VD: "Cole Palmer")
  playerNumber: number;// Số áo cầu thủ (VD: 20)
  position: string;    // Mô tả vị trí chi tiết (VD: "Tiền vệ tấn công / Cánh phải")
  role: PlayerRole;    // Tuyến thi đấu chuẩn hóa ("FW" | "MF" | "DF" | "GK")
  category: string;    // Thuộc bộ sưu tập nào (current-squad | legends)
  price: number;       // Giá bán (VNĐ)
  stock: number;       // Số lượng còn trong kho (dùng để kiểm tra còn hàng / hết hàng)
  imageUrl: string;    // Đường dẫn ảnh mô hình
  description: string; // Mô tả chi tiết (chất liệu PVC, chiều cao, phụ kiện kèm theo)
  rating: number;      // Đánh giá sao (từ 1 đến 5)
  isFeatured?: boolean;// Đánh dấu sản phẩm nổi bật để ghim lên đầu
  createdAt?: string;  // Ngày thêm sản phẩm
}


// 3. Kiểu dữ liệu 1 món hàng trong Giỏ Hàng (Cart Item)
// Kế thừa các thông tin của Product và bổ sung thêm `quantity` (số lượng người dùng muốn mua)
export interface CartItem {
  product: Product;    // Chứa trọn vẹn thông tin sản phẩm
  quantity: number;    // Số lượng khách đặt mua
}

// 4. Kiểu dữ liệu Đơn hàng khi khách bấm Đặt Hàng (Mock Order)
export interface Order {
  id: string;          // Mã đơn hàng tự sinh (VD: "CFC-ORD-171289")
  customerName: string;// Tên người nhận
  phoneNumber: string; // Số điện thoại
  address: string;     // Địa chỉ nhận hàng
  items: CartItem[];   // Danh sách các mô hình trong đơn
  totalAmount: number; // Tổng số tiền thanh toán
  createdAt: string;   // Thời gian đặt hàng (VD: "2026-02-10")
  status: "pending" | "completed" | "cancelled"; // Trạng thái đơn hàng
  paymentMethod: "cod" | "qr" | "card"; // Phương thức thanh toán
  note?: string;       // Ghi chú đơn hàng
}


import { Order } from "@/types";
import { INITIAL_PRODUCTS } from "./initialProducts";

/**
 * =============================================================================
 * DỮ LIỆU ĐƠN HÀNG MẪU BAN ĐẦU (INITIAL ORDERS - TÍNH TỰ ĐỘNG THEO NGÀY HIỆN TẠI)
 * 
 * Mục đích:
 * - Tự động tính ngày giao dịch lùi từ Ngày Hôm Nay (Today) về các ngày gần đây (0, 1, 2, 3, 5, 7, 10, 15, 20 ngày trước).
 * - Đảm bảo khi người dùng chọn lọc "Hôm Nay", "7 Ngày Qua", "30 Ngày Qua" thì LUÔN CÓ DỮ LIỆU hiển thị trực quan, sống động.
 * =============================================================================
 */

function getDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const [palmer, hazard, drogba, lampard, enzo, caicedo, cech, terry] = INITIAL_PRODUCTS;

export function getInitialOrders(): Order[] {
  return [
    {
      id: "CFC-ORD-882110",
      customerName: "Đặng Gia Bảo",
      phoneNumber: "0909887766",
      address: "Chung cư Sunrise City, Quận 7, TP. Hồ Chí Minh",
      items: [
        { product: palmer, quantity: 1 },
        { product: drogba, quantity: 1 },
      ],
      totalAmount: 650000 + 1200000,
      createdAt: getDaysAgo(0), // Hôm nay
      status: "completed",
      paymentMethod: "card",
    },
    {
      id: "CFC-ORD-882109",
      customerName: "Bùi Tiến Đạt",
      phoneNumber: "0933221100",
      address: "45 Hùng Vương, TP. Nha Trang, Khánh Hòa",
      items: [
        { product: lampard, quantity: 1 },
        { product: terry, quantity: 1 },
        { product: cech, quantity: 1 },
      ],
      totalAmount: 950000 + 890000 + 790000,
      createdAt: getDaysAgo(0), // Hôm nay
      status: "completed",
      paymentMethod: "qr",
      note: "Fan Chelsea 15 năm, shop tặng thêm huy hiệu nhé!",
    },
    {
      id: "CFC-ORD-882108",
      customerName: "Hoàng Văn Bách",
      phoneNumber: "0918776655",
      address: "Vinhomes Ocean Park, Gia Lâm, Hà Nội",
      items: [
        { product: enzo, quantity: 2 },
        { product: caicedo, quantity: 2 },
      ],
      totalAmount: 580000 * 2 + 550000 * 2,
      createdAt: getDaysAgo(1), // 1 ngày trước
      status: "completed",
      paymentMethod: "cod",
    },
    {
      id: "CFC-ORD-882107",
      customerName: "Ngô Quang Hải",
      phoneNumber: "0968889900",
      address: "123 Trần Hưng Đạo, TP. Cần Thơ",
      items: [
        { product: drogba, quantity: 2 },
        { product: hazard, quantity: 1 },
      ],
      totalAmount: 1200000 * 2 + 890000,
      createdAt: getDaysAgo(2), // 2 ngày trước
      status: "completed",
      paymentMethod: "card",
    },
    {
      id: "CFC-ORD-882106",
      customerName: "Đỗ Thành Long",
      phoneNumber: "0945671122",
      address: "Số 88 Lý Thường Kiệt, TP. Huế",
      items: [
        { product: palmer, quantity: 3 },
      ],
      totalAmount: 650000 * 3,
      createdAt: getDaysAgo(3), // 3 ngày trước
      status: "completed",
      paymentMethod: "qr",
    },
    {
      id: "CFC-ORD-882105",
      customerName: "Vũ Tuấn Kiệt",
      phoneNumber: "0971239988",
      address: "56 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
      items: [
        { product: terry, quantity: 1 },
        { product: cech, quantity: 1 },
      ],
      totalAmount: 890000 + 790000,
      createdAt: getDaysAgo(4), // 4 ngày trước
      status: "completed",
      paymentMethod: "cod",
    },
    {
      id: "CFC-ORD-882104",
      customerName: "Phạm Quốc Huy",
      phoneNumber: "0934567890",
      address: "Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh",
      items: [
        { product: palmer, quantity: 1 },
        { product: caicedo, quantity: 1 },
      ],
      totalAmount: 650000 + 550000,
      createdAt: getDaysAgo(5), // 5 ngày trước
      status: "completed",
      paymentMethod: "qr",
    },
    {
      id: "CFC-ORD-882103",
      customerName: "Lê Đức Anh",
      phoneNumber: "0903112233",
      address: "24 Nguyễn Huệ, Quận Hải Châu, Đà Nẵng",
      items: [
        { product: hazard, quantity: 2 },
      ],
      totalAmount: 890000 * 2,
      createdAt: getDaysAgo(6), // 6 ngày trước
      status: "completed",
      paymentMethod: "cod",
    },
    {
      id: "CFC-ORD-882102",
      customerName: "Trần Minh Quân",
      phoneNumber: "0987654321",
      address: "Tòa Keangnam, Phạm Hùng, Cầu Giấy, Hà Nội",
      items: [
        { product: drogba, quantity: 1 },
        { product: lampard, quantity: 1 },
      ],
      totalAmount: 1200000 + 950000,
      createdAt: getDaysAgo(10), // 10 ngày trước (trong 30 ngày)
      status: "completed",
      paymentMethod: "card",
      note: "Đóng gói bọc xốp cẩn thận hộp kỷ niệm Munich 2012",
    },
    {
      id: "CFC-ORD-882101",
      customerName: "Nguyễn Hoàng Nam",
      phoneNumber: "0912345678",
      address: "Số 15 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
      items: [
        { product: palmer, quantity: 2 },
        { product: enzo, quantity: 1 },
      ],
      totalAmount: 650000 * 2 + 580000,
      createdAt: getDaysAgo(18), // 18 ngày trước (trong 30 ngày)
      status: "completed",
      paymentMethod: "qr",
      note: "Giao giờ hành chính giúp mình",
    },
  ];
}

export const INITIAL_ORDERS: Order[] = getInitialOrders();

import { Category, Product, RoleFilterOption } from "@/types";

/**
 * =============================================================================
 * DỮ LIỆU DANH MỤC BỘ SƯU TẬP (CATEGORIES)
 * - Phân loại theo thời kỳ/mốc lịch sử: Tất cả, Đội hình hiện tại, Huyền thoại
 * =============================================================================
 */
export const CATEGORIES: Category[] = [
  { id: "cat-0", name: "Tất Cả Bộ Sưu Tập", slug: "all", description: "Toàn bộ bộ sưu tập figure Chelsea FC" },
  { id: "cat-1", name: "Đội Hình Hiện Tại", slug: "current-squad", description: "Các ngôi sao đang thi đấu mùa giải 2024/2025" },
  { id: "cat-2", name: "Huyền Thoại (Legends)", slug: "legends", description: "Các biểu tượng vĩ đại trong lịch sử The Blues" },
];

/**
 * =============================================================================
 * DỮ LIỆU TUYẾN THI ĐẤU (PLAYER ROLES / POSITIONS)
 * - Phân loại theo vai trò chuyên môn trên sân bóng: FW, MF, DF, GK
 * =============================================================================
 */
export const PLAYER_ROLES: RoleFilterOption[] = [
  { id: "role-all", name: "Tất Cả Vị Trí", role: "all" },
  { id: "role-fw", name: "Tiền Đạo (FW)", role: "FW" },
  { id: "role-mf", name: "Tiền Vệ (MF)", role: "MF" },
  { id: "role-df", name: "Hậu Vệ (DF)", role: "DF" },
  { id: "role-gk", name: "Thủ Môn (GK)", role: "GK" },
];

/**
 * =============================================================================
 * DỮ LIỆU SẢN PHẨM MẪU BAN ĐẦU (INITIAL PRODUCTS) - SỬ DỤNG ẢNH CỤC BỘ (LOCAL ASSETS)
 * =============================================================================
 */
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "fig-01",
    name: "Mô hình Cole Palmer - 'Cold Palmer' Shiver Celebration (15cm)",
    playerName: "Cole Palmer",
    playerNumber: 20,
    position: "Tiền vệ tấn công / Cánh phải",
    role: "MF",
    category: "current-squad",
    price: 650000,
    stock: 15,
    imageUrl: "/images/figures/palmer.png",
    description: "Mô hình tỉ lệ 1:12 khắc họa tư thế ăn mừng run rẩy 'Cold Palmer' kinh điển. Chất liệu nhựa PVC cao cấp, sơn chi tiết áo đấu mùa giải 2024/25, đế dựng có logo The Blues.",
    rating: 5.0,
    isFeatured: true,
    createdAt: "2026-01-15",
  },
  {
    id: "fig-02",
    name: "Mô hình Huyền Thoại Eden Hazard - Prime 2015 Edition (18cm)",
    playerName: "Eden Hazard",
    playerNumber: 10,
    position: "Tiền đạo cánh trái",
    role: "FW",
    category: "legends",
    price: 890000,
    stock: 8,
    imageUrl: "/images/figures/hazard.png",
    description: "Phiên bản giới hạn tôn vinh ảo thuật gia Eden Hazard thời kỳ đỉnh cao vô địch Ngoại Hạng Anh 2014-2015. Có khớp xoay linh hoạt và quả bóng vàng kèm theo.",
    rating: 4.9,
    isFeatured: true,
    createdAt: "2026-01-10",
  },
  {
    id: "fig-03",
    name: "Mô hình 'Voi Rừng' Didier Drogba - Munich 2012 Champions (20cm)",
    playerName: "Didier Drogba",
    playerNumber: 11,
    position: "Tiền đạo cắm",
    role: "FW",
    category: "legends",
    price: 1200000,
    stock: 5,
    imageUrl: "/images/figures/drogba.png",
    description: "Tượng đài Didier Drogba với cúp tai voi UEFA Champions League 2012 tại Allianz Arena. Chi tiết cơ bắp và biểu cảm giơ hai tay ăn mừng chiến thắng lịch sử.",
    rating: 5.0,
    isFeatured: true,
    createdAt: "2026-01-05",
  },
  {
    id: "fig-04",
    name: "Mô hình Frank Lampard - Kỷ Lục 211 Bàn Thắng (18cm)",
    playerName: "Frank Lampard",
    playerNumber: 8,
    position: "Tiền vệ trung tâm",
    role: "MF",
    category: "legends",
    price: 950000,
    stock: 10,
    imageUrl: "/images/figures/lampard.png",
    description: "Mô hình tiền vệ ghi nhiều bàn thắng nhất lịch sử Chelsea FC với cử chỉ chỉ tay lên trời quen thuộc. Tặng kèm huy hiệu lưu niệm 'Super Frankie Lampard'.",
    rating: 4.8,
    isFeatured: false,
    createdAt: "2026-01-08",
  },
  {
    id: "fig-05",
    name: "Mô hình Enzo Fernández - World Cup Champion Midfield Maestro (16cm)",
    playerName: "Enzo Fernández",
    playerNumber: 8,
    position: "Tiền vệ kiến thiết",
    role: "MF",
    category: "current-squad",
    price: 580000,
    stock: 20,
    imageUrl: "/images/figures/enzo.png",
    description: "Mô hình tiền vệ người Argentina với dáng chuyền bóng dài đỉnh cao. Đế nam châm hít chắc chắn, khuôn mặt điêu khắc tinh xảo từng sợi tóc.",
    rating: 4.7,
    isFeatured: false,
    createdAt: "2026-01-20",
  },
  {
    id: "fig-06",
    name: "Mô hình Moises Caicedo - 'The Midfield Beast' (16cm)",
    playerName: "Moises Caicedo",
    playerNumber: 25,
    position: "Tiền vệ phòng ngự",
    role: "MF",
    category: "current-squad",
    price: 550000,
    stock: 12,
    imageUrl: "/images/figures/caicedo.png",
    description: "Mô hình chiến binh tuyến giữa Moises Caicedo tư thế xoạc bóng dũng mãnh. Độ hoàn thiện cực cao, chống trầy xước.",
    rating: 4.6,
    isFeatured: false,
    createdAt: "2026-01-22",
  },
  {
    id: "fig-07",
    name: "Mô hình Thủ Môn Petr Cech - Headguard Legend (18cm)",
    playerName: "Petr Cech",
    playerNumber: 1,
    position: "Thủ môn huyền thoại",
    role: "GK",
    category: "legends",
    price: 790000,
    stock: 7,
    imageUrl: "/images/figures/cech.png",
    description: "Huyền thoại giữ sạch lưới nhiều nhất giải Ngoại Hạng Anh với chiếc mũ bảo hiểm đặc trưng và đôi găng tay bắt dính bóng thần thánh.",
    rating: 4.9,
    isFeatured: false,
    createdAt: "2026-01-12",
  },
  {
    id: "fig-08",
    name: "Mô hình John Terry - 'Captain, Leader, Legend' (18cm)",
    playerName: "John Terry",
    playerNumber: 26,
    position: "Trung vệ / Đội trưởng",
    role: "DF",
    category: "legends",
    price: 890000,
    stock: 9,
    imageUrl: "/images/figures/terry.png",
    description: "Người đội trưởng mẫu mực với băng thủ quân trên tay, tư thế chỉ huy hàng thủ kiên cường của Stamford Bridge.",
    rating: 4.9,
    isFeatured: false,
    createdAt: "2026-01-18",
  },
];

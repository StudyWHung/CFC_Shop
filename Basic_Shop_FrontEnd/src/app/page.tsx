"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Trophy, Flame, Shield, ArrowDown } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";

/**
 * =============================================================================
 * TRANG CHỦ: CỬA HÀNG MÔ HÌNH FIGURE CHELSEA FC (APP/PAGE.TSX)
 * 
 * 1. MỤC ĐÍCH:
 *    - Là trang mặt tiền của cửa hàng (Storefront).
 *    - Hiển thị Hero Banner giới thiệu bộ sưu tập Figure độc quyền.
 *    - Cung cấp thanh tìm kiếm, bộ lọc theo danh mục và sắp xếp theo giá.
 *    - Hiển thị danh sách sản phẩm dạng Grid sắc nét, tương thích mọi thiết bị.
 * 
 * 2. CÁC KHÁI NIỆM REACT HOOKS ĐƯỢC ỨNG DỤNG:
 *    - `useProducts()`: Lấy danh sách sản phẩm từ `ProductContext`.
 *    - `useState`: Quản lý 3 trạng thái của bộ lọc:
 *      + `searchTerm`: Từ khóa khách gõ vào ô tìm kiếm.
 *      + `selectedCategory`: Danh mục khách đang bấm chọn ("all", "current-squad", "legends"...).
 *      + `sortBy`: Thứ tự sắp xếp ("featured", "price-asc", "price-desc", "rating").
 *    - `useMemo`: Tối ưu hóa tính toán lọc và sắp xếp. Khi người dùng gõ phím,
 *      chỉ tính toán lọc lại mảng mà không làm render lại các phần không liên quan.
 * =============================================================================
 */
export default function HomePage() {
  // Lấy dữ liệu sản phẩm từ Context toàn cục
  const { products, isLoading } = useProducts();

  // [HOOK 1: useState] - Quản lý từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // [HOOK 1: useState] - Quản lý danh mục đang được lọc (Mặc định là "all" - Tất cả)
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // [HOOK 1: useState] - Quản lý cách thức sắp xếp (Mặc định là "featured" - Nổi bật)
  const [sortBy, setSortBy] = useState<string>("featured");

  // [HOOK 2: useMemo] - Bộ lọc và sắp xếp sản phẩm thông minh
  // Logic:
  // 1. Lọc theo danh mục: Nếu khác "all" thì so sánh `product.category === selectedCategory`.
  // 2. Lọc theo từ khóa: Tìm kiếm không phân biệt hoa thường trong Tên mô hình hoặc Tên cầu thủ.
  // 3. Sắp xếp theo giá tăng/giảm hoặc điểm đánh giá sao.
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Lọc theo Danh mục
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Lọc theo Từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.playerName.toLowerCase().includes(lowerSearch) ||
          p.position.toLowerCase().includes(lowerSearch)
      );
    }

    // 3. Sắp xếp kết quả
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price); // Giá tăng dần
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price); // Giá giảm dần
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating); // Đánh giá cao nhất
    } else if (sortBy === "featured") {
      // Ưu tiên các sản phẩm có `isFeatured === true` lên trước
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* =========================================================================
          HERO BANNER: GIỚI THIỆU BỘ SƯU TẬP MÔ HÌNH STAMFORD BRIDGE
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#034694] to-[#001433] text-white py-16 sm:py-20 border-b border-blue-900/60 shadow-xl">
        
        {/* Họa tiết nền trang trí ánh sáng xanh & vàng */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* CỘT TRÁI: TIÊU ĐỀ & KÊU GỌI HÀNH ĐỘNG */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bộ Sưu Tập Figure Độc Quyền 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                TÔN VINH CÁC <span className="text-amber-400">HUYỀN THOẠI</span> & NGÔI SAO <span className="text-blue-300">CHELSEA FC</span>
              </h1>

              <p className="text-sm sm:text-base text-blue-100/80 max-w-2xl leading-relaxed">
                Mô hình đồ chơi sưu tầm chất liệu PVC siêu chi tiết: từ tư thế ăn mừng run rẩy 
                <span className="text-amber-300 font-bold"> "Cold Palmer"</span>, ảo thuật gia 
                <span className="text-amber-300 font-bold"> Eden Hazard</span>, đến thời khắc nâng cúp Champions League của 
                <span className="text-amber-300 font-bold"> Didier Drogba</span>.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#product-catalog"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
                >
                  <span>Khám Phá Mô Hình</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </a>

                <div className="flex items-center gap-4 text-xs font-semibold text-blue-200">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Chính hãng 100%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Chi tiết sắc nét</span>
                  </div>
                </div>
              </div>

            </div>

            {/* CỘT PHẢI: ẢNH MINH HỌA NỔI BẬT */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-80 aspect-square rounded-3xl p-3 bg-gradient-to-b from-white/20 to-white/5 border border-white/20 shadow-2xl backdrop-blur-md">
                <img
                  src="/images/figures/palmer.png"
                  alt="Cole Palmer Figure"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -left-4 bg-[#0a192f] border border-amber-400/50 text-white p-3 rounded-xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-black text-base">
                    #20
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-amber-400">Cole Palmer Figure</p>
                    <p className="text-[11px] text-slate-300">Bán chạy nhất tuần</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          DANH MỤC & LƯỚI SẢN PHẨM (CATALOG SECTION)
          ========================================================================= */}
      <div id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề phần danh mục */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-7 bg-[#034694] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              BỘ SƯU TẬP FIGURE CẦU THỦ
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Ưu Đãi Đặc Biệt</span>
          </div>
        </div>

        {/* Thanh tìm kiếm, Bộ lọc danh mục và Sắp xếp */}
        <ProductFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={filteredAndSortedProducts.length}
        />

        {/* HIỂN THỊ DANH SÁCH HOẶC TRẠNG THÁI LOADING / EMPTY */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-[#034694] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-semibold text-sm">Đang tải danh sách mô hình từ LocalStorage...</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base font-bold text-slate-700 mb-1">
              Không tìm thấy mô hình nào phù hợp với bộ lọc!
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Tất cả mô hình" phía trên.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 bg-[#034694] text-white rounded-xl text-xs font-bold hover:bg-[#023470] transition cursor-pointer"
            >
              Xem toàn bộ mô hình
            </button>
          </div>
        ) : (
          /* LƯỚI SẢN PHẨM RESPONSIVE (Grid 4 cột trên Desktop, 2 cột trên Tablet, 1 cột trên Mobile) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

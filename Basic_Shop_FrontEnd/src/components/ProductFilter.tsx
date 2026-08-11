"use client";

import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/data/initialProducts";

/**
 * =============================================================================
 * COMPONENT: PRODUCT FILTER (THANH TÌM KIẾM & BỘ LỌC DANH MỤC)
 * 
 * 1. MỤC ĐÍCH:
 *    - Cho phép khách hàng tìm kiếm theo tên mô hình hoặc tên cầu thủ.
 *    - Bấm chọn danh mục (Pill buttons): Tất cả, Đội hình hiện tại, Huyền thoại...
 *    - Sắp xếp theo giá (Tăng dần / Giảm dần) hoặc Mới nhất.
 * 
 * 2. CÁCH KẾT NỐI & TRUYỀN NHẬN DỮ LIỆU (Props):
 *    - Nhận `searchTerm`, `selectedCategory`, `sortBy` và các hàm setter từ `app/page.tsx`.
 *    - Khi người dùng gõ vào ô tìm kiếm hoặc bấm đổi danh mục -> Gọi các hàm setter tương ứng.
 *    - `app/page.tsx` sẽ nhận được state mới và dùng `useMemo` để tính toán lại danh sách hiển thị.
 * =============================================================================
 */

interface ProductFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  totalResults: number;
}

export default function ProductFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  totalResults,
}: ProductFilterProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4 mb-8">
      
      {/* DÒNG 1: Ô TÌM KIẾM + DROPDOWN SẮP XẾP */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Ô tìm kiếm có icon kính lúp */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên mô hình, tên cầu thủ (Cole Palmer, Hazard, Drogba...)"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#034694] focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {/* Nút xóa nhanh từ khóa tìm kiếm */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Sắp xếp */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sắp xếp:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-[#034694] cursor-pointer"
          >
            <option value="featured">Nổi bật nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>

      </div>

      {/* DÒNG 2: NÚT CHỌN DANH MỤC (PILL BUTTONS) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#034694] text-white shadow-md shadow-blue-900/30 scale-105"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Số lượng kết quả hiển thị */}
        <div className="text-xs text-slate-500 font-medium">
          Tìm thấy <span className="font-bold text-[#034694]">{totalResults}</span> mô hình
        </div>
      </div>

    </div>
  );
}

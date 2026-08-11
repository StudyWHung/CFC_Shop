"use client";

import React from "react";
import { Search, SlidersHorizontal, X, Layers, Shield } from "lucide-react";
import { CATEGORIES, PLAYER_ROLES } from "@/data/initialProducts";
import { PlayerRole } from "@/types";

/**
 * =============================================================================
 * COMPONENT: PRODUCT FILTER (THANH TÌM KIẾM & 2 TẦNG BỘ LỌC CHUYÊN SÂU)
 * 
 * 1. MỤC ĐÍCH:
 *    - Tìm kiếm theo tên mô hình, tên cầu thủ.
 *    - Lọc Tầng 1: Bộ sưu tập (`category`: Tất cả / Đội hình hiện tại / Huyền thoại).
 *    - Lọc Tầng 2: Vị trí thi đấu (`role`: Tất cả / FW / MF / DF / GK).
 *    - Sắp xếp: Giá, Nổi bật, Đánh giá sao.
 * =============================================================================
 */

interface ProductFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  selectedRole: PlayerRole | "all";
  setSelectedRole: (role: PlayerRole | "all") => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  totalResults: number;
}

export default function ProductFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedRole,
  setSelectedRole,
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

      {/* DÒNG 2: BỘ LỌC TẦNG 1 (BỘ SƯU TẬP / CATEGORY) */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#034694]" />
              <span>Bộ Sưu Tập:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
          </div>

          {/* Đếm số lượng */}
          <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
            Tìm thấy <span className="font-bold text-[#034694]">{totalResults}</span> mô hình
          </div>
        </div>

        {/* DÒNG 3: BỘ LỌC TẦNG 2 (VỊ TRÍ THI ĐẤU / ROLE) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-50 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Vị Trí Thi Đấu:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {PLAYER_ROLES.map((item) => {
              const isActive = selectedRole === item.role;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedRole(item.role)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

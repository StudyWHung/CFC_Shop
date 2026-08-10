"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { Category } from "@/types";

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

interface ProductFilterProps {
  categories: Category[];
  selectedCategoryId?: number;
  onSelectCategory: (categoryId?: number) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  totalProducts: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  totalProducts,
}) => {
  // Dropdown states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortLabels: Record<SortOption, string> = {
    newest: "Mới nhất",
    "price-asc": "Giá: Thấp đến Cao",
    "price-desc": "Giá: Cao đến Thấp",
    "name-asc": "Tên: A đến Z",
  };

  const currentCategoryName = selectedCategoryId
    ? categories.find((c) => c.categoryId === selectedCategoryId)?.categoryName || "Danh mục"
    : "Tất cả danh mục";

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-sm mb-8 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Total Products Counter & Title */}
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span>Danh Sách Sản Phẩm</span>
            <span className="text-xs font-bold bg-[#034694] text-[#dba111] px-2.5 py-0.5 rounded-full">
              {totalProducts} món
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Lọc và sắp xếp theo nhu cầu của bạn
          </p>
        </div>

        {/* 2 Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* DROPDOWN 1: Lọc Danh Mục */}
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#034694]/20 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#034694]" />
              <span className="truncate max-w-[150px]">{currentCategoryName}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isCategoryDropdownOpen ? "rotate-180 text-[#034694]" : ""
                }`}
              />
            </button>

            {/* Menu Danh Mục Xổ Xuống */}
            {isCategoryDropdownOpen && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    onSelectCategory(undefined);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-blue-50 hover:text-[#034694] flex items-center justify-between"
                >
                  <span>Tất cả danh mục</span>
                  {!selectedCategoryId && <Check className="w-4 h-4 text-[#034694]" />}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.categoryId}
                    onClick={() => {
                      onSelectCategory(cat.categoryId);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-blue-50 hover:text-[#034694] flex items-center justify-between"
                  >
                    <span>{cat.categoryName}</span>
                    {selectedCategoryId === cat.categoryId && (
                      <Check className="w-4 h-4 text-[#034694]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DROPDOWN 2: Sắp Xếp (Sort) */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#034694]/20 transition-all"
            >
              <ArrowUpDown className="w-4 h-4 text-[#034694]" />
              <span>{sortLabels[selectedSort]}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isSortDropdownOpen ? "rotate-180 text-[#034694]" : ""
                }`}
              />
            </button>

            {/* Menu Sắp Xếp Xổ Xuống */}
            {isSortDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                {(Object.keys(sortLabels) as SortOption[]).map((sortKey) => (
                  <button
                    key={sortKey}
                    onClick={() => {
                      onSelectSort(sortKey);
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-blue-50 hover:text-[#034694] flex items-center justify-between"
                  >
                    <span>{sortLabels[sortKey]}</span>
                    {selectedSort === sortKey && <Check className="w-4 h-4 text-[#034694]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Category Pills (Thẻ lọc nhanh dạng hàng ngang) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
        <button
          onClick={() => onSelectCategory(undefined)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            !selectedCategoryId
              ? "bg-[#034694] text-white shadow-md shadow-blue-900/20"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>

        {categories.map((cat) => (
          <button
            key={cat.categoryId}
            onClick={() => onSelectCategory(cat.categoryId)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryId === cat.categoryId
                ? "bg-[#034694] text-white shadow-md shadow-blue-900/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

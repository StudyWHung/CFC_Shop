"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter, SortOption } from "@/components/ProductFilter";
import { Footer } from "@/components/Footer";
import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/types";
import { Loader2, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Tải danh mục từ Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Không thể tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Tải sản phẩm từ Backend
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts({
        categoryId: selectedCategoryId,
        search: searchQuery.trim() !== "" ? searchQuery.trim() : undefined,
      });
      setProducts(data);
    } catch (err: any) {
      console.error("Lỗi khi tải sản phẩm từ Backend:", err);
      setError("Không thể kết nối với Backend API. Vui lòng đảm bảo Backend đang chạy tại http://localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategoryId, searchQuery]);

  // Tự động làm mới danh sách sản phẩm khi có đơn hàng đặt thành công
  useEffect(() => {
    const handleOrderCompleted = () => {
      loadProducts();
    };
    window.addEventListener("cfc_order_completed", handleOrderCompleted);
    return () => {
      window.removeEventListener("cfc_order_completed", handleOrderCompleted);
    };
  }, [selectedCategoryId, searchQuery]);

  // 3. Sắp xếp sản phẩm trên Client bằng useMemo
  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.productName.localeCompare(b.productName));
      case "newest":
      default:
        return list.sort((a, b) => b.productId - a.productId);
    }
  }, [products, sortOption]);

  const scrollToProducts = () => {
    const section = document.getElementById("products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Navbar with 2 Dropdowns & Search */}
      <Navbar
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Hero Banner */}
      <HeroBanner onExploreClick={scrollToProducts} />

      {/* Main Content Area */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* Product Filter Bar with 2 Dropdowns */}
        <ProductFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          selectedSort={sortOption}
          onSelectSort={setSortOption}
          totalProducts={sortedProducts.length}
        />

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-800 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">Lỗi Kết Nối Backend API</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={loadProducts}
                className="mt-3 inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#034694] animate-spin" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Đang tải danh sách áo đấu Chelsea FC...
            </p>
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty Search/Filter Result */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#034694] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Không tìm thấy sản phẩm</h3>
              <p className="text-xs text-gray-500 mt-1">
                Không có áo đấu hoặc phụ kiện nào khớp với tiêu chí tìm kiếm của bạn.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategoryId(undefined);
                setSearchQuery("");
              }}
              className="bg-[#034694] hover:bg-[#023470] text-[#dba111] font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-md"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

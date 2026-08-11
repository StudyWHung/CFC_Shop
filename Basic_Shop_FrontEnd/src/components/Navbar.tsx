"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutDashboard, Store, Trophy } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * =============================================================================
 * COMPONENT: NAVBAR (THANH ĐIỀU HƯỚNG ĐẦU TRANG)
 * 
 * 1. MỤC ĐÍCH:
 *    - Cung cấp logo và các liên kết chuyển trang: Cửa Hàng (/), Quản Lý CRUD (/admin), Giỏ Hàng (/cart).
 *    - Hiển thị số lượng món hàng hiện tại trong giỏ (Badge đỏ).
 *    - Cho phép click vào icon giỏ hàng để bật nhanh ngăn kéo `CartDrawer`.
 * 
 * 2. CÁCH KẾT NỐI:
 *    - Sử dụng Hook `useCart()` từ `CartContext` để lấy giá trị `cartCount` và hàm `setIsDrawerOpen`.
 *    - Sử dụng Hook `usePathname()` từ `next/navigation` để highlight menu của trang đang mở.
 * =============================================================================
 */
export default function Navbar() {
  const pathname = usePathname();
  // Lấy tổng số lượng sản phẩm trong giỏ và hàm mở ngăn kéo từ CartContext
  const { cartCount, setIsDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#0a192f]/95 backdrop-blur-md border-b border-blue-900/40 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* LOGO & TÊN CỬA HÀNG */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center p-1.5 border border-amber-400/40 group-hover:border-amber-400 transition-colors">
              <img
                src="/images/chelsea-logo.svg"
                alt="Chelsea FC Logo"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                onError={(e) => {
                  // Dự phòng nếu không tải được ảnh logo cục bộ
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  CFC FIGURES
                </span>
                <span className="text-[10px] font-bold uppercase bg-amber-400 text-blue-950 px-1.5 py-0.5 rounded">
                  Store
                </span>
              </div>
              <p className="text-xs text-blue-200/70 hidden sm:block">
                Mô hình & Figure Cầu Thủ Chelsea FC Chính Hãng
              </p>
            </div>
          </Link>

          {/* MENU ĐIỀU HƯỚNG CHÍNH */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Nút: Cửa Hàng (Trang chủ) */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname === "/"
                  ? "bg-[#034694] text-white shadow-md shadow-blue-900/50"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Cửa Hàng</span>
            </Link>

            {/* Nút: Quản Lý CRUD (Trang Admin) */}
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname === "/admin"
                  ? "bg-[#034694] text-white shadow-md shadow-blue-900/50"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Quản Lý (CRUD)</span>
            </Link>

            {/* NÚT BẬT NGĂN KÉO GIỎ HÀNG (Cart Button) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer ml-2"
              title="Mở giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Giỏ Hàng</span>
              
              {/* Huy hiệu hiển thị số lượng món hàng */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a192f] animate-pulse">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
}

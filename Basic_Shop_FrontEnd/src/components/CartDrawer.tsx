"use client";

import React from "react";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * =============================================================================
 * COMPONENT: CART DRAWER (NGĂN KÉO GIỎ HÀNG XEM NHANH BÊN PHẢI)
 * 
 * 1. MỤC ĐÍCH:
 *    - Tạo trải nghiệm người dùng hiện đại: Khách thêm hàng là ngăn kéo tự trượt ra
 *      giúp xem ngay món vừa chọn mà không bị gián đoạn trải nghiệm xem sản phẩm.
 *    - Tăng / Giảm số lượng hoặc xóa nhanh sản phẩm ngay trên màn hình hiện tại.
 *    - Hiển thị tổng tiền và có nút chuyển nhanh đến trang thanh toán `/cart`.
 * 
 * 2. CÁCH KẾT NỐI:
 *    - Lấy toàn bộ state và hàm xử lý từ `useCart()` (`CartContext`).
 * =============================================================================
 */
export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    totalPrice,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Nếu Drawer đang đóng thì không render để tối ưu DOM
  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* LỚP NỀN MỜ (BACKDROP OVERLAY) - Click ra ngoài để đóng */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* HEADER CỦA DRAWER */}
          <div className="p-5 bg-[#0a192f] text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-extrabold text-base tracking-wide">
                GIỎ HÀNG CỦA BẠN ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DANH SÁCH CÁC MÓN HÀNG (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-600">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs max-w-xs text-slate-400">
                  Hãy chọn cho mình mô hình figure cầu thủ Chelsea yêu thích để thêm vào giỏ nhé!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition-all"
                >
                  {/* Ảnh thu nhỏ của mô hình */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-cover bg-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/figures/palmer.png";
                    }}
                  />

                  {/* Chi tiết tên, giá và bộ đếm số lượng */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        #{item.product.playerNumber} {item.product.playerName}
                      </p>
                      <p className="text-xs font-extrabold text-[#034694] mt-0.5">
                        {item.product.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    {/* Bộ tăng giảm số lượng & nút xóa */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Nút xóa món này khỏi giỏ */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER: TỔNG TIỀN VÀ NÚT ĐẶT HÀNG */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Tổng cộng:</span>
                <span className="text-xl font-black text-[#034694]">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#034694] hover:bg-[#023470] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-900/30 transition-all cursor-pointer"
                >
                  <span>Xem Chi Tiết & Đặt Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center cursor-pointer"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

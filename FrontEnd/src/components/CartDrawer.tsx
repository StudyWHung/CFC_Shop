"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    totalPrice,
    totalCount,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const defaultImage = "/images/products/home-kit.jpg";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 bg-[#001433] text-white flex items-center justify-between border-b border-[#034694]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#034694] text-[#dba111]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Giỏ Hàng Của Bạn</h2>
                <p className="text-xs text-blue-200">
                  Lưu trữ tự động trong <span className="font-mono text-[#dba111]">LocalStorage</span> ({totalCount} món)
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-blue-50 text-[#034694] flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Giỏ hàng đang trống</h3>
                  <p className="text-xs text-gray-500 max-w-xs mt-1">
                    Hãy dạo quanh cửa hàng và chọn những chiếc áo đấu Chelsea ưng ý nhất!
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="bg-[#034694] hover:bg-[#023470] text-[#dba111] font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md"
                >
                  Bắt Đầu Mua Sắm
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sản phẩm đã chọn
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa toàn bộ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200/80 items-center justify-between"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={item.imageUrl || defaultImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-[#034694] bg-blue-100/80 px-1.5 py-0.5 rounded">
                          {item.productCode}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate mt-1" title={item.productName}>
                          {item.productName}
                        </h4>
                        <p className="text-xs font-black text-gray-900 mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-900 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[11px] text-red-500 hover:text-red-700 font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Tạm tính ({totalCount} món):</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Phí giao hàng:</span>
                  <span className="text-emerald-600 font-semibold">MIỄN PHÍ</span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-xl text-[#034694] font-black">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Đơn hàng của bạn trị giá $${totalPrice.toFixed(2)} đang được xử lý! Cảm ơn bạn đã mua hàng tại CFC Shop.`);
                  clearCart();
                  closeCart();
                }}
                className="w-full bg-[#034694] hover:bg-[#023470] text-[#dba111] font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-blue-900/40 flex items-center justify-center gap-2 transition-all text-sm"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Thanh toán an toàn • Dữ liệu lưu trong LocalStorage</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

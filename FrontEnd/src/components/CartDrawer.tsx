"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Loader2, AlertCircle, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrderApi } from "@/lib/api";

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
    openSuccessModal,
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const defaultImage = "/images/products/home-kit.jpg";

  const handleCheckout = async () => {
    setOrderError(null);

    // 1. Nếu chưa đăng nhập -> Mở AuthModal yêu cầu đăng nhập/đăng ký
    if (!user) {
      closeCart();
      openAuthModal();
      return;
    }

    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    try {
      // 2. Gửi request đặt hàng lên Backend API
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const completedOrder = await createOrderApi(orderPayload);

      // 3. Xử lý sau khi đặt hàng thành công
      clearCart();
      closeCart();
      openSuccessModal(completedOrder);
    } catch (err: any) {
      console.error("Lỗi khi đặt hàng:", err);
      const msg =
        err.response?.data?.message ||
        "Không thể hoàn tất đơn hàng. Vui lòng kiểm tra lại kết nối mạng hoặc số lượng tồn kho!";
      setOrderError(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 bg-[#001433] text-white flex items-center justify-between border-b border-[#034694]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#034694] text-[#dba111]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Giỏ Hàng Của Bạn</h2>
                <p className="text-xs text-blue-200">
                  {user ? (
                    <span>Khách hàng: <strong className="text-white">{user.fullName}</strong> ({totalCount} món)</span>
                  ) : (
                    <span>Đang mua sắm ({totalCount} món)</span>
                  )}
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
            {orderError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{orderError}</div>
              </div>
            )}

            {!user && cartItems.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-amber-600" />
                  <span>Bạn chưa đăng nhập</span>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    openAuthModal();
                  }}
                  className="font-bold text-[#034694] hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            )}

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
                          unoptimized={item.imageUrl?.startsWith("http")}
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
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className="w-full bg-[#034694] hover:bg-[#023470] text-[#dba111] font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-blue-900/40 flex items-center justify-center gap-2 transition-all text-sm active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Xử Lý Đơn Hàng...</span>
                  </>
                ) : !user ? (
                  <>
                    <span>Đăng Nhập Để Đặt Hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Tiến Hành Đặt Hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Thanh toán an toàn • 100% Chính hãng Chelsea FC</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

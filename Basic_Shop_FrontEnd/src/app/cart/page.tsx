"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Truck,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";

/**
 * =============================================================================
 * TRANG GIỎ HÀNG & THANH TOÁN (APP/CART/PAGE.TSX)
 * 
 * 1. MỤC ĐÍCH:
 *    - Xem toàn bộ danh sách mô hình figure đã chọn mua.
 *    - Tùy chỉnh số lượng mua cho từng mô hình hoặc xóa món.
 *    - Điền thông tin giao hàng và chọn phương thức thanh toán giả lập.
 *    - Khi bấm "Đặt Hàng Ngay" -> Lưu đơn hàng vào OrderContext và hiển thị thông báo thành công.
 * 
 * 2. HOOKS SỬ DỤNG:
 *    - `useCart()`: Lấy `cartItems`, `totalPrice`, `updateQuantity`, `removeFromCart`, `clearCart`.
 *    - `useProducts()`: Lấy `deductStock` để tự động trừ số lượng tồn kho.
 *    - `useOrders()`: Lấy `addOrder` để ghi nhận giao dịch vào hệ thống phân tích.
 *    - `useState`: Quản lý thông tin form giao hàng (`customerInfo`) và modal thành công (`orderSuccessData`).
 * =============================================================================
 */
export default function CartPage() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { deductStock } = useProducts();
  const { addOrder } = useOrders();

  // [HOOK: useState] - Quản lý form thông tin khách hàng đặt hàng
  const [customerInfo, setCustomerInfo] = useState<{
    name: string;
    phone: string;
    address: string;
    paymentMethod: "cod" | "qr" | "card";
    note: string;
  }>({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
    note: "",
  });

  // [HOOK: useState] - Quản lý modal đặt hàng thành công
  const [orderSuccessData, setOrderSuccessData] = useState<{
    orderId: string;
    totalAmount: number;
  } | null>(null);

  // Phí vận chuyển giả lập (Miễn phí nếu đơn hàng > 1.000.000 đ)
  const shippingFee = totalPrice > 1000000 || totalPrice === 0 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  // Xử lý khi bấm nút Xác nhận Đặt Hàng
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    // Trừ số lượng tồn kho của các sản phẩm vừa mua
    deductStock(
      cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    );

    // Thêm đơn hàng vào OrderContext để biểu đồ Admin cập nhật tự động
    const createdOrderId = addOrder({
      customerName: customerInfo.name,
      phoneNumber: customerInfo.phone,
      address: customerInfo.address,
      items: [...cartItems],
      totalAmount: finalTotal,
      paymentMethod: customerInfo.paymentMethod,
      note: customerInfo.note,
      status: "completed",
    });

    // Lưu thông tin để hiển thị popup chúc mừng
    setOrderSuccessData({
      orderId: createdOrderId,
      totalAmount: finalTotal,
    });

    // Làm rỗng giỏ hàng sau khi đặt thành công
    clearCart();
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* TIÊU ĐỀ TRANG VÀ NÚT QUAY LẠI CỬA HÀNG */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#034694] mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tiếp tục chọn mô hình</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-[#034694]" />
            <span>Giỏ Hàng & Thanh Toán</span>
          </h1>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa sạch giỏ hàng</span>
          </button>
        )}
      </div>

      {/* NẾU GIỎ HÀNG TRỐNG */}
      {cartItems.length === 0 && !orderSuccessData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#034694] mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Giỏ hàng của bạn đang trống!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hiện tại bạn chưa chọn mô hình nào. Hãy dạo quanh cửa hàng và chọn ngay mô hình cầu thủ Chelsea yêu thích nhé.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#034694] hover:bg-[#023470] text-white text-sm font-bold rounded-xl shadow-md transition"
          >
            <span>Dạo Xem Cửa Hàng Ngay</span>
          </Link>
        </div>
      ) : (
        /* GIAO DIỆN 2 CỘT: CỘT TRÁI (DANH SÁCH MÓN) - CỘT PHẢI (FORM ĐẶT HÀNG) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI (7 CỘT): DANH SÁCH CÁC SẢN PHẨM TRONG GIỎ */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-600 tracking-wider">
                Danh sách mô hình ({cartItems.length} loại)
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="p-4 sm:p-5 flex gap-4 items-center">
                    {/* Ảnh sản phẩm */}
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />

                    {/* Tên & Giá */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold uppercase bg-blue-100 text-[#034694] px-2 py-0.5 rounded">
                        #{item.product.playerNumber} {item.product.playerName}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-extrabold text-[#034694] mt-0.5">
                        {item.product.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    {/* Bộ tăng giảm số lượng */}
                    <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Thành tiền của món này */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-xs text-slate-400 block">Thành tiền</span>
                      <span className="text-sm font-bold text-slate-900">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {/* Nút xóa */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Miễn Phí Vận Chuyển */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {totalPrice > 1000000
                  ? "🎉 Chúc mừng! Đơn hàng của bạn đã đạt trên 1.000.000 đ và được MIỄN PHÍ VẬN CHUYỂN toàn quốc."
                  : `Mua thêm ${(1000000 - totalPrice).toLocaleString("vi-VN")} đ để được Miễn Phí Giao Hàng!`}
              </span>
            </div>
          </div>

          {/* CỘT PHẢI (5 CỘT): FORM THÔNG TIN NHẬN HÀNG & THANH TOÁN */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Thông Tin Giao Hàng & Thanh Toán
              </h3>

              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Họ và tên */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0987654321"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
                  />
                </div>

                {/* Địa chỉ giao hàng */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Hình thức thanh toán
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-slate-200">
                      <input
                        type="radio"
                        name="payment"
                        checked={customerInfo.paymentMethod === "cod"}
                        onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "cod" })}
                        className="text-[#034694] focus:ring-[#034694]"
                      />
                      <Truck className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-800">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-slate-200">
                      <input
                        type="radio"
                        name="payment"
                        checked={customerInfo.paymentMethod === "qr"}
                        onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "qr" })}
                        className="text-[#034694] focus:ring-[#034694]"
                      />
                      <QrCode className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-800">
                        Chuyển khoản VietQR Ngân Hàng
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-slate-200">
                      <input
                        type="radio"
                        name="payment"
                        checked={customerInfo.paymentMethod === "card"}
                        onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "card" })}
                        className="text-[#034694] focus:ring-[#034694]"
                      />
                      <CreditCard className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-800">
                        Thẻ ATM Nội Địa / Thẻ Quốc Tế
                      </span>
                    </label>
                  </div>
                </div>

                {/* TÓM TẮT CHI PHÍ */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính tiền hàng:</span>
                    <span className="font-semibold">{totalPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                      ) : (
                        `${shippingFee.toLocaleString("vi-VN")} đ`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Tổng thanh toán:</span>
                    <span className="text-[#034694]">{finalTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>

                {/* NÚT XÁC NHẬN ĐẶT HÀNG */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black rounded-xl text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition cursor-pointer"
                >
                  XÁC NHẬN ĐẶT MÔ HÌNH NGAY
                </button>
              </form>

            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL ĐẶT HÀNG THÀNH CÔNG (ORDER SUCCESS POPUP)
          ========================================================================= */}
      {orderSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                Đặt Hàng Thành Công
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Cảm ơn bạn đã ủng hộ The Blues!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Đơn hàng mô hình của bạn đã được ghi nhận vào hệ thống.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-[#034694]">{orderSuccessData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng tiền:</span>
                <span className="font-extrabold text-slate-900">
                  {orderSuccessData.totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-semibold text-slate-800">{customerInfo.name || "Khách hàng"}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccessData(null);
                window.location.href = "/";
              }}
              className="w-full py-3 bg-[#034694] hover:bg-[#023470] text-white font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

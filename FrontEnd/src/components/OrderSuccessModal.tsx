"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Copy, CheckCheck, ShoppingBag, Truck, Calendar, ShieldCheck, X, Sparkles, ArrowRight } from "lucide-react";
import { OrderResponse } from "@/types";

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: OrderResponse | null;
  onClose: () => void;
  onContinueShopping?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  onClose,
  onContinueShopping,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    if (order?.orderCode) {
      navigator.clipboard.writeText(order.orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = () => {
    onClose();
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  const defaultImage = "/images/products/home-kit.jpg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-900/20 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Banner: Chelsea Royal Blue & Gold Theme */}
        <div className="relative p-6 bg-gradient-to-br from-[#001433] via-[#034694] to-[#001433] text-white text-center border-b border-[#dba111]/30 overflow-hidden">
          {/* Background Decorative Rings */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#dba111]/10 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Luxury Success Icon with Gold Glow */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#dba111] to-[#f3cf65] p-0.5 shadow-lg shadow-[#dba111]/30 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#001433] rounded-[14px] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#dba111] stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[#dba111] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Pride of London</span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          <p className="text-xs text-blue-100 max-w-sm mx-auto mt-1">
            Cảm ơn True Blue <span className="font-bold text-white">{order.customerName}</span> đã đồng hành cùng Chelsea FC. Đơn hàng của bạn đang được xử lý chuyển phát.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Order Code Box with 1-Click Copy */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100">
            <div>
              <span className="text-[11px] text-gray-500 font-medium block">Mã Đơn Hàng</span>
              <span className="text-sm font-mono font-black text-[#034694]">
                {order.orderCode}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-white hover:bg-blue-100/60 text-[#034694] border border-blue-200"
              }`}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#034694] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px]">Ngày đặt</p>
                <p className="font-bold text-gray-800 truncate">
                  {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px]">Vận chuyển</p>
                <p className="font-bold text-emerald-600 truncate">Miễn phí toàn quốc</p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wider">
              <span>Sản phẩm ({order.items.length} món)</span>
              <span>Thành tiền</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div
                  key={item.orderDetailId}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src={item.imageUrl || defaultImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      unoptimized={item.imageUrl?.startsWith("http")}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate" title={item.productName}>
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-gray-500 font-mono">
                      x{item.quantity} • ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>

                  <span className="text-xs font-black text-gray-900">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Total Card */}
          <div className="p-4 bg-gradient-to-br from-gray-900 to-[#001433] rounded-2xl text-white space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>Tổng số lượng:</span>
              <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-400 font-bold">MIỄN PHÍ ($0.00)</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-200">Tổng thanh toán:</span>
              <span className="text-xl font-black text-[#dba111]">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAction}
            className="w-full bg-[#034694] hover:bg-[#023470] text-[#dba111] hover:text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
          >
            <span>Tiếp Tục Mua Sắm</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};

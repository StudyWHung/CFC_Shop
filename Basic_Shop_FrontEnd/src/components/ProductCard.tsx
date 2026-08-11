"use client";

import React, { useState } from "react";
import { ShoppingCart, Star, Check, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

/**
 * =============================================================================
 * COMPONENT: PRODUCT CARD (THẺ HIỂN THỊ MÔ HÌNH SẢN PHẨM)
 * 
 * 1. MỤC ĐÍCH:
 *    - Hiển thị đầy đủ thông tin trực quan của 1 mô hình cầu thủ:
 *      + Ảnh sắc nét, huy hiệu số áo, tên cầu thủ, vị trí thi đấu.
 *      + Giá tiền được định dạng kiểu VNĐ (ví dụ: 650.000 đ).
 *      + Đánh giá số sao và số lượng tồn kho còn lại.
 *      + Nút bấm "Thêm vào giỏ" với hiệu ứng chuyển đổi trạng thái (Added feedback).
 * 
 * 2. CÁCH KẾT NỐI VÀ TRUYỀN DỮ LIỆU:
 *    - Nhận dữ liệu `product` (Object) qua Props từ Component cha (`app/page.tsx`).
 *    - Khi người dùng bấm nút "Thêm vào giỏ", gọi hàm `addToCart(product)` từ `CartContext`.
 *    - State nội bộ `isAdded`: Dùng Hook `useState` tạo hiệu ứng đổi nút sang màu xanh lá trong 1.5s.
 * =============================================================================
 */

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Lấy hàm thêm vào giỏ từ CartContext
  const { addToCart } = useCart();
  
  // [HOOK: useState] - Quản lý trạng thái thông báo tức thì khi bấm thêm vào giỏ
  const [isAdded, setIsAdded] = useState(false);

  // Xử lý sự kiện khi bấm nút Mua / Thêm vào giỏ
  const handleAddToCart = () => {
    if (product.stock <= 0) return; // Nếu hết hàng thì không cho thêm

    addToCart(product, 1);
    
    // Hiển thị hiệu ứng đã thêm thành công
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
      
      {/* PHẦN TRÊN: ẢNH MÔ HÌNH VÀ CÁC HUY HIỆU (BADGES) */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            // Dự phòng nếu link ảnh gặp sự cố
            (e.target as HTMLImageElement).src = "/images/figures/palmer.png";
          }}
        />

        {/* Huy hiệu Sản phẩm nổi bật (Featured Badge) */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-blue-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>NỔI BẬT</span>
          </div>
        )}

        {/* Huy hiệu Số áo cầu thủ */}
        <div className="absolute top-3 right-3 bg-[#034694]/90 backdrop-blur-sm text-white font-black text-xs px-2.5 py-1 rounded-lg border border-white/20 shadow-md">
          #{product.playerNumber} {product.playerName}
        </div>

        {/* Huy hiệu Vị trí thi đấu */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded">
          {product.position}
        </div>
      </div>

      {/* PHẦN THÂN: TÊN, ĐÁNH GIÁ, MÔ TẢ */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Đánh giá sao */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>

          {/* Tên mô hình */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#034694] transition-colors mb-2">
            {product.name}
          </h3>

          {/* Mô tả ngắn */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* PHẦN DƯỚI: GIÁ TIỀN & NÚT THÊM VÀO GIỎ */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-medium block">
              Giá bán
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#034694]">
              {product.price.toLocaleString("vi-VN")} đ
            </span>
          </div>

          {/* Nút Thêm vào giỏ */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              product.stock <= 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-[#034694] hover:bg-[#023470] text-white shadow-blue-900/20 hover:shadow-blue-900/40"
            }`}
          >
            {product.stock <= 0 ? (
              <span>Hết hàng</span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã thêm!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

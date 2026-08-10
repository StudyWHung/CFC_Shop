"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Check, Tag } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Fallback image nếu link ảnh rỗng
  const defaultImage = "/images/products/home-kit.jpg";
  const imageSrc = product.imageUrl && product.imageUrl.trim() !== "" ? product.imageUrl : defaultImage;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-[#034694]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={product.productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* SKU Badge */}
        <div className="absolute top-3 left-3 bg-[#001433]/85 text-[#dba111] text-[11px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-sm border border-[#dba111]/30 flex items-center gap-1 shadow-sm">
          <Tag className="w-3 h-3" />
          <span>{product.productCode}</span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {product.stockQuantity > 0 ? (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Còn {product.stockQuantity} chiếc
            </span>
          ) : (
            <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Tạm hết hàng
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Name */}
          <p className="text-xs font-bold text-[#034694] uppercase tracking-wider mb-1">
            {product.categoryName || "Chelsea Official"}
          </p>

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#034694] transition-colors" title={product.productName}>
            {product.productName}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-1 font-normal">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-400 block leading-none">Giá bán</span>
            <span className="text-lg font-black text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : product.stockQuantity > 0
                ? "bg-[#034694] hover:bg-[#023470] text-[#dba111] hover:text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã Thêm!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm Vào Giỏ</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

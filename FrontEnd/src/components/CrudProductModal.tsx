"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Package, Tag, DollarSign, Image as ImageIcon, Layers, FileText, Loader2, ChevronDown, Sparkles } from "lucide-react";
import { Product, Category, CreateProductInput, UpdateProductInput } from "@/types";

interface CrudProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  editingProduct?: Product | null;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
}

// Danh sách ảnh mẫu Chelsea có sẵn trong thư mục public/images/products/
const PRESET_IMAGES = [
  { name: "Áo Sân Nhà", path: "/images/products/home-kit.jpg" },
  { name: "Áo Sân Khách", path: "/images/products/away-kit.jpg" },
  { name: "Áo Khoác Anthem", path: "/images/products/anthem-jacket.jpg" },
  { name: "Khăn Quàng", path: "/images/products/chelsea-scarf.jpg" },
  { name: "Cốc Sứ", path: "/images/products/crest-mug.jpg" },
];

export const CrudProductModal: React.FC<CrudProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  editingProduct,
  onSubmit,
}) => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [stockQuantity, setStockQuantity] = useState<number | string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Tự động chuẩn hóa đường dẫn ảnh (hỗ trợ cả link online, relative path, hoặc chỉ tên file)
  const normalizeImageUrl = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return "/images/products/home-kit.jpg";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
    if (trimmed.startsWith("images/products/")) {
      return `/${trimmed}`;
    }
    return `/images/products/${trimmed}`;
  };

  // Preview URL tính toán trực tiếp
  const computedPreviewUrl = imageUrl.trim() ? normalizeImageUrl(imageUrl) : "/images/products/home-kit.jpg";

  // Khi modal mở lên, nếu đang chỉnh sửa thì điền sẵn dữ liệu cũ
  useEffect(() => {
    if (editingProduct) {
      setProductCode(editingProduct.productCode || "");
      setProductName(editingProduct.productName || "");
      setDescription(editingProduct.description || "");
      setPrice(editingProduct.price);
      setStockQuantity(editingProduct.stockQuantity);
      setImageUrl(editingProduct.imageUrl || "");
      setCategoryId(editingProduct.categoryId || (categories[0]?.categoryId ?? 1));
    } else {
      // Đặt giá trị mặc định cho form tạo mới
      setProductCode("");
      setProductName("");
      setDescription("");
      setPrice("");
      setStockQuantity("");
      setImageUrl("/images/products/home-kit.jpg");
      setCategoryId(categories[0]?.categoryId ?? 1);
    }
    setErrorMsg(null);
    setImagePreviewError(false);
  }, [editingProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const numPrice = Number(price);
    const numStock = Number(stockQuantity);

    if (!productCode.trim()) {
      setErrorMsg("Mã sản phẩm (SKU) là bắt buộc.");
      return;
    }
    if (!productName.trim()) {
      setErrorMsg("Tên sản phẩm là bắt buộc.");
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg("Giá sản phẩm phải là số lớn hơn 0.");
      return;
    }
    if (isNaN(numStock) || numStock < 0) {
      setErrorMsg("Số lượng kho phải là số không âm.");
      return;
    }

    const finalImageUrl = normalizeImageUrl(imageUrl);

    setIsSubmitting(true);
    try {
      await onSubmit({
        productCode: productCode.trim().toUpperCase(),
        productName: productName.trim(),
        description: description.trim(),
        price: numPrice,
        stockQuantity: numStock,
        imageUrl: finalImageUrl,
        categoryId: Number(categoryId),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "Đã xảy ra lỗi khi lưu thông tin sản phẩm. Vui lòng kiểm tra lại quyền Admin hoặc mã trùng!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#001433] text-white flex items-center justify-between border-b border-[#034694]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#034694] text-[#dba111]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {editingProduct ? "Chỉnh Sửa Sản Phẩm (Update)" : "Thêm Sản Phẩm Mới (Create)"}
              </h3>
              <p className="text-xs text-blue-200">
                {editingProduct
                  ? `Cập nhật thông tin cho mã SKU: ${editingProduct.productCode}`
                  : "Nhập thông tin sản phẩm để lưu vào CSDL PostgreSQL"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Code (SKU) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mã Sản Phẩm (SKU) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="VD: KIT-CFC-003"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
                />
                <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* DROPDOWN: Chọn Danh Mục */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Danh Mục Sản Phẩm (Dropdown) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694] bg-white cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <Layers className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tên Sản Phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="VD: Chelsea FC 2024/25 Third Kit"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Giá Bán (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="89.99"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Số Lượng Tồn Kho <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
              />
            </div>
          </div>

          {/* Enhanced Image URL with Live Preview & Quick Presets */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700">
                Đường Dẫn Ảnh (Image URL / File Path)
              </label>
              <span className="text-[11px] text-gray-400 font-normal">
                Hỗ trợ link Online (https://...) hoặc file cục bộ (/images/...)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Image Preview Thumbnail */}
              <div className="relative w-14 h-14 rounded-xl bg-white border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                {!imagePreviewError ? (
                  <Image
                    src={computedPreviewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setImagePreviewError(true)}
                    unoptimized={computedPreviewUrl.startsWith("http")}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>

              {/* Input Field (type="text" for maximum flexibility) */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreviewError(false);
                    }}
                    placeholder="VD: /images/products/cfc-hat.jpg hoặc cfc-hat.jpg"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694] bg-white font-mono text-xs"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Quick Presets Badge Buttons */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-[#dba111]" />
                <span>Hoặc chọn nhanh ảnh mẫu có sẵn:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = imageUrl === preset.path;
                  return (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.path);
                        setImagePreviewError(false);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        isSelected
                          ? "bg-[#034694] text-white shadow-sm font-bold"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#034694]/50 hover:bg-blue-50/50"
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mô Tả Chi Tiết Sản Phẩm
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Thông tin về chất liệu, công nghệ thoáng khí..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
              />
              <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#034694] hover:bg-[#023470] text-[#dba111] font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Lưu...</span>
                </>
              ) : editingProduct ? (
                <span>Lưu Thay Đổi (Update)</span>
              ) : (
                <span>Tạo Mới Sản Phẩm (Create)</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

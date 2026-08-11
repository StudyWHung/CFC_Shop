"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Edit, Image as ImageIcon, Sparkles } from "lucide-react";
import { Product, PlayerRole } from "@/types";
import { CATEGORIES, PLAYER_ROLES } from "@/data/initialProducts";

/**
 * =============================================================================
 * COMPONENT: PRODUCT FORM MODAL (FORM THÊM MỚI / CHỈNH SỬA MÔ HÌNH)
 * =============================================================================
 */

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSave: (productData: Omit<Product, "id" | "createdAt">) => void;
}

const DEFAULT_FORM_DATA = {
  name: "",
  playerName: "",
  playerNumber: 10,
  position: "Tiền vệ tấn công",
  role: "MF" as PlayerRole,
  category: "current-squad",
  price: 500000,
  stock: 10,
  imageUrl: "/images/figures/palmer.png",
  description: "",
  rating: 5.0,
  isFeatured: false,
};

export default function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  onSave,
}: ProductFormModalProps) {
  // [HOOK 1: useState] - Quản lý dữ liệu form
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [error, setError] = useState("");

  // [HOOK 2: useEffect] - Lắng nghe khi `editingProduct` thay đổi
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        playerName: editingProduct.playerName,
        playerNumber: editingProduct.playerNumber,
        position: editingProduct.position,
        role: editingProduct.role || "MF",
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
        imageUrl: editingProduct.imageUrl,
        description: editingProduct.description,
        rating: editingProduct.rating,
        isFeatured: editingProduct.isFeatured || false,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    setError("");
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên mô hình!");
      return;
    }
    if (!formData.playerName.trim()) {
      setError("Vui lòng nhập tên cầu thủ!");
      return;
    }
    if (formData.price <= 0) {
      setError("Giá bán phải lớn hơn 0 đ!");
      return;
    }
    if (formData.stock < 0) {
      setError("Số lượng tồn kho không được âm!");
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#034694] to-[#023470] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {editingProduct ? (
              <Edit className="w-5 h-5 text-amber-400" />
            ) : (
              <Plus className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="font-extrabold text-base">
              {editingProduct ? "Chỉnh Sửa Mô Hình Cầu Thủ" : "Thêm Mô Hình Cầu Thủ Mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NỘI DUNG FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Tên mô hình */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tên mô hình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Mô hình Cole Palmer - Cold Shiver 15cm"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694] focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Tên cầu thủ, Số áo, Tuyến thi đấu (Role) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tên Cầu Thủ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                placeholder="VD: Cole Palmer"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Số Áo
              </label>
              <input
                type="number"
                value={formData.playerNumber}
                onChange={(e) => setFormData({ ...formData, playerNumber: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tuyến Thi Đấu (Role)
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as PlayerRole })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694] bg-white cursor-pointer"
              >
                <option value="FW">Tiền Đạo (FW)</option>
                <option value="MF">Tiền Vệ (MF)</option>
                <option value="DF">Hậu Vệ (DF)</option>
                <option value="GK">Thủ Môn (GK)</option>
              </select>
            </div>
          </div>

          {/* Vị trí chi tiết & Danh mục bộ sưu tập */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mô Tả Vị Trí Chi Tiết
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="VD: Tiền vệ tấn công / Cánh phải"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bộ Sưu Tập (Category)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694] bg-white cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giá bán & Tồn kho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Giá Bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="10000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-[#034694] focus:outline-none focus:border-[#034694]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Số Lượng Tồn Kho
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
              />
            </div>
          </div>

          {/* Đường dẫn ảnh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Đường dẫn ảnh mô hình (Local hoặc URL)
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="/images/figures/palmer.png"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
            />
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Chất liệu PVC cao cấp, kích thước chiều cao, các phụ kiện kèm theo..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
            />
          </div>

          {/* Ghim Nổi Bật */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-[#034694] rounded border-slate-300 focus:ring-[#034694] cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ghim làm mô hình nổi bật trên Trang Chủ</span>
            </label>
          </div>

          {/* Nút Thao Tác */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#034694] hover:bg-[#023470] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-900/30 transition cursor-pointer"
            >
              {editingProduct ? "Lưu Thay Đổi" : "Thêm Mô Hình"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

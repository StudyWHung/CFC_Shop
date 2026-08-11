"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Edit, Image as ImageIcon, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { CATEGORIES } from "@/data/initialProducts";

/**
 * =============================================================================
 * COMPONENT: PRODUCT FORM MODAL (FORM THÊM MỚI / CHỈNH SỬA MÔ HÌNH)
 * 
 * 1. MỤC ĐÍCH (CRUD: CREATE & UPDATE):
 *    - Cung cấp giao diện biểu mẫu (Form) để:
 *      + Thêm mới 1 mô hình cầu thủ (Create) khi `editingProduct === null`.
 *      + Chỉnh sửa thông tin mô hình đã có (Update) khi `editingProduct` là 1 object.
 * 
 * 2. CÁCH KẾT NỐI & TRUYỀN NHẬN DỮ LIỆU:
 *    - Nhận Props từ `app/admin/page.tsx`:
 *      + `isOpen`: Điều khiển bật/tắt Modal.
 *      + `editingProduct`: Dữ liệu sản phẩm cần sửa (hoặc null).
 *      + `onSave`: Hàm callback nhận dữ liệu sau khi người dùng bấm Lưu.
 *    - Hook `useState` quản lý dữ liệu trong từng ô input (`formData`).
 *    - Hook `useEffect` tự động điền dữ liệu cũ vào các ô input khi bấm nút Sửa.
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
  // [HOOK 1: useState] - Quản lý toàn bộ dữ liệu người dùng nhập trong Form
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [error, setError] = useState("");

  // [HOOK 2: useEffect] - Lắng nghe khi `editingProduct` thay đổi để nạp dữ liệu cũ
  useEffect(() => {
    if (editingProduct) {
      // Đang ở chế độ SỬA (Update): Điền thông tin cũ vào form
      setFormData({
        name: editingProduct.name,
        playerName: editingProduct.playerName,
        playerNumber: editingProduct.playerNumber,
        position: editingProduct.position,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
        imageUrl: editingProduct.imageUrl,
        description: editingProduct.description,
        rating: editingProduct.rating,
        isFeatured: editingProduct.isFeatured || false,
      });
    } else {
      // Đang ở chế độ THÊM MỚI (Create): Reset form về mặc định
      setFormData(DEFAULT_FORM_DATA);
    }
    setError("");
  }, [editingProduct, isOpen]);

  // Nếu modal không mở thì không render
  if (!isOpen) return null;

  // Xử lý khi người dùng submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ cơ bản
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

    // Gửi dữ liệu ra ngoài cho AdminPage / ProductContext xử lý
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* LỚP NỀN MỜ */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
          
          {/* HEADER MODAL */}
          <div className="bg-[#0a192f] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2.5">
              {editingProduct ? (
                <Edit className="w-5 h-5 text-amber-400" />
              ) : (
                <Plus className="w-5 h-5 text-amber-400" />
              )}
              <h3 className="font-extrabold text-base sm:text-lg">
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

            {/* Tên cầu thủ, Số áo, Vị trí */}
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
                  Vị Trí Thi Đấu
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="VD: Tiền vệ tấn công"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
                />
              </div>
            </div>

            {/* Danh mục, Giá bán, Tồn kho */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Danh Mục
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

            {/* Link ảnh mô hình */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Đường dẫn ảnh (URL Image)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg bg-slate-200"
                  />
                  <span className="text-xs text-slate-500">Xem trước ảnh mô hình</span>
                </div>
              )}
            </div>

            {/* Mô tả chi tiết */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Chất liệu PVC cao cấp, kích thước chiều cao, các phụ kiện kèm theo..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#034694]"
              />
            </div>

            {/* Tùy chọn Nổi bật (Featured) */}
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
                Ghim làm sản phẩm nổi bật trên Trang Chủ
              </label>
            </div>

            {/* NÚT THAO TÁC */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#034694] hover:bg-[#023470] text-white rounded-xl text-sm font-bold shadow-md shadow-blue-900/30 transition cursor-pointer"
              >
                {editingProduct ? "Lưu Thay Đổi" : "Thêm Mô Hình"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

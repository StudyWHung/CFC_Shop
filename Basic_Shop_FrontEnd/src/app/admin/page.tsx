"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  Package,
  RotateCcw,
  Sparkles,
  Search,
  ArrowLeft,
  Boxes,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Product } from "@/types";
import { useProducts } from "@/context/ProductContext";
import ProductFormModal from "@/components/ProductFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

/**
 * =============================================================================
 * TRANG QUẢN TRỊ CRUD SẢN PHẨM (APP/ADMIN/PAGE.TSX)
 * 
 * 1. MỤC ĐÍCH:
 *    - Cung cấp bảng điều khiển quản lý trọn gói 4 thao tác CRUD đối với mô hình figure:
 *      + C (Create - Thêm mới): Mở ProductFormModal để nhập dữ liệu mới.
 *      + R (Read - Xem danh sách): Bảng dữ liệu chi tiết kèm 4 thẻ thống kê kho.
 *      + U (Update - Chỉnh sửa): Điền dữ liệu cũ lên Modal và cập nhật.
 *      + D (Delete - Xóa): Cảnh báo xác nhận lần 2 trước khi xóa vĩnh viễn khỏi LocalStorage.
 *    - Có nút "Khôi phục dữ liệu gốc" để dễ dàng reset dữ liệu mẫu khi học tập/thực hành.
 * 
 * 2. CÁC HOOKS & KỸ THUẬT ÁP DỤNG:
 *    - `useProducts()`: Lấy `products`, `addProduct`, `updateProduct`, `deleteProduct`, `resetToDefault`.
 *    - `useState`: Quản lý trạng thái mở/đóng Modal Thêm/Sửa, Modal Xóa, và ô tìm kiếm admin.
 *    - `useMemo`: Tính toán 4 chỉ số thống kê (Tổng số mã, Tổng tồn kho, Giá trung bình, Số lượng nổi bật) và lọc bảng danh sách.
 * =============================================================================
 */
export default function AdminPage() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();

  // [HOOK 1: useState] - Tìm kiếm nhanh trong trang quản trị
  const [adminSearch, setAdminSearch] = useState("");

  // [HOOK 1: useState] - Quản lý Modal Thêm / Sửa
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // [HOOK 1: useState] - Quản lý Modal Xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // [HOOK 2: useMemo] - Tính toán các thẻ số liệu thống kê thời gian thực
  const stats = useMemo(() => {
    const totalCount = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const avgPrice = totalCount > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalCount) : 0;
    const featuredCount = products.filter((p) => p.isFeatured).length;

    return { totalCount, totalStock, avgPrice, featuredCount };
  }, [products]);

  // [HOOK 2: useMemo] - Lọc bảng sản phẩm theo từ khóa tìm kiếm của Admin
  const filteredAdminProducts = useMemo(() => {
    if (!adminSearch.trim()) return products;
    const query = adminSearch.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.playerName.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, adminSearch]);

  // Thao tác: Bấm nút "Thêm Mô Hình Mới" (Create)
  const handleOpenCreate = () => {
    setEditingProduct(null); // null nghĩa là chế độ Thêm mới
    setIsFormModalOpen(true);
  };

  // Thao tác: Bấm nút "Sửa" ở 1 dòng (Update)
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product); // truyền object sản phẩm vào form
    setIsFormModalOpen(true);
  };

  // Thao tác: Bấm nút "Xóa" ở 1 dòng (Delete)
  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Thao tác: Lưu Form (Thêm mới hoặc Cập nhật)
  const handleSaveProduct = (formData: Omit<Product, "id" | "createdAt">) => {
    if (editingProduct) {
      // Đang sửa sản phẩm cũ
      updateProduct(editingProduct.id, formData);
    } else {
      // Đang thêm sản phẩm mới
      addProduct(formData);
    }
  };

  // Thao tác: Xác nhận xóa sản phẩm
  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* HEADER QUẢN TRỊ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#034694] mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem giao diện khách hàng</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <LayoutDashboard className="w-8 h-8 text-[#034694]" />
            <span>Quản Trị CRUD Mô Hình Cầu Thủ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Toàn bộ thao tác Thêm, Sửa, Xóa được lưu trữ trực tiếp vào LocalStorage trình duyệt.
          </p>
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG CHÍNH */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Khôi phục lại 8 mô hình mẫu ban đầu"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Khôi Phục Mặc Định</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#034694] hover:bg-[#023470] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-900/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mô Hình Mới</span>
          </button>
        </div>
      </div>

      {/* 4 THẺ CHỈ SỐ THỐNG KÊ (STATISTICS CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#034694] flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Tổng số mẫu figure</span>
            <p className="text-xl font-black text-slate-900">{stats.totalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Tổng số lượng tồn</span>
            <p className="text-xl font-black text-slate-900">{stats.totalStock} chiếc</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Giá bán trung bình</span>
            <p className="text-xl font-black text-slate-900">{stats.avgPrice.toLocaleString("vi-VN")} đ</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Mô hình nổi bật</span>
            <p className="text-xl font-black text-slate-900">{stats.featuredCount} mẫu</p>
          </div>
        </div>

      </div>

      {/* BẢNG DỮ LIỆU SẢN PHẨM (READ, UPDATE, DELETE) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* THANH TÌM KIẾM TRONG BẢNG */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/60">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Tìm theo tên mô hình hoặc tên cầu thủ..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#034694]"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Hiển thị <span className="font-bold text-[#034694]">{filteredAdminProducts.length}</span> / {products.length} mô hình
          </span>
        </div>

        {/* BẢNG RESPONSIVE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Mô Hình & Cầu Thủ</th>
                <th className="py-3.5 px-4">Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4">Tồn Kho</th>
                <th className="py-3.5 px-4">Nổi Bật</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Đang nạp dữ liệu...
                  </td>
                </tr>
              ) : filteredAdminProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    Không tìm thấy mô hình nào phù hợp!
                  </td>
                </tr>
              ) : (
                filteredAdminProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Ảnh & Tên */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-[#034694]">#{product.playerNumber} {product.playerName}</span>
                            <span>•</span>
                            <span>{product.position}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Giá bán */}
                    <td className="py-3.5 px-4 font-black text-[#034694]">
                      {product.price.toLocaleString("vi-VN")} đ
                    </td>

                    {/* Tồn kho */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          product.stock < 10
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {product.stock} chiếc {product.stock < 10 && "(Sắp hết)"}
                      </span>
                    </td>

                    {/* Nổi bật */}
                    <td className="py-3.5 px-4">
                      {product.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Sparkles className="w-3 h-3" />
                          <span>Có</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Không</span>
                      )}
                    </td>

                    {/* NÚT THAO TÁC SỬA / XÓA */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút Sửa (Update) */}
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Chỉnh sửa mô hình này"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Nút Xóa (Delete) */}
                        <button
                          onClick={() => handleOpenDelete(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Xóa mô hình này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* =========================================================================
          MODALS: THÊM/SỬA VÀ XÁC NHẬN XÓA
          ========================================================================= */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        productName={deletingProduct ? deletingProduct.name : ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
}

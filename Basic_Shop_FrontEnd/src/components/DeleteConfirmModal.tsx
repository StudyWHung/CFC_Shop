"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * =============================================================================
 * COMPONENT: DELETE CONFIRM MODAL (HỘP THOẠI XÁC NHẬN XÓA MÔ HÌNH)
 * 
 * 1. MỤC ĐÍCH (CRUD: DELETE):
 *    - Ngăn chặn việc bấm nhầm xóa mất dữ liệu mô hình.
 *    - Hiển thị thông báo cảnh báo màu đỏ với tên mô hình cụ thể.
 * 
 * 2. CÁCH KẾT NỐI:
 *    - Nhận `isOpen`, `productName`, `onConfirm`, `onCancel` từ `app/admin/page.tsx`.
 *    - Khi người dùng bấm "Xác nhận xóa" -> Gọi `onConfirm()` để kích hoạt hàm `deleteProduct(id)`.
 * =============================================================================
 */

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  productName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* LỚP NỀN MỜ */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Xác Nhận Xóa Mô Hình?
          </h3>

          <p className="text-sm text-slate-600 mb-6">
            Bạn có chắc chắn muốn xóa mô hình{" "}
            <span className="font-bold text-slate-900">"{productName}"</span> khỏi danh sách không?
            Hành động này sẽ cập nhật ngay vào dữ liệu cục bộ.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa Vĩnh Viễn</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

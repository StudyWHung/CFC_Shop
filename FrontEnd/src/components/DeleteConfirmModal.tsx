"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Product } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "Không thể xóa sản phẩm. Vui lòng kiểm tra quyền Admin hoặc sản phẩm đã có trong đơn hàng!"
      );
    } finally {
      setIsDeleting(false);
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
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-red-50 text-red-900 flex items-center justify-between border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Xác Nhận Xóa Sản Phẩm</h3>
              <p className="text-xs text-red-600">Thao tác này không thể hoàn tác</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-200/50 text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <p className="text-sm text-gray-700">
            Bạn có chắc chắn muốn xóa sản phẩm sau khỏi hệ thống CSDL?
          </p>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[11px] font-mono font-bold text-[#034694] bg-blue-100 px-2 py-0.5 rounded">
              {product.productCode}
            </span>
            <h4 className="font-bold text-gray-900 text-sm mt-1">{product.productName}</h4>
            <p className="text-xs text-gray-500">${product.price.toFixed(2)} &bull; {product.categoryName}</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
            >
              Hủy Bỏ
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Xóa...</span>
                </>
              ) : (
                <span>Xác Nhận Xóa</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

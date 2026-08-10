"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert,
  RefreshCw, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Lock,
  LogIn
} from "lucide-react";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import { Product, Category, CreateProductInput, UpdateProductInput } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { CrudProductModal } from "@/components/CrudProductModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export default function AdminProductsPage() {
  const { user, isAdmin, openAuthModal } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  // Modal states
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Tải danh sách Categories và Products
  const loadData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [catsData, prodsData] = await Promise.all([
        getCategories(),
        getProducts({
          categoryId: selectedCategoryId,
          search: searchQuery.trim() !== "" ? searchQuery.trim() : undefined,
        }),
      ]);
      setCategories(catsData);
      setProducts(prodsData);
    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu CRUD:", err);
      showToast("error", "Không thể tải dữ liệu từ server. Vui lòng kiểm tra Backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [selectedCategoryId, searchQuery, isAdmin]);

  // 2. Thống kê nhanh (Cards Statistics)
  const stats = useMemo(() => {
    const totalCount = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    const avgPrice = totalCount > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalCount : 0;
    const activeCategories = new Set(products.map((p) => p.categoryId)).size;

    return { totalCount, totalStock, avgPrice, activeCategories };
  }, [products]);

  // 3. Xử lý Thêm mới (Create) hoặc Sửa (Update)
  const handleSaveProduct = async (data: CreateProductInput | UpdateProductInput) => {
    try {
      if (editingProduct) {
        // UPDATE (U)
        await updateProduct(editingProduct.productId, data as UpdateProductInput);
        await loadData();
        showToast("success", `Đã cập nhật thành công sản phẩm: ${data.productName}`);
      } else {
        // CREATE (C)
        const created = await createProduct(data as CreateProductInput);
        await loadData();
        showToast("success", `Đã thêm mới thành công sản phẩm: ${created.productName}`);
      }
      setIsCrudModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi thao tác API";
      showToast("error", `Không thể lưu: ${errMsg}`);
      throw err;
    }
  };

  // 4. Xử lý Xóa (Delete)
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.productId);
      setProducts((prev) => prev.filter((p) => p.productId !== deletingProduct.productId));
      showToast("success", `Đã xóa vĩnh viễn sản phẩm: ${deletingProduct.productName}`);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (err: any) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi khi xóa sản phẩm";
      showToast("error", `Không thể xóa: ${errMsg}`);
      throw err;
    }
  };

  // 5. ROUTE GUARD: NẾU KHÔNG PHẢI ADMIN THÌ CHẶN TRUY CẬP (403 ACCESS DENIED)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#001433] flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-400 animate-pulse">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#dba111] bg-[#dba111]/10 px-3 py-1 rounded-full border border-[#dba111]/20">
              403 FORBIDDEN
            </span>
            <h2 className="text-2xl font-black text-white">Quyền Truy Cập Bị Từ Chối</h2>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Trang Quản Trị CRUD chỉ dành riêng cho tài khoản có quyền **Admin**. Tài khoản hiện tại của bạn không có quyền xem hoặc chỉnh sửa dữ liệu cửa hàng.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#034694] hover:bg-[#023470] text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all border border-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Cửa Hàng</span>
            </Link>

            <button
              onClick={openAuthModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#dba111] hover:bg-[#b8850a] text-[#001433] font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border ${
              toastMessage.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-rose-600 text-white border-rose-500"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Admin Header Bar */}
      <header className="bg-[#001433] text-white border-b border-[#034694] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white bg-[#034694]/40 hover:bg-[#034694] px-3 py-1.5 rounded-lg border border-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Cửa Hàng</span>
            </Link>
            <div className="h-6 w-px bg-blue-900"></div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Quản Trị Sản Phẩm (CRUD)</span>
                <span className="bg-[#dba111] text-[#001433] text-[10px] font-black px-2 py-0.5 rounded">
                  ADMIN
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <span className="font-semibold text-white">{user.fullName}</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900">
                  {user.roleName || "Admin"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* 4 Cards Thống Kê Nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Tổng Sản Phẩm</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#034694] flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Tổng Tồn Kho</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {stats.totalStock} <span className="text-xs font-normal text-gray-500">chiếc</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Giá Trung Bình</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                ${stats.avgPrice.toFixed(2)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Danh Mục Hoạt Động</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.activeCategories}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Thanh Điều Khiển & Bộ Lọc (Controls & Filters) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-1 w-full md:w-auto items-center gap-3">
            {/* Search SKU or Name */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã SKU, tên áo đấu..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#034694] focus:ring-1 focus:ring-[#034694]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Dropdown Lọc Category */}
            <div className="relative">
              <select
                value={selectedCategoryId ?? ""}
                onChange={(e) =>
                  setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:outline-none focus:border-[#034694]"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              className="p-2 text-gray-500 hover:text-[#034694] hover:bg-blue-50 rounded-xl transition-colors border border-gray-200"
              title="Tải lại dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#034694]" : ""}`} />
            </button>
          </div>

          {/* Nút Thêm Mới Sản Phẩm (CREATE - C) */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsCrudModalOpen(true);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#034694] hover:bg-[#023470] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới (Create)</span>
          </button>
        </div>

        {/* BẢNG DỮ LIỆU SẢN PHẨM (READ - R) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ảnh</th>
                  <th className="py-3.5 px-4">Mã SKU</th>
                  <th className="py-3.5 px-4">Tên Sản Phẩm</th>
                  <th className="py-3.5 px-4">Danh Mục</th>
                  <th className="py-3.5 px-4">Giá Bán</th>
                  <th className="py-3.5 px-4">Tồn Kho</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#034694]" />
                        <span>Đang tải dữ liệu sản phẩm...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Không có sản phẩm nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.productId} className="hover:bg-blue-50/40 transition-colors">
                      {/* Cột Ảnh */}
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={product.imageUrl || "/images/products/home-kit.jpg"}
                            alt={product.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Cột Mã SKU */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#034694] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {product.productCode || `PROD-${product.productId}`}
                        </span>
                      </td>

                      {/* Cột Tên & Mô tả */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-bold text-gray-900 truncate">{product.productName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{product.description || "Chưa có mô tả"}</p>
                      </td>

                      {/* Cột Danh mục */}
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                          {product.categoryName || "Chưa phân loại"}
                        </span>
                      </td>

                      {/* Cột Giá */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      </td>

                      {/* Cột Tồn kho */}
                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          product.stockQuantity < 10 ? "text-amber-600" : "text-gray-900"
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </td>

                      {/* Cột Trạng thái */}
                      <td className="py-3 px-4">
                        {product.stockQuantity > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Còn hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Hết hàng
                          </span>
                        )}
                      </td>

                      {/* Cột Thao tác (UPDATE & DELETE - U, D) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Nút Sửa (UPDATE - U) */}
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsCrudModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Nút Xóa (DELETE - D) */}
                          <button
                            onClick={() => {
                              setDeletingProduct(product);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa sản phẩm"
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
      </main>

      {/* Modal Form Thêm/Sửa Sản Phẩm (CREATE & UPDATE) */}
      <CrudProductModal
        isOpen={isCrudModalOpen}
        onClose={() => {
          setIsCrudModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
      />

      {/* Modal Xác Nhận Xóa Sản Phẩm (DELETE) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        product={deletingProduct}
      />

    </div>
  );
}

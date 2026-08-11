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
  BarChart3,
  ShoppingBag,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  CreditCard,
  Truck,
  Eye,
  Filter,
} from "lucide-react";
import { Product, Order } from "@/types";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import ProductFormModal from "@/components/ProductFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

// Import 7 Biểu đồ chuyên nghiệp
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import CategoryStockChart from "@/components/charts/CategoryStockChart";
import PositionRoleChart from "@/components/charts/PositionRoleChart";
import TopSellingChart from "@/components/charts/TopSellingChart";
import StockAlertChart from "@/components/charts/StockAlertChart";
import PriceDistributionChart from "@/components/charts/PriceDistributionChart";
import PaymentMethodChart from "@/components/charts/PaymentMethodChart";


/**
 * =============================================================================
 * TRANG QUẢN TRỊ TOÀN DIỆN (APP/ADMIN/PAGE.TSX)
 * 
 * 1. TÍNH NĂNG CHÍNH (3 TABS):
 *    - TAB 1: 📊 Báo Cáo & Phân Tích (Analytics & Charts)
 *             + 4 Thẻ KPI: Doanh thu, Đơn hàng, Tồn kho, Giá TB.
 *             + 6 Biểu đồ Recharts sắc nét, trực quan chuẩn phong cách Chelsea FC.
 *    - TAB 2: 📦 Quản Lý Mô Hình (CRUD Products)
 *             + Bảng danh sách mô hình, tìm kiếm, Thêm/Sửa/Xóa.
 *    - TAB 3: 📑 Quản Lý Đơn Hàng (Order Management)
 *             + Danh sách đơn khách đặt, đổi trạng thái (Pending/Completed/Cancelled).
 * =============================================================================
 */
export default function AdminPage() {
  const { products, isLoading: isProductsLoading, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();
  const { orders, isLoading: isOrdersLoading, updateOrderStatus, resetOrdersToDefault } = useOrders();

  // [HOOK: useState] - Quản lý Tab đang hiển thị ("analytics" | "products" | "orders")
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders">("analytics");

  // [HOOK: useState] - Tìm kiếm trong bảng sản phẩm
  const [adminSearch, setAdminSearch] = useState("");

  // [HOOK: useState] - Tìm kiếm & lọc trong bảng đơn hàng
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

  // [HOOK: useState] - Quản lý Modal Thêm / Sửa sản phẩm
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // [HOOK: useState] - Quản lý Modal Xóa sản phẩm
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // [HOOK: useMemo] - Tính toán các chỉ số KPI tổng thể cho Dashboard
  const kpiStats = useMemo(() => {
    const totalCount = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const avgPrice = totalCount > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalCount) : 0;
    
    // Doanh thu từ các đơn hàng không bị hủy
    const validOrders = orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const completedOrdersCount = orders.filter((o) => o.status === "completed").length;
    const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

    return {
      totalCount,
      totalStock,
      avgPrice,
      totalRevenue,
      totalOrders: orders.length,
      completedOrdersCount,
      pendingOrdersCount,
    };
  }, [products, orders]);

  // [HOOK: useMemo] - Lọc danh sách sản phẩm theo từ khóa
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

  // [HOOK: useMemo] - Lọc danh sách đơn hàng theo từ khóa & trạng thái
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchQuery =
        !orderSearch.trim() ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.phoneNumber.includes(orderSearch);

      const matchStatus =
        orderStatusFilter === "all" || order.status === orderStatusFilter;

      return matchQuery && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Các thao tác CRUD sản phẩm
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = (formData: Omit<Product, "id" | "createdAt">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    }
  };

  // Reset toàn bộ dữ liệu mẫu (Sản phẩm & Đơn hàng)
  const handleResetAllData = () => {
    if (confirm("Khôi phục toàn bộ dữ liệu sản phẩm và đơn hàng mẫu ban đầu?")) {
      resetToDefault();
      resetOrdersToDefault();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* =======================================================================
          1. HEADER QUẢN TRỊ & THANH ĐIỀU HƯỚNG CHÍNH
          ======================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <span>Trung Tâm Quản Trị CFC Figure Shop</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bảng điều khiển kinh doanh, phân tích số liệu biểu đồ và quản lý kho mô hình The Blues.
          </p>
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG HEADER */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetAllData}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Khôi phục dữ liệu sản phẩm & đơn hàng mẫu ban đầu"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Khôi Phục Mặc Định</span>
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

      {/* =======================================================================
          2. THANH TAB ĐIỀU HƯỚNG (ANALYTICS / PRODUCTS / ORDERS)
          ======================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "analytics"
              ? "border-[#034694] text-[#034694] bg-blue-50/50 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Báo Cáo & Biểu Đồ Thống Kê</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "products"
              ? "border-[#034694] text-[#034694] bg-blue-50/50 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Quản Lý Mô Hình ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "border-[#034694] text-[#034694] bg-blue-50/50 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Quản Lý Đơn Hàng ({orders.length})</span>
          {kpiStats.pendingOrdersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">
              {kpiStats.pendingOrdersCount}
            </span>
          )}
        </button>
      </div>

      {/* =======================================================================
          3. NỘI DUNG TAB 1: 📊 BÁO CÁO & BIỂU ĐỒ THỐNG KÊ (ANALYTICS & CHARTS)
          ======================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          
          {/* 4 THẺ KPI TỔNG QUAN HỆ THỐNG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Tổng Doanh Thu */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:border-blue-300 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#034694] flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Tổng Doanh Thu</span>
                <p className="text-xl font-black text-[#034694]">
                  {kpiStats.totalRevenue.toLocaleString("vi-VN")} đ
                </p>
              </div>
            </div>

            {/* KPI 2: Tổng Số Đơn Hàng */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:border-amber-300 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Tổng Số Đơn Hàng</span>
                <p className="text-xl font-black text-slate-900">
                  {kpiStats.totalOrders} <span className="text-xs font-semibold text-slate-500">đơn ({kpiStats.completedOrdersCount} xong)</span>
                </p>
              </div>
            </div>

            {/* KPI 3: Tổng Số Lượng Tồn Kho */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Tổng Tồn Kho</span>
                <p className="text-xl font-black text-slate-900">{kpiStats.totalStock} chiếc</p>
              </div>
            </div>

            {/* KPI 4: Giá Bán Trung Bình */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:border-purple-300 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Giá Bán Trung Bình</span>
                <p className="text-xl font-black text-slate-900">{kpiStats.avgPrice.toLocaleString("vi-VN")} đ</p>
              </div>
            </div>

          </div>

          {/* LƯỚI 7 BIỂU ĐỒ RECHARTS (BỐ CỤC CHUYÊN NGHIỆP) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* HÀNG 1: BIỂU ĐỒ DOANH THU CÓ CALENDAR (7 CỘT) + BIỂU ĐỒ BỘ SƯU TẬP (5 CỘT) */}
            <div className="lg:col-span-12 xl:col-span-7">
              <RevenueTrendChart orders={orders} />
            </div>

            <div className="lg:col-span-12 xl:col-span-5">
              <CategoryStockChart products={products} orders={orders} />
            </div>

            {/* HÀNG 2: CƠ CẤU ĐỘI HÌNH FW/MF/DF/GK (6 CỘT) + TOP BÁN CHẠY (6 CỘT) */}
            <div className="lg:col-span-6">
              <PositionRoleChart products={products} orders={orders} />
            </div>

            <div className="lg:col-span-6">
              <TopSellingChart orders={orders} />
            </div>

            {/* HÀNG 3: CẢNH BÁO TỒN KHO (6 CỘT) + PHÂN KHÚC GIÁ (6 CỘT) */}
            <div className="lg:col-span-6">
              <StockAlertChart products={products} />
            </div>

            <div className="lg:col-span-6">
              <PriceDistributionChart products={products} />
            </div>

            {/* HÀNG 4: KÊNH THANH TOÁN (12 CỘT) */}
            <div className="lg:col-span-12">
              <PaymentMethodChart orders={orders} />
            </div>

          </div>

        </div>
      )}

      {/* =======================================================================
          4. NỘI DUNG TAB 2: 📦 BẢNG QUẢN LÝ MÔ HÌNH (CRUD PRODUCTS)
          ======================================================================= */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* THANH TÌM KIẾM SẢN PHẨM */}
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
                    <th className="py-3.5 px-4">Bộ Sưu Tập & Tuyến</th>
                    <th className="py-3.5 px-4">Giá Bán</th>
                    <th className="py-3.5 px-4">Tồn Kho</th>
                    <th className="py-3.5 px-4">Nổi Bật</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {isProductsLoading ? (
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

                        {/* Bộ sưu tập & Role Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                              {product.category === "legends" ? "Huyền Thoại" : "Hiện Tại"}
                            </span>

                            {product.role === "FW" && (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                FW (Tiền đạo)
                              </span>
                            )}
                            {product.role === "MF" && (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                MF (Tiền vệ)
                              </span>
                            )}
                            {product.role === "DF" && (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                DF (Hậu vệ)
                              </span>
                            )}
                            {product.role === "GK" && (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                GK (Thủ môn)
                              </span>
                            )}
                          </div>
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

                        {/* Nút Thao Tác Sửa / Xóa */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Chỉnh sửa mô hình này"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

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

        </div>
      )}

      {/* =======================================================================
          5. NỘI DUNG TAB 3: 📑 BẢNG QUẢN LÝ ĐƠN HÀNG (ORDER MANAGEMENT)
          ======================================================================= */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* THANH TÌM KIẾM & BỘ LỌC TRẠNG THÁI ĐƠN */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/60">
              
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#034694]"
                />
              </div>

              {/* Bộ lọc trạng thái */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start md:self-auto">
                <button
                  onClick={() => setOrderStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    orderStatusFilter === "all"
                      ? "bg-[#034694] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tất Cả ({orders.length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter("completed")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    orderStatusFilter === "completed"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Hoàn Thành
                </button>
                <button
                  onClick={() => setOrderStatusFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    orderStatusFilter === "pending"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Chờ Xử Lý
                </button>
                <button
                  onClick={() => setOrderStatusFilter("cancelled")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    orderStatusFilter === "cancelled"
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Đã Hủy
                </button>
              </div>

            </div>

            {/* BẢNG ĐƠN HÀNG */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-3 text-center w-12">STT</th>
                    <th className="py-3.5 px-4">Mã Đơn & Ngày</th>
                    <th className="py-3.5 px-4">Khách Hàng & Địa Chỉ</th>
                    <th className="py-3.5 px-4">Mô Hình Đã Đặt</th>
                    <th className="py-3.5 px-4">Thanh Toán</th>
                    <th className="py-3.5 px-4">Tổng Tiền</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Xử Lý Đơn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {isOrdersLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Đang nạp danh sách đơn hàng...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                        Không tìm thấy đơn hàng nào phù hợp!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                        
                        {/* Số Thứ Tự */}
                        <td className="py-3.5 px-3 text-center font-extrabold text-slate-400">
                          #{index + 1}
                        </td>

                        {/* Mã Đơn & Ngày */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-black text-[#034694]">{order.id}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{order.createdAt}</span>
                          </div>
                        </td>

                        {/* Khách hàng */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-xs text-slate-500 font-medium">{order.phoneNumber}</div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5" title={order.address}>
                            {order.address}
                          </div>
                        </td>


                        {/* Danh sách món */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className="font-bold text-[#034694]">{item.quantity}x</span>
                                <span className="text-slate-700 line-clamp-1 max-w-[160px]">
                                  {item.product.playerName || item.product.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Phương thức thanh toán */}
                        <td className="py-3.5 px-4">
                          {order.paymentMethod === "qr" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#034694] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <QrCode className="w-3 h-3" />
                              <span>VietQR</span>
                            </span>
                          )}
                          {order.paymentMethod === "card" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <CreditCard className="w-3 h-3" />
                              <span>Thẻ ATM</span>
                            </span>
                          )}
                          {(!order.paymentMethod || order.paymentMethod === "cod") && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Truck className="w-3 h-3" />
                              <span>COD</span>
                            </span>
                          )}
                        </td>

                        {/* Tổng tiền */}
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {order.totalAmount.toLocaleString("vi-VN")} đ
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3.5 px-4">
                          {order.status === "completed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Hoàn thành</span>
                            </span>
                          )}
                          {order.status === "pending" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Chờ duyệt</span>
                            </span>
                          )}
                          {order.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>Đã hủy</span>
                            </span>
                          )}
                        </td>

                        {/* Thao tác duyệt trạng thái */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status !== "completed" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "completed")}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                title="Đánh dấu đã hoàn thành"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {order.status !== "pending" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "pending")}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                                title="Chuyển về chờ xử lý"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            )}
                            {order.status !== "cancelled" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "cancelled")}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Hủy đơn hàng này"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* =======================================================================
          MODALS: THÊM / SỬA MÔ HÌNH VÀ XÁC NHẬN XÓA
          ======================================================================= */}
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

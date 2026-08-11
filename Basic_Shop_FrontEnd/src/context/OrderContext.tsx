"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Order } from "@/types";
import { getInitialOrders, INITIAL_ORDERS } from "@/data/initialOrders";

/**
 * =============================================================================
 * ORDER CONTEXT - QUẢN LÝ DỮ LIỆU ĐƠN HÀNG & PHÂN TÍCH DOANH THU
 * 
 * 1. MỤC ĐÍCH:
 *    - Lưu trữ tập trung lịch sử đơn hàng phát sinh từ khách hàng.
 *    - Cung cấp dữ liệu giao dịch cho các Biểu đồ Thống kê (Charts) trong trang Admin.
 *    - Tự động đồng bộ và lưu trữ vào LocalStorage trình duyệt.
 *    - Hỗ trợ đổi trạng thái đơn (Pending -> Completed -> Cancelled) và reset về dữ liệu mẫu.
 * =============================================================================
 */

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  addOrder: (orderData: Omit<Order, "id" | "createdAt" | "status"> & { status?: "pending" | "completed" | "cancelled" }) => string;
  updateOrderStatus: (orderId: string, newStatus: "pending" | "completed" | "cancelled") => void;
  resetOrdersToDefault: () => void;
}

const STORAGE_KEY = "cfc_figures_orders_v2";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // [useEffect] - Nạp đơn hàng từ LocalStorage khi khởi động ứng dụng
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) {
        const parsed: Order[] = JSON.parse(savedOrders);
        
        // Chuẩn hóa category cho từng item trong đơn (nếu có category cũ là goalkeepers)
        const updated = parsed.map((order) => ({
          ...order,
          items: order.items.map((item) => {
            let cat = item.product.category;
            if (!cat || cat === "goalkeepers") cat = "legends";
            return {
              ...item,
              product: {
                ...item.product,
                category: cat,
              },
            };
          }),
        }));

        // Kiểm tra xem dữ liệu đơn hàng có bị quá cũ (vd từ tháng 2) không
        const todayStr = new Date().toISOString().split("T")[0];
        const hasRecentOrders = updated.some((o) => {
          const diffDays = (new Date(todayStr).getTime() - new Date(o.createdAt).getTime()) / (1000 * 3600 * 24);
          return diffDays <= 7;
        });

        if (!hasRecentOrders) {
          // Tự động làm mới bằng bộ đơn hàng gần đây
          const fresh = getInitialOrders();
          setOrders(fresh);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        } else {
          setOrders(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } else {
        const initial = getInitialOrders();
        setOrders(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (error) {
      console.error("Lỗi khi đọc LocalStorage đơn hàng:", error);
      const initial = getInitialOrders();
      setOrders(initial);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // [useEffect] - Lưu đơn hàng vào LocalStorage mỗi khi có cập nhật
  useEffect(() => {
    if (!isLoading && orders.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isLoading]);

  // [useCallback] - Thêm đơn hàng mới khi khách thanh toán thành công
  const addOrder = useCallback(
    (orderData: Omit<Order, "id" | "createdAt" | "status"> & { status?: "pending" | "completed" | "cancelled" }): string => {
      const newOrderId = `CFC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const today = new Date().toISOString().split("T")[0];

      const newOrder: Order = {
        ...orderData,
        id: newOrderId,
        createdAt: today,
        status: orderData.status || "completed",
      };

      setOrders((prev) => [newOrder, ...prev]);
      return newOrderId;
    },
    []
  );

  // [useCallback] - Cập nhật trạng thái đơn hàng (Duyệt đơn / Hoàn thành / Hủy)
  const updateOrderStatus = useCallback((orderId: string, newStatus: "pending" | "completed" | "cancelled") => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  }, []);

  // [useCallback] - Khôi phục danh sách đơn hàng mẫu ban đầu
  const resetOrdersToDefault = useCallback(() => {
    const fresh = getInitialOrders();
    setOrders(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        addOrder,
        updateOrderStatus,
        resetOrdersToDefault,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

/**
 * Custom Hook: `useOrders`
 * Giúp các Component con lấy danh sách đơn hàng và thêm đơn mới nhanh chóng.
 */
export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders phải được sử dụng bên trong <OrderProvider>");
  }
  return context;
}

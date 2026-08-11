"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CreditCard, QrCode, Truck, Wallet } from "lucide-react";
import { Order } from "@/types";

interface PaymentMethodChartProps {
  orders: Order[];
}

const PAYMENT_INFO: Record<
  string,
  { name: string; color: string; icon: React.ReactNode }
> = {
  qr: {
    name: "VietQR Ngân Hàng",
    color: "#034694", // Chelsea Royal Blue
    icon: <QrCode className="w-4 h-4 text-[#034694]" />,
  },
  cod: {
    name: "Thanh toán COD",
    color: "#10B981", // Emerald Green
    icon: <Truck className="w-4 h-4 text-emerald-600" />,
  },
  card: {
    name: "Thẻ ATM / Quốc Tế",
    color: "#F59E0B", // Amber
    icon: <CreditCard className="w-4 h-4 text-amber-600" />,
  },
};

/**
 * =============================================================================
 * BIỂU ĐỒ TỶ LỆ PHƯƠNG THỨC THANH TOÁN (PAYMENT METHOD DONUT CHART)
 * 
 * - Thống kê thói quen thanh toán của khách hàng khi đặt mua mô hình.
 * - Hỗ trợ các kênh: Chuyển khoản VietQR, COD nhận hàng, và Thẻ ngân hàng.
 * =============================================================================
 */
export default function PaymentMethodChart({ orders }: PaymentMethodChartProps) {
  const chartData = useMemo(() => {
    const map = new Map<string, { count: number; totalAmount: number }>();

    orders.forEach((order) => {
      if (order.status === "cancelled") return;
      const method = order.paymentMethod || "cod";
      const current = map.get(method) || { count: 0, totalAmount: 0 };
      current.count += 1;
      current.totalAmount += order.totalAmount;
      map.set(method, current);
    });

    const totalValidOrders = orders.filter((o) => o.status !== "cancelled").length;

    return ["qr", "cod", "card"].map((key) => {
      const info = PAYMENT_INFO[key] || { name: key, color: "#64748B", icon: null };
      const current = map.get(key) || { count: 0, totalAmount: 0 };
      const percentage =
        totalValidOrders > 0 ? Math.round((current.count / totalValidOrders) * 100) : 0;

      return {
        key,
        name: info.name,
        color: info.color,
        icon: info.icon,
        count: current.count,
        totalAmount: current.totalAmount,
        percentage,
      };
    });
  }, [orders]);

  const totalOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== "cancelled").length;
  }, [orders]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
      {/* Header Biểu Đồ */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Kênh Phương Thức Thanh Toán
            </h3>
            <p className="text-xs text-slate-500">
              Tỷ lệ thanh toán không tiền mặt và COD
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          {totalOrdersCount} đơn hợp lệ
        </span>
      </div>

      {/* Vùng Donut Chart */}
      <div className="h-60 sm:h-64 w-full relative">
        {totalOrdersCount === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Chưa có giao dịch thanh toán
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.key}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1">
                          <div className="font-extrabold text-[#38BDF8]">{data.name}</div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Số đơn:</span>
                            <span className="font-bold text-white">{data.count} đơn ({data.percentage}%)</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Giá trị:</span>
                            <span className="font-bold text-emerald-400">
                              {data.totalAmount.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Chữ số tổng tâm vòng tròn Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-900">{totalOrdersCount}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Tổng đơn</span>
            </div>
          </>
        )}
      </div>

      {/* Danh sách các kênh thanh toán */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        {chartData.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold text-slate-700 truncate">{item.name}</span>
            </div>
            <span className="font-extrabold text-slate-900 shrink-0 ml-1">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

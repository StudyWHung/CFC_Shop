"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award, Trophy } from "lucide-react";
import { Order } from "@/types";

interface TopSellingChartProps {
  orders: Order[];
}

const BAR_COLORS = ["#034694", "#0284C7", "#38BDF8", "#FDB913", "#10B981", "#8B5CF6"];

/**
 * =============================================================================
 * BIỂU ĐỒ TOP MÔ HÌNH / CẦU THỦ BÁN CHẠY NHẤT (TOP SELLING FIGURES BAR CHART)
 * 
 * - Thống kê các mẫu figure có lượng đặt mua cao nhất từ các đơn hàng.
 * - Sử dụng Bar Chart cột ngang với nhãn tên cầu thủ rõ ràng.
 * =============================================================================
 */
export default function TopSellingChart({ orders }: TopSellingChartProps) {
  // Tổng hợp số lượng bán và doanh thu của từng sản phẩm từ toàn bộ đơn hàng
  const chartData = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        playerName: string;
        playerNumber: number;
        totalSold: number;
        revenue: number;
      }
    >();

    orders.forEach((order) => {
      // Chỉ tính các đơn không bị hủy
      if (order.status === "cancelled") return;

      order.items.forEach((item) => {
        const prod = item.product;
        const current = map.get(prod.id) || {
          id: prod.id,
          name: prod.name,
          playerName: prod.playerName || prod.name,
          playerNumber: prod.playerNumber || 0,
          totalSold: 0,
          revenue: 0,
        };

        current.totalSold += item.quantity;
        current.revenue += item.quantity * prod.price;
        map.set(prod.id, current);
      });
    });

    // Sắp xếp theo số lượng bán giảm dần và lấy Top 5
    return Array.from(map.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Biểu Đồ */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Top Mô Hình Cầu Thủ Bán Chạy
            </h3>
            <p className="text-xs text-slate-500">
              Xếp hạng theo số lượng figure đã được khách chốt đơn
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
          <Award className="w-3.5 h-3.5" />
          <span>Top 5 Hero Figures</span>
        </span>
      </div>

      {/* Vùng BarChart Cột Ngang */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Chưa có giao dịch bán hàng để xếp hạng
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />

              <XAxis
                type="number"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="playerName"
                stroke="#334155"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                width={100}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1.5 max-w-xs">
                        <div className="font-extrabold text-[#38BDF8] line-clamp-1">{data.name}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Số lượng bán:</span>
                          <span className="font-extrabold text-amber-400">{data.totalSold} chiếc</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Tổng doanh số:</span>
                          <span className="font-bold text-emerald-400">
                            {data.revenue.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar dataKey="totalSold" radius={[0, 8, 8, 0]} barSize={20}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

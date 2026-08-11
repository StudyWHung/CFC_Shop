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
  ReferenceLine,
} from "recharts";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Product } from "@/types";

interface StockAlertChartProps {
  products: Product[];
}

/**
 * =============================================================================
 * BIỂU ĐỒ THEO DÕI TỒN KHO & CẢNH BÁO HÀNG SẮP HẾT (STOCK LEVEL & ALERT CHART)
 * 
 * - Hiển thị số lượng tồn kho của từng mẫu mô hình figure.
 * - Tự động đổi màu cột dựa theo ngưỡng:
 *   + Đỏ (< 10 chiếc): Cảnh báo sắp hết hàng.
 *   + Vàng (10 - 15 chiếc): Mức ổn định.
 *   + Xanh lục (> 15 chiếc): Kho dồi dào.
 * =============================================================================
 */
export default function StockAlertChart({ products }: StockAlertChartProps) {
  // Sắp xếp các mô hình theo lượng tồn kho tăng dần (để đẩy các mã sắp hết lên đầu)
  const chartData = useMemo(() => {
    return [...products]
      .sort((a, b) => a.stock - b.stock)
      .map((p) => {
        let statusColor = "#10B981"; // Dồi dào (>15)
        let statusLabel = "Dồi dào";

        if (p.stock < 10) {
          statusColor = "#EF4444"; // Cảnh báo (<10)
          statusLabel = "Sắp hết hàng";
        } else if (p.stock <= 15) {
          statusColor = "#F59E0B"; // Ổn định (10-15)
          statusLabel = "Ổn định";
        }

        return {
          id: p.id,
          name: p.name,
          playerName: p.playerName || p.name,
          stock: p.stock,
          statusColor,
          statusLabel,
        };
      });
  }, [products]);

  // Số lượng mô hình đang ở mức cảnh báo (<10)
  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock < 10).length;
  }, [products]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Biểu Đồ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Mức Tồn Kho & Cảnh Báo Hết Hàng
            </h3>
            <p className="text-xs text-slate-500">
              Kiểm soát số lượng figure còn lại trong kho theo từng cầu thủ
            </p>
          </div>
        </div>

        {/* Badge Cảnh Báo */}
        {lowStockCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Có {lowStockCount} mẫu sắp hết hàng (&lt;10 chiếc)</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kho hàng ở mức an toàn</span>
          </span>
        )}
      </div>

      {/* Chú thích màu sắc */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>&lt; 10 chiếc (Cần nhập hàng)</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>10 - 15 chiếc (Mức trung bình)</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>&gt; 15 chiếc (Tồn kho dồi dào)</span>
        </div>
      </div>

      {/* Vùng BarChart Cột Đứng */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Không có dữ liệu sản phẩm trong kho
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

              <XAxis
                dataKey="playerName"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
              />

              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1 max-w-xs">
                        <div className="font-extrabold text-[#38BDF8] line-clamp-1">{data.name}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Số lượng tồn:</span>
                          <span className="font-extrabold text-white">{data.stock} chiếc</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Tình trạng:</span>
                          <span
                            className="font-bold"
                            style={{ color: data.statusColor }}
                          >
                            {data.statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Đường chuẩn cảnh báo 10 chiếc */}
              <ReferenceLine
                y={10}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{
                  value: "Ngưỡng 10",
                  fill: "#EF4444",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />

              <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={26}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.statusColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

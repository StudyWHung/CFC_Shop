"use client";

import React, { useMemo, useState } from "react";
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
import { Shield, Users, Trophy } from "lucide-react";
import { Product, Order, PlayerRole } from "@/types";

interface PositionRoleChartProps {
  products: Product[];
  orders?: Order[];
}

const ROLE_METADATA: Record<
  PlayerRole,
  { name: string; shortName: string; color: string; desc: string }
> = {
  FW: {
    name: "Hàng Tiền Đạo (FW)",
    shortName: "Tiền Đạo (FW)",
    color: "#F97316", // Orange / Fire
    desc: "Cầu thủ tấn công cánh & trung phong cắm",
  },
  MF: {
    name: "Tuyến Tiền Vệ (MF)",
    shortName: "Tiền Vệ (MF)",
    color: "#034694", // Chelsea Blue
    desc: "Tiền vệ kiến thiết, đánh chặn & tấn công",
  },
  DF: {
    name: "Hàng Phòng Ngự (DF)",
    shortName: "Hậu Vệ (DF)",
    color: "#10B981", // Emerald Green
    desc: "Trung vệ thép & hậu vệ biên",
  },
  GK: {
    name: "Người Gác Đền (GK)",
    shortName: "Thủ Môn (GK)",
    color: "#8B5CF6", // Purple
    desc: "Thủ thành chốt chặn khung gỗ",
  },
};

/**
 * =============================================================================
 * BIỂU ĐỒ CƠ CẤU ĐỘI HÌNH THEO VỊ TRÍ THI ĐẤU (POSITION ROLE CHART)
 * 
 * - Phân loại mô hình theo 4 tuyến: FW (Tiền đạo), MF (Tiền vệ), DF (Hậu vệ), GK (Thủ môn).
 * - Giúp phát hiện vị trí nào đang thiếu hàng hoặc bán chạy nhất để nhập thêm.
 * =============================================================================
 */
export default function PositionRoleChart({ products, orders = [] }: PositionRoleChartProps) {
  const [viewMode, setViewMode] = useState<"stock" | "revenue">("stock");

  const chartData = useMemo(() => {
    const roles: PlayerRole[] = ["FW", "MF", "DF", "GK"];

    return roles.map((roleKey) => {
      const meta = ROLE_METADATA[roleKey];

      // Lọc sản phẩm theo role
      const matchedProducts = products.filter((p) => p.role === roleKey);
      const totalStock = matchedProducts.reduce((sum, p) => sum + p.stock, 0);
      const productCount = matchedProducts.length;

      // Tính doanh thu từ đơn hàng
      let totalRevenue = 0;
      let totalSold = 0;
      orders.forEach((o) => {
        if (o.status === "cancelled") return;
        o.items.forEach((item) => {
          if (item.product.role === roleKey) {
            totalRevenue += item.quantity * item.product.price;
            totalSold += item.quantity;
          }
        });
      });

      return {
        role: roleKey,
        name: meta.shortName,
        fullName: meta.name,
        color: meta.color,
        desc: meta.desc,
        stock: totalStock,
        revenue: totalRevenue,
        productCount,
        totalSold,
      };
    });
  }, [products, orders]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
      
      {/* HEADER BIỂU ĐỒ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Cơ Cấu Đội Hình (FW / MF / DF / GK)
            </h3>
            <p className="text-xs text-slate-500">
              Phân bổ số lượng & hiệu suất mô hình theo 4 tuyến thi đấu
            </p>
          </div>
        </div>

        {/* Nút chuyển đổi: Tồn kho / Doanh thu */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setViewMode("stock")}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              viewMode === "stock"
                ? "bg-[#034694] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tồn Kho
          </button>
          <button
            onClick={() => setViewMode("revenue")}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              viewMode === "revenue"
                ? "bg-[#034694] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Doanh Thu
          </button>
        </div>
      </div>

      {/* VÙNG BARCHART */}
      <div className="h-60 sm:h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: viewMode === "revenue" ? 10 : -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) =>
                viewMode === "revenue" ? `${(val / 1000000).toFixed(1)}Tr` : `${val}`
              }
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
                      <div className="font-extrabold text-amber-400 text-sm border-b border-slate-800 pb-1">
                        {data.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400">{data.desc}</div>
                      <div className="flex justify-between gap-4 pt-1">
                        <span className="text-slate-400">Số lượng tồn kho:</span>
                        <span className="font-bold text-white">{data.stock} chiếc ({data.productCount} mẫu)</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Số lượng đã bán:</span>
                        <span className="font-bold text-amber-400">{data.totalSold} chiếc</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tổng doanh thu:</span>
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

            <Bar
              dataKey={viewMode === "revenue" ? "revenue" : "stock"}
              radius={[8, 8, 0, 0]}
              barSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* THẺ TÓM TẮT 4 TUYẾN THI ĐẤU */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
        {chartData.map((item) => (
          <div
            key={item.role}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-slate-800">{item.role}</span>
            </div>
            <span className="text-sm sm:text-base font-black text-slate-900 block">
              {viewMode === "revenue"
                ? `${(item.revenue / 1000000).toFixed(1)}Tr`
                : `${item.stock} chiếc`}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 block">
              {item.productCount} mẫu figure
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

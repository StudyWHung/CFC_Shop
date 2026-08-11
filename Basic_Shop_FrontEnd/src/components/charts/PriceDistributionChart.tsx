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
import { Tag, DollarSign } from "lucide-react";
import { Product } from "@/types";

interface PriceDistributionChartProps {
  products: Product[];
}

const PRICE_TIERS = [
  { range: "< 600K", label: "Dưới 600.000 đ", min: 0, max: 599999, color: "#38BDF8" },
  { range: "600K - 800K", label: "600.000 đ - 800.000 đ", min: 600000, max: 800000, color: "#034694" },
  { range: "800K - 1Tr", label: "800.000 đ - 1.000.000 đ", min: 800001, max: 1000000, color: "#FDB913" },
  { range: "> 1Tr", label: "Trên 1.000.000 đ (Limited)", min: 1000001, max: Infinity, color: "#8B5CF6" },
];

/**
 * =============================================================================
 * BIỂU ĐỒ PHÂN BỐ PHÂN KHÚC GIÁ MÔ HÌNH (PRICE DISTRIBUTION CHART)
 * 
 * - Thống kê số lượng mã mô hình figure theo từng phân khúc giá.
 * - Giúp chủ shop định hình phổ giá sản phẩm và cơ cấu biên lợi nhuận.
 * =============================================================================
 */
export default function PriceDistributionChart({ products }: PriceDistributionChartProps) {
  const chartData = useMemo(() => {
    return PRICE_TIERS.map((tier) => {
      const matchedProducts = products.filter(
        (p) => p.price >= tier.min && p.price <= tier.max
      );

      const totalStockInTier = matchedProducts.reduce((sum, p) => sum + p.stock, 0);

      return {
        range: tier.range,
        label: tier.label,
        count: matchedProducts.length,
        totalStock: totalStockInTier,
        color: tier.color,
        products: matchedProducts.map((p) => p.name),
      };
    });
  }, [products]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Biểu Đồ */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Phân Khúc Giá Bán Mô Hình
            </h3>
            <p className="text-xs text-slate-500">
              Số lượng mẫu figure theo từng khoảng giá niêm yết
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          4 Phân khúc
        </span>
      </div>

      {/* Vùng BarChart Cột Đứng */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

            <XAxis
              dataKey="range"
              stroke="#64748B"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
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
                      <div className="font-extrabold text-amber-400">{data.label}</div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Số mẫu mô hình:</span>
                        <span className="font-bold text-white">{data.count} mẫu</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tổng lượng tồn:</span>
                        <span className="font-bold text-[#38BDF8]">{data.totalStock} chiếc</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tóm tắt nhanh các mức giá */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
        {chartData.map((tier) => (
          <div
            key={tier.range}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center"
          >
            <span className="text-[11px] font-bold text-slate-500 block truncate">{tier.range}</span>
            <span className="text-base font-black text-slate-900">{tier.count} <span className="text-xs font-semibold text-slate-400">mẫu</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

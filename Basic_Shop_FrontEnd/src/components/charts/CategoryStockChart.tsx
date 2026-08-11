"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon, Layers, DollarSign, Package, Tag } from "lucide-react";
import { Product, Order } from "@/types";
import { CATEGORIES } from "@/data/initialProducts";

interface CategoryStockChartProps {
  products: Product[];
  orders?: Order[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "current-squad": "#034694", // Chelsea Royal Blue
  "legends": "#FDB913",       // Gold / Chelsea Yellow
};

const FALLBACK_COLORS = ["#034694", "#FDB913", "#10B981", "#8B5CF6", "#EC4899", "#3B82F6"];

/**
 * =============================================================================
 * BIỂU ĐỒ BỘ SƯU TẬP (CATEGORY DONUT CHART - SỬA LỖI CẮT CHỮ + TOGGLE METRIC)
 * 
 * - Đã loại bỏ hoàn toàn lỗi cắt chữ (Truncate) ở phần Legend chú giải.
 * - Hỗ trợ chuyển đổi chế độ xem: Tồn Kho (Chiếc) ⇄ Doanh Thu (VNĐ) ⇄ Số Mẫu (Mã).
 * =============================================================================
 */
export default function CategoryStockChart({ products, orders = [] }: CategoryStockChartProps) {
  const [metric, setMetric] = useState<"stock" | "revenue" | "count">("stock");

  // Tính toán số liệu theo từng Category
  const { chartData, totalValue, unitLabel } = useMemo(() => {
    const map = new Map<
      string,
      { name: string; stock: number; count: number; revenue: number }
    >();

    // 1. Duyệt qua sản phẩm
    products.forEach((product) => {
      const catSlug = product.category || "current-squad";
      const catInfo = CATEGORIES.find((c) => c.slug === catSlug);
      const catName = catInfo ? catInfo.name : catSlug;

      const current = map.get(catSlug) || { name: catName, stock: 0, count: 0, revenue: 0 };
      current.stock += product.stock;
      current.count += 1;
      map.set(catSlug, current);
    });

    // 2. Duyệt qua đơn hàng để tính doanh thu theo category
    orders.forEach((order) => {
      if (order.status === "cancelled") return;
      order.items.forEach((item) => {
        // Khớp sản phẩm theo ID để lấy đúng Category chuẩn hóa
        const matchedProd = products.find((p) => p.id === item.product.id) || item.product;
        let catSlug = matchedProd.category || "current-squad";
        if (catSlug === "goalkeepers") catSlug = "legends";

        const current = map.get(catSlug);
        if (current) {
          current.revenue += item.quantity * matchedProd.price;
        }
      });
    });


    // 3. Tính tổng giá trị theo metric đang chọn
    let sumTotal = 0;
    map.forEach((item) => {
      if (metric === "stock") sumTotal += item.stock;
      else if (metric === "revenue") sumTotal += item.revenue;
      else sumTotal += item.count;
    });

    const data = Array.from(map.entries()).map(([slug, item], index) => {
      let val = item.stock;
      if (metric === "revenue") val = item.revenue;
      else if (metric === "count") val = item.count;

      const percentage = sumTotal > 0 ? Math.round((val / sumTotal) * 100) : 0;

      return {
        slug,
        name: item.name,
        value: val,
        percentage,
        color: CATEGORY_COLORS[slug] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        rawStock: item.stock,
        rawRevenue: item.revenue,
        rawCount: item.count,
      };
    });

    let unit = "chiếc";
    if (metric === "revenue") unit = "đ";
    else if (metric === "count") unit = "mẫu";

    return {
      chartData: data,
      totalValue: sumTotal,
      unitLabel: unit,
    };
  }, [products, orders, metric]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
      
      {/* HEADER BIỂU ĐỒ & NÚT CHUYỂN METRIC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Cơ Cấu Bộ Sưu Tập
            </h3>
            <p className="text-xs text-slate-500">
              Tỷ lệ giữa Đội hình hiện tại & Huyền thoại
            </p>
          </div>
        </div>

        {/* Nút chuyển đổi: Tồn kho / Doanh thu / Số mẫu */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setMetric("stock")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              metric === "stock"
                ? "bg-[#034694] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tồn Kho
          </button>
          <button
            onClick={() => setMetric("revenue")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              metric === "revenue"
                ? "bg-[#034694] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Doanh Thu
          </button>
          <button
            onClick={() => setMetric("count")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              metric === "count"
                ? "bg-[#034694] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Số Mẫu
          </button>
        </div>
      </div>

      {/* VÙNG DONUT CHART */}
      <div className="h-60 sm:h-64 w-full relative">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
            Chưa có dữ liệu
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
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[180px]">
                          <div className="font-extrabold text-amber-400 text-sm border-b border-slate-800 pb-1">
                            {data.name}
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Tồn kho:</span>
                            <span className="font-bold text-white">{data.rawStock} chiếc</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Doanh thu:</span>
                            <span className="font-bold text-emerald-400">
                              {data.rawRevenue.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Số mẫu mã:</span>
                            <span className="font-bold text-[#38BDF8]">{data.rawCount} mẫu</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* CHỮ SỐ TỔNG Ở TÂM DONUT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {metric === "revenue"
                  ? `${(totalValue / 1000000).toFixed(1)}Tr`
                  : totalValue}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {metric === "revenue" ? "Tổng Doanh Thu" : `Tổng ${unitLabel}`}
              </span>
            </div>
          </>
        )}
      </div>

      {/* DANH SÁCH CHÚ GIẢI (LEGEND KHÔNG BỊ CẮT CHỮ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
        {chartData.map((item) => (
          <div
            key={item.slug}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/80 transition"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-bold text-slate-800 whitespace-normal">
                {item.name}
              </span>
            </div>

            <div className="text-right shrink-0 ml-2 font-black text-slate-900">
              {metric === "revenue"
                ? `${item.value.toLocaleString("vi-VN")} đ`
                : `${item.value} ${unitLabel}`}{" "}
              <span className="text-[11px] font-semibold text-slate-400">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

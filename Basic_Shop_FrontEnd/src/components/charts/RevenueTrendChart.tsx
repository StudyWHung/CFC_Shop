"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Calendar as CalendarIcon } from "lucide-react";
import { Order } from "@/types";
import CustomDateRangePicker, { PresetType } from "./CustomDateRangePicker";

interface RevenueTrendChartProps {
  orders: Order[];
}

/**
 * =============================================================================
 * BIỂU ĐỒ DOANH THU & ĐƠN HÀNG VỚI DROPDOWN CALENDAR THU GỌN TIẾT KIỆM DIỆN TÍCH
 * =============================================================================
 */
export default function RevenueTrendChart({ orders }: RevenueTrendChartProps) {
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Mặc định lọc 7 ngày gần nhất
  const [preset, setPreset] = useState<PresetType>("7d");
  const [startDate, setStartDate] = useState<string>(() => {
    const past7 = new Date();
    past7.setDate(past7.getDate() - 7);
    return past7.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(todayStr);

  const handleApplyRange = (start: string, end: string, newPreset: PresetType) => {
    setStartDate(start);
    setEndDate(end);
    setPreset(newPreset);
  };

  // Gom nhóm dữ liệu biểu đồ
  const { chartData, dateRangeLabel, totalRevenue, totalOrders } = useMemo(() => {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Lọc theo khoảng ngày
    const filtered = sortedOrders.filter((o) => {
      if (o.status === "cancelled") return false;
      const matchStart = !startDate || o.createdAt >= startDate;
      const matchEnd = !endDate || o.createdAt <= endDate;
      return matchStart && matchEnd;
    });

    // Gom nhóm doanh thu theo ngày (YYYY-MM-DD)
    const map = new Map<string, { date: string; revenue: number; orderCount: number }>();

    filtered.forEach((order) => {
      const dateKey = order.createdAt;
      const current = map.get(dateKey) || { date: dateKey, revenue: 0, orderCount: 0 };
      current.revenue += order.totalAmount;
      current.orderCount += 1;
      map.set(dateKey, current);
    });

    const result = Array.from(map.values()).map((item) => {
      const parts = item.date.split("-");
      const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : item.date;
      return {
        ...item,
        shortDate,
      };
    });

    const sumRevenue = result.reduce((sum, item) => sum + item.revenue, 0);
    const sumOrders = result.reduce((sum, item) => sum + item.orderCount, 0);

    let label = "7 ngày gần nhất";
    if (preset === "1d") label = `Hôm nay (${endDate})`;
    else if (preset === "7d") label = "7 ngày qua";
    else if (preset === "30d") label = "30 ngày qua (1 tháng)";
    else if (preset === "all") label = "Toàn bộ thời gian";
    else if (startDate && endDate) {
      label = `Từ ${startDate} đến ${endDate}`;
    }

    return {
      chartData: result,
      dateRangeLabel: label,
      totalRevenue: sumRevenue,
      totalOrders: sumOrders,
    };
  }, [orders, startDate, endDate, preset]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      
      {/* HEADER BIỂU ĐỒ & NÚT DROPDOWN CALENDAR GỌN GÀNG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#034694] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Xu Hướng Doanh Thu & Đơn Hàng
            </h3>
            <p className="text-xs text-slate-500">
              {dateRangeLabel} ({chartData.length} mốc ghi nhận)
            </p>
          </div>
        </div>

        {/* COMPONENT DROPDOWN CALENDAR THU GỌN */}
        <div className="self-start sm:self-auto">
          <CustomDateRangePicker
            startDate={startDate}
            endDate={endDate}
            activePreset={preset}
            onApplyRange={handleApplyRange}
          />
        </div>
      </div>

      {/* 2 THẺ TÓM TẮT DOANH THU & ĐƠN HÀNG */}
      <div className="grid grid-cols-2 gap-3 py-1">
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#034694] flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Doanh Thu Giai Đoạn</span>
            <span className="text-sm sm:text-base font-black text-[#034694]">
              {totalRevenue.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Số Đơn Hàng</span>
            <span className="text-sm sm:text-base font-black text-amber-700">
              {totalOrders} đơn
            </span>
          </div>
        </div>
      </div>

      {/* KHU VỰC RENDER AREACHART */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs font-semibold gap-1">
            <CalendarIcon className="w-8 h-8 text-slate-300" />
            <span>Không tìm thấy giao dịch nào trong khoảng thời gian này</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cfcBlueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#034694" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#034694" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

              <XAxis
                dataKey="shortDate"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}Tr`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-300 border-b border-slate-800 pb-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>Ngày: {data.date}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Doanh thu:</span>
                          <span className="font-extrabold text-[#38BDF8]">
                            {data.revenue.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Số đơn hàng:</span>
                          <span className="font-bold text-amber-400">{data.orderCount} đơn</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#034694"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#cfcBlueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

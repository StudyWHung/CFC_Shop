"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  RotateCcw,
  X,
} from "lucide-react";

export type PresetType = "1d" | "7d" | "30d" | "all" | "custom";

interface CustomDateRangePickerProps {
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  activePreset: PresetType;
  onApplyRange: (start: string, end: string, preset: PresetType) => void;
}

const PRESETS: { id: PresetType; label: string }[] = [
  { id: "1d", label: "Hôm Nay (1 Ngày)" },
  { id: "7d", label: "7 Ngày Gần Nhất" },
  { id: "30d", label: "30 Ngày (1 Tháng)" },
  { id: "all", label: "Toàn Bộ Thời Gian" },
];

const WEEK_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/**
 * Format string "YYYY-MM-DD" -> Date
 */
function parseISODate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format Date -> "YYYY-MM-DD"
 */
function toISODateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format "YYYY-MM-DD" -> "DD/MM/YYYY"
 */
function toDisplayDate(str: string): string {
  if (!str) return "";
  const parts = str.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return str;
}

/**
 * =============================================================================
 * COMPONENT: CUSTOM DATE RANGE PICKER DROPDOWN (CHELSEA THEME)
 * 
 * - Thu gọn thành một nút Dropdown tinh tế, tiết kiệm tối đa diện tích.
 * - Khi click sẽ mở Popover Calendar với thiết kế chuẩn Chelsea Royal Blue (#034694).
 * - Hỗ trợ chọn nhanh Preset (Hôm nay, 7 ngày, 30 ngày, Tất cả) hoặc click chọn
 *   trực tiếp khoảng ngày bắt đầu -> kết thúc trên bảng lịch.
 * =============================================================================
 */
export default function CustomDateRangePicker({
  startDate,
  endDate,
  activePreset,
  onApplyRange,
}: CustomDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // State tạm thời khi người dùng đang thao tác trong Calendar
  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Tháng và năm đang hiển thị trên Calendar
  const initialDate = useMemo(() => (endDate ? parseISODate(endDate) : new Date()), [endDate]);
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());

  // Đồng bộ khi prop thay đổi
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Click outside để tự động đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Chuyển sang tháng trước
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Chuyển sang tháng sau
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Tạo danh sách các ô ngày trong tháng (kèm các ngày đệm của tháng trước & sau)
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = CN, 1 = T2...
    const totalDaysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Các ngày cuối của tháng trước
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = totalDaysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const iso = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, iso, isCurrentMonth: false });
    }

    // Các ngày trong tháng hiện tại
    for (let d = 1; d <= totalDaysInCurrentMonth; d++) {
      const iso = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, iso, isCurrentMonth: true });
    }

    // Các ngày đầu của tháng sau để lấp đầy hàng 35 hoặc 42 ô
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const iso = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, iso, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Xử lý khi click vào 1 ngày trên Calendar
  const handleDateClick = (iso: string) => {
    if (!tempStart || (tempStart && tempEnd)) {
      // Bắt đầu chọn mốc mới
      setTempStart(iso);
      setTempEnd("");
    } else if (tempStart && !tempEnd) {
      // Đang có ngày bắt đầu -> chọn ngày kết thúc
      if (iso < tempStart) {
        setTempEnd(tempStart);
        setTempStart(iso);
      } else {
        setTempEnd(iso);
      }
    }
  };

  // Áp dụng Preset nhanh
  const handleSelectPreset = (presetId: PresetType) => {
    const today = new Date();
    const todayStr = toISODateString(today);

    if (presetId === "1d") {
      onApplyRange(todayStr, todayStr, "1d");
    } else if (presetId === "7d") {
      const past7 = new Date(today);
      past7.setDate(past7.getDate() - 7);
      onApplyRange(toISODateString(past7), todayStr, "7d");
    } else if (presetId === "30d") {
      const past30 = new Date(today);
      past30.setDate(past30.getDate() - 30);
      onApplyRange(toISODateString(past30), todayStr, "30d");
    } else if (presetId === "all") {
      onApplyRange("2026-01-01", todayStr, "all");
    }
    setIsOpen(false);
  };

  // Bấm nút "Áp Dụng Khoảng Ngày"
  const handleApplyCustom = () => {
    if (tempStart) {
      const end = tempEnd || tempStart;
      onApplyRange(tempStart, end, "custom");
      setIsOpen(false);
    }
  };

  // Text hiển thị trên nút Trigger Dropdown
  const triggerLabel = useMemo(() => {
    if (activePreset === "1d") return "Hôm Nay";
    if (activePreset === "7d") return "7 Ngày Qua";
    if (activePreset === "30d") return "30 Ngày Qua";
    if (activePreset === "all") return "Toàn Bộ Thời Gian";
    if (startDate && endDate) {
      const s = toDisplayDate(startDate).slice(0, 5); // "01/02"
      const e = toDisplayDate(endDate).slice(0, 5);   // "11/02"
      return `${s} - ${e}`;
    }
    return "Chọn Ngày";
  }, [activePreset, startDate, endDate]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      
      {/* 1. NÚT TRIGGER THU GỌN DROPDOWN */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
          isOpen || activePreset === "custom"
            ? "bg-blue-50/80 border-[#034694] text-[#034694] ring-2 ring-blue-100"
            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
        }`}
      >
        <CalendarIcon className="w-4 h-4 text-[#034694]" />
        <span>{triggerLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#034694]" : ""
          }`}
        />
      </button>

      {/* 2. POPOVER CALENDAR DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-5 w-[330px] sm:w-[540px] animate-in fade-in zoom-in-95 duration-150">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            
            {/* CỘT TRÁI: CÁC LỰA CHỌN NHANH (PRESETS) */}
            <div className="sm:col-span-5 space-y-1.5 sm:border-r border-slate-100 sm:pr-4">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 block px-2 mb-2">
                Mốc Nhanh
              </span>
              {PRESETS.map((item) => {
                const isSelected = activePreset === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#034694] text-white shadow-sm"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-100 px-1 text-[11px] text-slate-500">
                <span className="font-bold text-[#034694] block mb-1">💡 Tùy Chọn:</span>
                Nhấp ngày bắt đầu và kết thúc trên bảng lịch bên cạnh.
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG LỊCH CALENDAR CHELSEA STYLE */}
            <div className="sm:col-span-7 space-y-3">
              
              {/* Header Tháng & Nút chuyển tháng */}
              <div className="flex items-center justify-between pb-1">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                  Tháng {currentMonth + 1}, {currentYear}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Tháng trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Tháng sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tên thứ trong tuần */}
              <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400 mb-1">
                {WEEK_DAYS.map((w, idx) => (
                  <div key={idx} className={idx === 0 ? "text-red-400" : ""}>
                    {w}
                  </div>
                ))}
              </div>

              {/* Lưới các ô ngày */}
              <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                {calendarDays.map((item, idx) => {
                  const isStart = tempStart === item.iso;
                  const isEnd = tempEnd === item.iso;
                  const isSingle = isStart && (!tempEnd || tempStart === tempEnd);

                  // Kiểm tra xem ngày này có nằm trong khoảng range đang chọn hoặc đang hover không
                  const effectiveEnd = tempEnd || hoverDate;
                  const isInRange =
                    tempStart &&
                    effectiveEnd &&
                    item.iso > (tempStart < effectiveEnd ? tempStart : effectiveEnd) &&
                    item.iso < (tempStart < effectiveEnd ? effectiveEnd : tempStart);

                  return (
                    <div
                      key={idx}
                      className={`relative py-1 flex items-center justify-center ${
                        isInRange ? "bg-blue-50 text-[#034694]" : ""
                      } ${isStart && tempEnd && tempEnd !== tempStart ? "rounded-l-full bg-blue-100" : ""} ${
                        isEnd && tempStart && tempStart !== tempEnd ? "rounded-r-full bg-blue-100" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleDateClick(item.iso)}
                        onMouseEnter={() => {
                          if (tempStart && !tempEnd) setHoverDate(item.iso);
                        }}
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isStart || isEnd
                            ? "bg-[#034694] text-white shadow-md shadow-blue-900/30 scale-105"
                            : item.isCurrentMonth
                            ? "text-slate-800 hover:bg-blue-100 hover:text-[#034694]"
                            : "text-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {item.day}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Tóm tắt ngày đã chọn & Nút Áp dụng */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-500 truncate">
                  {tempStart ? (
                    <span>
                      <span className="font-bold text-[#034694]">{toDisplayDate(tempStart)}</span>
                      {tempEnd && (
                        <span> ➔ <span className="font-bold text-[#034694]">{toDisplayDate(tempEnd)}</span></span>
                      )}
                    </span>
                  ) : (
                    "Chọn ngày"
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTempStart("");
                      setTempEnd("");
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
                    title="Đặt lại"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    disabled={!tempStart}
                    className="px-3 py-1.5 bg-[#034694] hover:bg-[#023470] text-white font-bold rounded-xl text-xs transition disabled:opacity-40 cursor-pointer"
                  >
                    Áp Dụng
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

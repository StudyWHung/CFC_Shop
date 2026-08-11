import React from "react";
import { ShieldCheck, Truck, RefreshCw, Award, Heart } from "lucide-react";

/**
 * =============================================================================
 * COMPONENT: FOOTER (CHÂN TRANG)
 * - Hiển thị các cam kết chất lượng (Bảo hành, Đổi trả, Giao hàng)
 * - Thông tin bản quyền câu lạc bộ Chelsea FC
 * =============================================================================
 */
export default function Footer() {
  return (
    <footer className="bg-[#0a192f] text-slate-300 border-t border-blue-900/60 mt-16">
      {/* KHỐI CAM KẾT CHẤT LƯỢNG */}
      <div className="border-b border-blue-900/40 py-8 bg-[#071324]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-900/50 flex items-center justify-center text-amber-400 shrink-0 border border-blue-800/60">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Figure Chính Hãng</h4>
                <p className="text-xs text-slate-400">Độ hoàn thiện chi tiết 100%</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-900/50 flex items-center justify-center text-amber-400 shrink-0 border border-blue-800/60">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-slate-400">Đóng gói xốp hơi chống sốc</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-900/50 flex items-center justify-center text-amber-400 shrink-0 border border-blue-800/60">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Đổi Trả Dễ Dàng</h4>
                <p className="text-xs text-slate-400">Trong 7 ngày nếu lỗi nhà SX</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-900/50 flex items-center justify-center text-amber-400 shrink-0 border border-blue-800/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Bảo Hành Khớp & Sơn</h4>
                <p className="text-xs text-slate-400">Cam kết không phai màu</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* THÔNG TIN BẢN QUYỀN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © 2026 <span className="text-amber-400 font-bold">CFC Figures Store</span> — Pride of London.
        </p>
        <p className="flex items-center gap-1">
          Dành trọn đam mê cho cổ động viên <span className="text-blue-400 font-bold">The Blues</span> <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </p>
      </div>
    </footer>
  );
}

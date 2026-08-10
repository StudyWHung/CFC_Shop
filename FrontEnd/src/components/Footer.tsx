"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001433] text-white border-t border-[#034694]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Col 1: Brand Chelsea FC */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-10 h-10 rounded-full p-0.5 bg-white/10 border-2 border-[#dba111] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/chelsea-logo.svg"
                  alt="Chelsea FC"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                CHELSEA FC STORE
              </span>
            </div>
            <p className="text-xs text-blue-200/80 leading-relaxed max-w-sm">
              Cửa hàng trực tuyến chính thức dành riêng cho người hâm mộ câu lạc bộ bóng đá Chelsea FC tại Việt Nam. 100% sản phẩm có bản quyền từ câu lạc bộ.
            </p>
            <div className="space-y-1.5 text-xs text-blue-200/90 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dba111] flex-shrink-0" />
                <span>Stamford Bridge, Fulham Rd, London SW6 1HS, UK</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#dba111] flex-shrink-0" />
                <span>Hotline: 1900 1234 (8:00 - 22:00)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Danh mục Bộ sưu tập */}
          <div>
            <h4 className="font-bold text-sm text-[#dba111] uppercase tracking-wider mb-4">
              Bộ Sưu Tập Chính Hãng
            </h4>
            <ul className="space-y-2.5 text-xs text-blue-100/80">
              <li><Link href="/" className="hover:text-white transition-colors">Áo Đấu Sân Nhà 2024/25 (Home Kit)</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Áo Đấu Sân Khách 2024/25 (Away Kit)</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Trang Phục Tập Luyện (Training Wear)</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Phụ Kiện & Khăn Quàng Cổ Vũ</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Đồ Lưu Niệm Chelsea FC Sưu Tầm</Link></li>
            </ul>
          </div>

          {/* Col 3: Hỗ trợ & Chính sách */}
          <div>
            <h4 className="font-bold text-sm text-[#dba111] uppercase tracking-wider mb-4">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2.5 text-xs text-blue-100/80">
              <li><span className="hover:text-white cursor-pointer">Bảng Hướng Dẫn Chọn Size Áo Chuẩn UK</span></li>
              <li><span className="hover:text-white cursor-pointer">Chính Sách Vận Chuyển Hỏa Tốc</span></li>
              <li><span className="hover:text-white cursor-pointer">Quy Định Đổi Trả Miễn Phí 7 Ngày</span></li>
              <li><span className="hover:text-white cursor-pointer">Cam Kết 100% Hàng Chính Hãng</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-blue-300">
          <p>&copy; 2026 Chelsea FC Fan Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

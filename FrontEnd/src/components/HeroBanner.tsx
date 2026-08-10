"use client";

import React from "react";
import Image from "next/image";
import { Shield, Truck, RotateCcw, Award, ArrowRight } from "lucide-react";

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden text-white min-h-[480px] sm:min-h-[540px] flex flex-col justify-center">
      {/* Background Image Stamford Bridge */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-chelsea.jpg"
          alt="Stamford Bridge Chelsea FC Stadium"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Dark Blue Stadium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001433]/95 via-[#034694]/85 to-[#001433]/90 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Text */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#dba111]/20 border border-[#dba111]/40 px-4 py-1.5 rounded-full text-[#dba111] text-xs sm:text-sm font-bold tracking-wide shadow-sm backdrop-blur-md">
              <Award className="w-4 h-4" />
              <span>BỘ SƯU TẬP CHÍNH HÃNG MÙA GIẢI 2026/2027</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              PRIDE OF LONDON <br />
              <span className="bg-gradient-to-r from-blue-100 via-white to-[#dba111] bg-clip-text text-transparent">
                CHELSEA FC FAN STORE
              </span>
            </h1>

            <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Trang phục thi đấu chính thức, bộ đồ tập luyện và đồ lưu niệm độc quyền với chất lượng tiêu chuẩn từ Stamford Bridge.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-[#dba111] hover:bg-[#b8850a] text-[#001433] font-black px-8 py-4 rounded-full shadow-2xl hover:shadow-[#dba111]/30 transform hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
              >
                <span>Khám Phá Áo Đấu Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Feature Highlight Badge */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl text-center space-y-4 max-w-xs">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#dba111] to-yellow-200 text-[#001433] flex items-center justify-center shadow-lg font-black text-2xl">
                ★ 25
              </div>
              <h3 className="font-bold text-lg text-white">Chelsea FC Kit 24/25</h3>
              <p className="text-xs text-blue-100/80">
                Sở hữu ngay áo đấu chính thức được thiết kế độc quyền cho các True Blues trên toàn thế giới.
              </p>
              <div className="text-[#dba111] font-black text-2xl">$89.99 USD</div>
            </div>
          </div>

        </div>

        {/* 3 Features Bar */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="p-2.5 rounded-xl bg-[#034694] text-[#dba111] shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Chính Hãng</h4>
              <p className="text-xs text-blue-200">Bảo đảm nguồn gốc từ Chelsea FC</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="p-2.5 rounded-xl bg-[#034694] text-[#dba111] shadow-inner">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Giao Hàng Toàn Quốc</h4>
              <p className="text-xs text-blue-200">Đóng gói chuẩn hộp quà Stamford</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="p-2.5 rounded-xl bg-[#034694] text-[#dba111] shadow-inner">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Đổi Trả Dễ Dàng</h4>
              <p className="text-xs text-blue-200">Hỗ trợ đổi size trong 7 ngày</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

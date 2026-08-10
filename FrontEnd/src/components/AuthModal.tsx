"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Lock, Mail, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        if (!fullName.trim()) {
          setErrorMsg("Vui lòng nhập họ và tên.");
          setIsSubmitting(false);
          return;
        }
        await register(email, password, fullName);
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng kiểm tra lại!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Chelsea FC */}
        <div className="bg-[#001433] p-6 text-white text-center relative border-b border-[#034694]">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-12 h-12 rounded-full p-0.5 bg-white/10 border-2 border-[#dba111] flex items-center justify-center mx-auto mb-2 shadow-lg overflow-hidden">
            <Image
              src="/images/chelsea-logo.svg"
              alt="Chelsea FC Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            {isLoginTab ? "Đăng Nhập Tài Khoản" : "Đăng Ký Thành Viên"}
          </h3>
          <p className="text-xs text-blue-200 mt-0.5">
            Trải nghiệm trọn vẹn Chelsea FC Fan Store
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all ${
              isLoginTab
                ? "border-[#034694] text-[#034694] bg-blue-50/40"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all ${
              !isLoginTab
                ? "border-[#034694] text-[#034694] bg-blue-50/40"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Tạo Tài Khoản Mới
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
                />
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fan@cfcshop.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#034694]/20 focus:border-[#034694]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#034694] hover:bg-[#023470] text-[#dba111] font-bold py-3 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : isLoginTab ? (
              <span>Đăng Nhập Ngay</span>
            ) : (
              <span>Hoàn Tất Đăng Ký</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

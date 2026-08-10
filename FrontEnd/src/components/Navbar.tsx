"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  User as UserIcon, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Category } from "@/types";

interface NavbarProps {
  categories?: Category[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectCategory?: (categoryId?: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories = [],
  searchQuery = "",
  onSearchChange,
  onSelectCategory,
}) => {
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const { totalCount, toggleCart } = useCart();

  // Dropdown states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài màn hình
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#001433] text-white shadow-xl border-b border-[#034694]/50">
      {/* Top Notice Bar */}
      <div className="bg-[#034694] text-xs py-1.5 px-4 text-center font-medium tracking-wider text-blue-100 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#dba111] animate-pulse"></span>
        CHELSEA FC OFFICIAL FAN STORE • GIAO HÀNG TOÀN QUỐC • 100% CHÍNH HÃNG
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Chelsea FC Chính Thống */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-white/10 border-2 border-[#dba111] shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/chelsea-logo.svg"
                alt="Chelsea FC Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-blue-100 to-[#dba111] bg-clip-text text-transparent">
                CHELSEA FC
              </span>
              <span className="block text-[10px] tracking-widest text-[#dba111] uppercase font-bold">
                Fan Store &bull; London
              </span>
            </div>
          </Link>

          {/* Navigation Links & DROPDOWN DANH MỤC */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-200 hover:text-[#dba111] transition-colors py-2"
            >
              Trang Chủ
            </Link>

            {/* DROPDOWN 1: Dropdown Danh mục */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-200 hover:text-[#dba111] transition-colors py-2 focus:outline-none"
              >
                <span>Bộ Sưu Tập</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? "rotate-180 text-[#dba111]" : ""
                  }`}
                />
              </button>

              {/* Danh sách lựa chọn Dropdown */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Chọn Danh Mục
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectCategory?.(undefined);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#034694] font-medium transition-colors flex items-center justify-between"
                  >
                    <span>Tất cả sản phẩm</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">All</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      onClick={() => {
                        onSelectCategory?.(cat.categoryId);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#034694] font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{cat.categoryName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Input Bar */}
          <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Tìm áo đấu, mã SKU..."
              className="w-full bg-[#034694]/30 text-white placeholder-blue-300/60 text-sm rounded-full pl-10 pr-4 py-2 border border-blue-900 focus:outline-none focus:border-[#dba111] focus:ring-1 focus:ring-[#dba111] transition-all"
            />
            <Search className="w-4 h-4 text-blue-300 absolute left-3.5" />
          </div>

          {/* User Account & Cart Button */}
          <div className="flex items-center gap-3">
            
            {/* DROPDOWN 2: Dropdown User Profile / Đăng nhập */}
            <div className="relative" ref={userDropdownRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-[#034694]/50 hover:bg-[#034694] border border-blue-800 rounded-full py-1.5 pl-2 pr-3 text-sm focus:outline-none transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#dba111] text-[#001433] font-black flex items-center justify-center text-xs">
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="font-medium max-w-[110px] truncate text-xs sm:text-sm">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                </button>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 bg-[#034694] hover:bg-[#023470] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-blue-600 shadow-md hover:shadow-blue-900/50 transition-all"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Đăng Nhập</span>
                </button>
              )}

              {/* Menu xổ xuống User Dropdown */}
              {isUserDropdownOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isAdmin ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {user.roleName || (isAdmin ? "Admin" : "User")}
                      </span>
                    </div>
                  </div>

                  {/* CHỈ HIỂN THỊ LINK QUẢN TRỊ KHI LÀ ADMIN */}
                  {isAdmin && (
                    <Link
                      href="/admin/products"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 font-bold transition-colors border-b border-gray-50"
                    >
                      <Settings className="w-4 h-4 text-amber-600" />
                      <span>Trang Quản Trị CRUD</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}
            </div>

            {/* Giỏ Hàng (Cart Button với Badge số lượng từ LocalStorage) */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2.5 rounded-full bg-[#034694] hover:bg-[#023470] text-[#dba111] hover:text-white border border-[#dba111]/30 transition-all shadow-md focus:outline-none"
              title="Xem Giỏ Hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#001433] animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-900/60 py-4 space-y-3 pb-6 animate-in slide-in-from-top duration-200">
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Tìm áo đấu, mã SKU..."
                className="w-full bg-[#034694]/40 text-white placeholder-blue-300 text-sm rounded-lg pl-9 pr-4 py-2 border border-blue-800"
              />
              <Search className="w-4 h-4 text-blue-300 absolute left-3 top-2.5" />
            </div>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-200 hover:text-[#dba111] py-1.5"
            >
              Trang Chủ
            </Link>

            {isAdmin && (
              <Link
                href="/admin/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#dba111] py-1.5"
              >
                Trang Quản Trị CRUD
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

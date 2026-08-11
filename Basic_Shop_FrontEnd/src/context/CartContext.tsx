"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Product, CartItem } from "@/types";

/**
 * =============================================================================
 * CART CONTEXT - QUẢN LÝ TRẠNG THÁI GIỎ HÀNG & TÍNH TOÁN TIỀN MUA SẮM
 * 
 * 1. MỤC ĐÍCH:
 *    - Quản lý tập trung các món hàng người dùng chọn mua.
 *    - Cung cấp các thao tác: Thêm vào giỏ, Tăng/Giảm số lượng, Xóa món, Xóa hết.
 *    - Tự động tính toán tổng số lượng món (`cartCount`) và tổng số tiền (`totalPrice`).
 *    - Đồng bộ tự động vào `localStorage` (F5 tải lại trang không bị mất giỏ hàng).
 * 
 * 2. KẾT NỐI VỚI CÁC THÀNH PHẦN KHÁC:
 *    - Nhận lệnh `addToCart` từ: `ProductCard.tsx` (khi bấm nút "Thêm vào giỏ").
 *    - Cung cấp `cartCount` cho: `Navbar.tsx` (để hiển thị số lượng đỏ nhỏ trên icon giỏ).
 *    - Cung cấp `cartItems`, `totalPrice`, `isDrawerOpen` cho: `CartDrawer.tsx` (ngăn kéo trượt).
 *    - Cung cấp dữ liệu giỏ hàng cho: `app/cart/page.tsx` (trang thanh toán chi tiết).
 * =============================================================================
 */

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "cfc_figures_cart_v2";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // [HOOK 1: useState] - Lưu danh sách món hàng trong giỏ
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // [HOOK 1: useState] - Quản lý trạng thái mở/đóng ngăn kéo giỏ hàng bên phải
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  // [HOOK 1: useState] - Đánh dấu trạng thái nạp dữ liệu ban đầu
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // [HOOK 2: useEffect] - Chạy khi ứng dụng khởi động: Đọc giỏ hàng từ LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Lỗi khi đọc LocalStorage giỏ hàng:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // [HOOK 2: useEffect] - Chạy mỗi khi `cartItems` thay đổi: Lưu giỏ hàng vào LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // [HOOK 3: useMemo] - Tính toán tổng số lượng món hàng trong giỏ
  // Tối ưu: Chỉ tính lại khi mảng `cartItems` thực sự có sự thay đổi
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // [HOOK 3: useMemo] - Tính toán tổng số tiền thanh toán (VNĐ)
  // Logic: Lấy từng (giá sản phẩm * số lượng mua) và cộng dồn lại
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // [HOOK 4: useCallback] - Hàm thêm sản phẩm vào giỏ hàng
  // Logic: 
  // - Nếu sản phẩm ĐÃ CÓ trong giỏ -> Tăng thuộc tính `quantity` lên.
  // - Nếu sản phẩm CHƯA CÓ trong giỏ -> Đưa object `{ product, quantity }` mới vào giỏ.
  // - Tự động mở ngăn kéo CartDrawer để người dùng thấy món vừa thêm.
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex > -1) {
        // Đã có trong giỏ -> cập nhật số lượng (không vượt quá tồn kho)
        const updatedItems = [...prevItems];
        const currentQty = updatedItems[existingItemIndex].quantity;
        const newQty = Math.min(currentQty + quantity, product.stock);

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQty,
        };
        return updatedItems;
      } else {
        // Chưa có trong giỏ -> Thêm mới vào đầu danh sách
        return [{ product, quantity: Math.min(quantity, product.stock) }, ...prevItems];
      }
    });

    // Mở ngăn kéo giỏ hàng xem nhanh
    setIsDrawerOpen(true);
  }, []);

  // [HOOK 4: useCallback] - Hàm cập nhật số lượng của 1 món hàng
  // Logic: Nếu số lượng mới <= 0 thì tự động xóa món đó khỏi giỏ
  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(newQuantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  }, []);

  // [HOOK 4: useCallback] - Hàm xóa 1 món hàng ra khỏi giỏ
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  // [HOOK 4: useCallback] - Hàm xóa sạch giỏ hàng (sau khi đặt hàng thành công)
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom Hook: `useCart`
 * Giúp các Component con truy cập giỏ hàng nhanh chóng.
 * Ví dụ sử dụng: const { cartItems, addToCart, totalPrice } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong <CartProvider>");
  }
  return context;
}

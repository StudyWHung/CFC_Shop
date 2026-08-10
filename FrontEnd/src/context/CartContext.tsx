"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  totalCount: number;
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 1. Đọc dữ liệu Giỏ hàng từ LocalStorage khi khởi động ứng dụng
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cfc_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Lỗi khi đọc giỏ hàng từ LocalStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. Tự động đồng bộ Giỏ hàng vào LocalStorage mỗi khi danh sách giỏ hàng thay đổi
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("cfc_cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Lỗi khi lưu giỏ hàng vào LocalStorage:", error);
      }
    }
  }, [cartItems, isInitialized]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.productId);

      if (existingIndex > -1) {
        // Nếu đã có trong giỏ -> Tăng số lượng
        const updated = [...prev];
        const newQuantity = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQuantity, product.stockQuantity || 99),
        };
        return updated;
      } else {
        // Chưa có -> Thêm mới
        const newItem: CartItem = {
          productId: product.productId,
          productCode: product.productCode,
          productName: product.productName,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: Math.min(quantity, product.stockQuantity || 99),
          stockQuantity: product.stockQuantity,
          categoryName: product.categoryName,
        };
        return [...prev, newItem];
      }
    });

    // Mở drawer giỏ hàng để người dùng thấy sản phẩm vừa thêm
    setIsCartOpen(true);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.stockQuantity || 99),
          };
        }
        return item;
      })
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cfc_cart");
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Tính tổng tiền & tổng số lượng
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        totalCount,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }
  return context;
};

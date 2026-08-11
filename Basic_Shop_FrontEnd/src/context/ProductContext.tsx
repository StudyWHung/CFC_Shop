"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

/**
 * =============================================================================
 * PRODUCT CONTEXT - QUẢN LÝ DỮ LIỆU SẢN PHẨM & CÁC THAO TÁC CRUD
 * 
 * 1. MỤC ĐÍCH:
 *    - Đóng vai trò là "Bộ não trung tâm" lưu trữ danh sách sản phẩm.
 *    - Cung cấp dữ liệu và các hàm CRUD cho mọi trang: Trang chủ (Read), Admin (Create/Update/Delete).
 *    - Tự động lưu và đọc dữ liệu từ HTML5 `localStorage` (không cần Backend/Database).
 * 
 * 2. KẾT NỐI VỚI CÁC THÀNH PHẦN KHÁC:
 *    - Truyền `products` xuống: `app/page.tsx` (để hiển thị danh sách), `app/admin/page.tsx` (để quản lý).
 *    - Nhận lệnh `addProduct` từ: `ProductFormModal.tsx` khi người dùng bấm "Thêm mô hình mới".
 *    - Nhận lệnh `updateProduct` từ: `ProductFormModal.tsx` khi người dùng sửa thông tin.
 *    - Nhận lệnh `deleteProduct` từ: `DeleteConfirmModal.tsx` khi người dùng xác nhận xóa.
 * =============================================================================
 */

// Định nghĩa kiểu dữ liệu cho toàn bộ giá trị mà Context này cung cấp
interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deductStock: (items: { productId: string; quantity: number }[]) => void;
  resetToDefault: () => void;
}

// Khóa lưu trữ trong LocalStorage của trình duyệt (v2: cập nhật toàn bộ ảnh figure cục bộ)
const STORAGE_KEY = "cfc_figures_products_v2";

// Khởi tạo React Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  // [HOOK 1: useState] - Lưu danh sách sản phẩm hiện tại trong bộ nhớ State của React
  const [products, setProducts] = useState<Product[]>([]);
  // [HOOK 1: useState] - Đánh dấu trạng thái đang đọc từ LocalStorage
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // [HOOK 2: useEffect] - Chạy 1 lần duy nhất khi ứng dụng vừa mở lên (Mount)
  // Logic: Đọc dữ liệu đã lưu trong localStorage. Nếu chưa có -> Lấy INITIAL_PRODUCTS làm mẫu
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed: Product[] = JSON.parse(savedData);
        // Tự động thay thế các link ảnh cũ (unsplash) bằng ảnh figure local chất lượng cao
        const updated = parsed.map((p) => {
          const defaultItem = INITIAL_PRODUCTS.find((init) => init.id === p.id);
          if (defaultItem && p.imageUrl && p.imageUrl.includes("unsplash.com")) {
            return { ...p, imageUrl: defaultItem.imageUrl };
          }
          return p;
        });
        setProducts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        // Nếu lần đầu truy cập v2, khởi tạo với 8 mô hình figure cục bộ mới nhất
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch (error) {
      console.error("Lỗi khi đọc LocalStorage sản phẩm:", error);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // [HOOK 2: useEffect] - Chạy mỗi khi danh sách `products` thay đổi (sau khi đã nạp xong lần đầu)
  // Logic: Tự động đồng bộ mảng products mới nhất vào localStorage
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoading]);

  // [HOOK 3: useCallback] - CRUD: CREATE (Thêm mô hình mới)
  // Logic: Sinh ID duy nhất `fig-timestamp`, ghép vào đầu mảng sản phẩm
  const addProduct = useCallback((newProductData: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...newProductData,
      id: `fig-${Date.now()}`, // Tạo mã id duy nhất dựa trên thời gian
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  // [HOOK 3: useCallback] - CRUD: UPDATE (Chỉnh sửa thông tin mô hình)
  // Logic: Tìm sản phẩm có trùng id và ghi đè các thông tin mới
  const updateProduct = useCallback((id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }, []);

  // [HOOK 3: useCallback] - CRUD: DELETE (Xóa mô hình)
  // Logic: Lọc bỏ sản phẩm có id được chỉ định ra khỏi danh sách
  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // [HOOK 3: useCallback] - Khấu trừ số lượng tồn kho sau khi khách đặt hàng thành công
  const deductStock = useCallback((items: { productId: string; quantity: number }[]) => {
    setProducts((prev) =>
      prev.map((product) => {
        const boughtItem = items.find((i) => i.productId === product.id);
        if (boughtItem) {
          const newStock = Math.max(0, product.stock - boughtItem.quantity);
          return { ...product, stock: newStock };
        }
        return product;
      })
    );
  }, []);

  // [HOOK 3: useCallback] - Khôi phục danh sách sản phẩm mẫu ban đầu
  const resetToDefault = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        deductStock,
        resetToDefault,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

/**
 * Custom Hook: `useProducts`
 * Giúp các Component con lấy dữ liệu và các hàm CRUD một cách ngắn gọn và an toàn.
 * Ví dụ sử dụng: const { products, addProduct } = useProducts();
 */
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts phải được sử dụng bên trong <ProductProvider>");
  }
  return context;
}

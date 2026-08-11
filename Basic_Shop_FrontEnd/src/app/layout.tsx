import type { Metadata } from "next";
import "./globals.css";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "CFC Figure Store — Mô Hình Cầu Thủ Chelsea FC Chính Hãng",
  description: "Cửa hàng mô hình figure đồ chơi các cầu thủ Chelsea FC: Cole Palmer, Eden Hazard, Didier Drogba, Frank Lampard...",
  icons: {
    icon: "/images/chelsea-logo.svg",
  },
};

/**
 * =============================================================================
 * ROOT LAYOUT (BỐ CỤC CHÍNH CỦA ỨNG DỤNG)
 * 
 * 1. MỤC ĐÍCH:
 *    - Là khung sườn chung bao bọc toàn bộ các trang (`/`, `/cart`, `/admin`).
 *    - Bọc 2 Context Providers:
 *      + `<ProductProvider>`: Cung cấp kho dữ liệu sản phẩm & CRUD cho toàn bộ cây Component.
 *      + `<CartProvider>`: Cung cấp giỏ hàng cho toàn bộ cây Component.
 *    - Đặt sẵn `Navbar` ở trên, `Footer` ở dưới, và `CartDrawer` sẵn sàng trượt ra khi có yêu cầu.
 * =============================================================================
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-[#034694] selection:text-white">
        {/* Bọc Provider để toàn bộ trang bên trong đều truy cập được State */}
        <ProductProvider>
          <CartProvider>
            {/* Thanh điều hướng cố định phía trên */}
            <Navbar />

            {/* Nội dung thay đổi tùy theo từng trang (page.tsx) */}
            <main className="flex-1">
              {children}
            </main>

            {/* Ngăn kéo giỏ hàng xem nhanh bên phải */}
            <CartDrawer />

            {/* Chân trang */}
            <Footer />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}

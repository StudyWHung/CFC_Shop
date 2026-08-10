import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "Chelsea FC Fan Store - Pride of London | Official Kits & Merch",
  description: "Cửa hàng áo đấu, đồ tập luyện và phụ kiện Chelsea FC chính hãng hàng đầu tại Việt Nam.",
  icons: {
    icon: "/images/chelsea-logo.svg",
    apple: "/images/chelsea-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-[#f8fafc] text-gray-900 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

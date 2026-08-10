"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";

export const GlobalModals: React.FC = () => {
  const { completedOrder, isSuccessModalOpen, closeSuccessModal } = useCart();

  const handleContinueShopping = () => {
    const productsEl = document.getElementById("products-section");
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <OrderSuccessModal
      isOpen={isSuccessModalOpen}
      order={completedOrder}
      onClose={closeSuccessModal}
      onContinueShopping={handleContinueShopping}
    />
  );
};

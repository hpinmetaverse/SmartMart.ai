"use client";
import { useEffect } from "react";

export default function TrackLastViewed({
  productId,
}: {
  productId: string;
}) {
  useEffect(() => {
    if (productId) {
      localStorage.setItem("lastViewedProductId", productId);
    }
  }, [productId]);
  return null;
}

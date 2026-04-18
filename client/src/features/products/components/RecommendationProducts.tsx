"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/layouts/Header";
import { ProductCard } from "@/features/products";
import ProductCardSkeleton from "./RecommendationProductsSkeleton";
import supabaseClient from "@/lib/supabase/client";

export type RecommendationProductsProps =
  React.HTMLAttributes<HTMLDivElement> & {
    currentProductId?: string;
  };

function RecommendationProducts({
  currentProductId,
}: RecommendationProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecommendations = async () => {
      setLoading(true);

      // Determine which product to seed recommendations from:
      // 1. Use the prop if on a product page
      // 2. Fall back to last-viewed product stored in localStorage
      // 3. If neither, pass no productId (API returns top-rated fallback)
      const productId =
        currentProductId ??
        localStorage.getItem("lastViewedProductId") ??
        undefined;

      const url = productId
        ? `/api/recommendations?productId=${productId}&topN=4`
        : `/api/recommendations?topN=4`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Recommendations API error");

        const { ids }: { ids: string[] } = await res.json();

        if (!ids || ids.length === 0) {
          if (!cancelled) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        // Fetch full product data for the returned IDs
        // Include related medias (featuredImage) and collections
        const { data, error } = await supabaseClient
          .from("products")
          .select(
            `
            id, name, slug, description, price, rating, badge,
            featuredImage:medias!featured_image ( id, key, alt ),
            collections!collection ( id, label, slug )
          `
          )
          .in("id", ids);

        if (error) throw error;

        // Preserve the ML-recommended order (Supabase .in() does not guarantee order)
        const productMap = new Map(
          (data ?? []).map((p: any) => [p.id, p])
        );
        const ordered = ids
          .map((id) => productMap.get(id))
          .filter(Boolean);

        if (!cancelled) {
          setProducts(ordered);
          setLoading(false);
        }
      } catch (err) {
        console.error("[RecommendationProducts] Error:", err);
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
      }
    };

    fetchRecommendations();
    return () => {
      cancelled = true;
    };
  }, [currentProductId]);

  if (loading) {
    return (
      <Header heading="We Think You'll Love">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </Header>
    );
  }

  if (products.length === 0) return null;

  return (
    <Header heading="We Think You'll Love">
      <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Header>
  );
}

export default RecommendationProducts;

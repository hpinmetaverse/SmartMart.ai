"use client";
import ProductCard from "@/features/products/components/ProductCard";
import supabaseClient from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

interface RelatedProductsProps {
  currentProductId: string;
}

const FrequentlyBoughtTogether: React.FC<RelatedProductsProps> = ({
  currentProductId,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRelatedProducts = async () => {
      setLoading(true);

      try {
        // 1. Find orders that contain the current product
        const { data: orderLines, error: orderError } = await supabaseClient
          .from("order_lines")
          .select("orderId")
          .eq("product_id", currentProductId);

        if (orderError) {
          console.error("Error fetching order lines:", orderError);
          setLoading(false);
          return;
        }

        if (!orderLines || orderLines.length === 0) {
          // No orders contain this product, show alternative products
          console.log("No orders contain this product, trying similar products");
          await fetchAlternativeProducts(currentProductId);
          return;
        }

        const orderIds = orderLines.map((line) => line.orderId);

        // 2. Find other products in those orders (excluding the current product)
        const { data: relatedOrderLines, error: relatedOrderError } =
          await supabaseClient
            .from("order_lines")
            .select("product_id")
            .in("orderId", orderIds)
            .neq("product_id", currentProductId); // Exclude current product

        if (relatedOrderError) {
          console.error(
            "Error fetching related order lines:",
            relatedOrderError
          );
          setLoading(false);
          return;
        }

        if (!relatedOrderLines || relatedOrderLines.length === 0) {
          console.log("No other products in those orders.");
          await fetchAlternativeProducts(currentProductId);
          return;
        }

        // 3. Find the most frequently bought-together products
        const productCounts: { [productId: string]: number } = {};
        relatedOrderLines.forEach((line) => {
          productCounts[line.product_id] =
            (productCounts[line.product_id] || 0) + 1;
        });

        // Sort products by frequency
        const sortedProductIds = Object.entries(productCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .map(([productId]) => productId);

        // Get the first 4 related products (or fewer if there aren't 4)
        const productIdsToFetch = sortedProductIds.slice(0, 4);

        // 4. Fetch product details for the related products
        const { data: productData, error: productError } = await supabaseClient
          .from("products")
          .select("*")
          .in("id", productIdsToFetch);

        if (productError) {
          console.error(
            "Error fetching related product details:",
            productError
          );
          setLoading(false);
          return;
        }

        // 5. Format products for display
        setRelatedProducts(formatProducts(productData));
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch similar products if frequently bought products are not found
    const fetchAlternativeProducts = async (productId: string) => {
      const { data: currentProduct, error: currentProductError } =
        await supabaseClient
          .from("products")
          .select("price,collection_id")
          .eq("id", productId)
          .single();

      if (currentProductError) {
        console.error("Error fetching current product:", currentProductError);
        setLoading(false);
        return;
      }

      const { price, collection_id } = currentProduct;

      // Fetch products within a price range and different category
      const { data: similarProducts, error: similarProductsError } =
        await supabaseClient
          .from("products")
          .select("*")
          .neq("id", productId)
          .neq("collection_id", collection_id)
          .gte("price", price - 20)
          .lte("price", price + 20)
          .limit(4);

      if (similarProductsError) {
        console.error("Error fetching similar products:", similarProductsError);
        setLoading(false);
        return;
      }
      if (!similarProducts || similarProducts.length === 0) {
        const { data: featuredProducts, error: featuredError } =
          await supabaseClient
            .from("products")
            .select("*")
            .eq("featured", true)
            .limit(2);

        if (featuredError) {
          console.error("Error fetching featured products:", featuredError);
          setRelatedProducts([]);
        } else {
          setRelatedProducts(formatProducts(featuredProducts));
        }
        setLoading(false);
        return;
      }
      setRelatedProducts(formatProducts(similarProducts));
      setLoading(false);
    };
    getRelatedProducts();
  }, [currentProductId]);

  const formatProducts = (products: any) => {
    if (!products) return [];

    return products.map((product) => {
      if (product.featured_image_id == "5")
        product.featuredImage = { key: "shoes.jpg" };
      else if (product.featured_image_id == "4")
        product.featuredImage = { key: "accessories.jpg" };
      else if (product.featured_image_id == "3")
        product.featuredImage = { key: "kids-clothing.jpg" };
      else if (product.featured_image_id == "2")
        product.featuredImage = { key: "womens-clothing.jpg" };
      else if (product.featured_image_id == "1")
        product.featuredImage = { key: "mens-clothing.jpg" };
      return product;
    });
  };

  if (loading) {
    return <p>Loading frequently bought together products...</p>;
  }

  return (
    <>
      <h2>Frequently Bought Together</h2>
      {relatedProducts.length > 0 ? (
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8">
          {relatedProducts.map((item, index) => (
            <ProductCard key={index} product={item} />
          ))}
        </div>
      ) : (
        <p>No frequently bought together products found.</p>
      )}
    </>
  );
};

export default FrequentlyBoughtTogether;

"use client";
import ProductCard from '@/features/products/components/ProductCard';
import supabaseClient from '@/lib/supabase/client';
import React, { useEffect, useState } from 'react';

const CartItems: React.FC = () => {
    const [cartData, setCartData] = useState<any[]>([]);

    const getData = async () => {
        const { data, error } = await supabaseClient.from("carts").select("product_id");

        if (error) {
            console.error(error);
        } else {
            const tempData = [];
            for (let i = 0; i < Math.min(2, data.length); i++) {
                const { data: productData, error: productError } = await supabaseClient.from("products").select("*").eq("id", data[i].product_id);

                if (productError) {
                    console.error(productError);
                } else {
                    if(productData[0].featured_image_id == "5")
                        productData[0].featuredImage = { key: "shoes.jpg" };
                    else if(productData[0].featured_image_id == "4")
                        productData[0].featuredImage = { key: "accessories.jpg" };
                    else if(productData[0].featured_image_id == "3")
                        productData[0].featuredImage = { key: "kids-clothing.jpg" };
                    else if(productData[0].featured_image_id == "2")
                        productData[0].featuredImage = { key: "womens-clothing.jpg" };
                    else if(productData[0].featured_image_id == "1")
                        productData[0].featuredImage = { key: "mens-clothing.jpg" };
                    tempData.push(productData[0]);
                }
            }
            setCartData(tempData);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return <>
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8 ">
            {cartData.map((item, index) => {
                return (
                    <ProductCard key={index} product={item} />
                );
            })}
        </div>
    </>
};

export default CartItems;
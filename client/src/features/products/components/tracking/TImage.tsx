"use client";
import userEvent from "@/lib/userEvents";
import React, { useState, useRef, useEffect } from "react";


interface TImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    track?: boolean;
    productName?: string;
}


function TImage({ track = false, productName = "None", ...props }: TImageProps) {
    const [hovered, setHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);


    const handleMouseEnter = () => {
        setHovered(true);
        timerRef.current = setTimeout(() => {
            if (hovered && track) {
                userEvent("image_hovered", { productName });
            }
        }, 3000); // 3 seconds
    };


    const handleMouseLeave = () => {
        setHovered(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };


    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);


    return (
        <img
            {...props}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
}


export default TImage;

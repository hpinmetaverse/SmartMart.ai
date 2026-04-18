"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link"; // Or your preferred link component
import userEvent from "@/lib/userEvents";


interface TLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
 track?: boolean;
 productName?: string;
 href: string;
}


function TLink({
 track = false,
 productName = "None",
 href,
 children,
 ...props
}: TLinkProps) {
 const [hovered, setHovered] = useState(false);
 const timerRef = useRef<NodeJS.Timeout | null>(null);


 const handleMouseEnter = () => {
  setHovered(true);
  timerRef.current = setTimeout(() => {
   if (hovered && track) {
    userEvent("link_hovered", { productName });
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
  <Link href={href} {...props} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
   {children}
  </Link>
 );
}


export default TLink;

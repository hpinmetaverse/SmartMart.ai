import React from "react";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  containerClassName?: string;
  itemsClassName?: string;
};

function SocialMedias({ containerClassName, itemsClassName }: Props) {
  return (
    <div className={cn("flex gap-x-5", containerClassName)}>
      
    </div>
  );
}

export default SocialMedias;

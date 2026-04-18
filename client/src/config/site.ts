import type { NavItemWithOptionalChildren } from "@/types";

import { slugify } from "@/lib/utils";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "SmartMart",
  description: "Ecommerce Application built with NextJS 14",
  
  mainNav: [
    {
      title: "Shop",
      href: "/shop",
      description: "All the products we have to offer.",
      items: [],
    },
    
    
    {
      title: "Blog",
      href: "https://www.google.com/",
      description: "Read our latest blog posts.",
      items: [],
    },
    {
      title: "Contact",
      href: "https://www.google.com/",
      description: "Read our latest blog posts.",
      items: [],
    },
  ] satisfies NavItemWithOptionalChildren[],
};

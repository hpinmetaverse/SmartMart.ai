import type { SidebarNavItem } from "@/types";

export type DashboardConfig = {
  sidebarNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/seller/dashboard",
      icon: "layoutDashboard",
      items: [],
    },
    {
      title: "Products",
      href: "/seller/products",
      icon: "cart",
      items: [],
    },
    {
      title: "Collections",
      href: "/seller/collections",
      icon: "folder",
      items: [],
    },
    {
      title: "Medias",
      href: "/seller/medias",
      icon: "image",
      items: [],
    },
    {
      title: "Users",
      href: "/seller/users",
      icon: "user",
      items: [],
    },
    {
      title: "Orders",
      href: "/seller/orders",
      icon: "receipt",
      items: [],
    },
  ],
};

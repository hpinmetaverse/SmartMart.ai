import { CartSheet } from "@/features/carts";
import MainFooter from "@/components/layouts/MainFooter";
import Navbar from "@/components/layouts/MainNavbar";
import { ReactNode } from "react";
import { AskAiButton } from "@/components/chat/ask-ai-button";

type Props = { children: ReactNode };

async function StoreLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <AskAiButton/>
      <main className="pt-[50px]">{children}</main>
      <CartSheet />
      <MainFooter />
    </>
  );
}

export default StoreLayout;

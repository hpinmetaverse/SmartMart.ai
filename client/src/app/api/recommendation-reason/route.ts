// client/src/app/api/recommendation-reason/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { productName, currentProductName, productId } = await req.json();

  const cookieStore = cookies();
  const supabase = createClient({ cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Build REAL context from Supabase ──────────────────────────────────
  let realContext = {
    isInCart: false,
    isInWishlist: false,
    recentlyViewed: false,
    recentEvents: [] as string[],
  };

  if (user && productId) {
    const [cartRes, wishlistRes, eventsRes] = await Promise.all([
      supabase
        .from("carts")
        .select("product_id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle(),
      supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle(),
      supabase
        .from("events")
        .select("type, product_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    realContext.isInCart = !!cartRes.data;
    realContext.isInWishlist = !!wishlistRes.data;
    realContext.recentlyViewed =
      eventsRes.data?.some((e: any) => e.product_id === productId) ?? false;
    realContext.recentEvents =
      eventsRes.data?.map((e: any) => e.type) ?? [];
  }

  // ── Build prompt from real context ───────────────────────────────────
  const contextLines: string[] = [];
  if (realContext.isInCart)
    contextLines.push("This product is in the user's cart");
  if (realContext.isInWishlist)
    contextLines.push("This product is in the user's wishlist");
  if (realContext.recentlyViewed)
    contextLines.push("User has previously viewed this product");
  if (realContext.recentEvents.includes("button_click"))
    contextLines.push("User has clicked on fashion items recently");
  if (realContext.recentEvents.includes("image_hovered"))
    contextLines.push("User has shown visual interest in products");
  if (contextLines.length === 0)
    contextLines.push("User is browsing the store");

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system:
      "You are a helpful fashion recommendation assistant. Provide brief, specific reasons why products might be recommended to users based on their browsing or purchasing behaviour. Keep responses under 10 words. Be specific. No markdown.",
    messages: [
      {
        role: "user",
        content:
          `Why is "${productName}" recommended to someone viewing "${currentProductName}"?\n` +
          `Context: ${contextLines.join(". ")}.\n` +
          `Answer in under 10 words.`,
      },
    ],
  });

  return result.toDataStreamResponse();
}
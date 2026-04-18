// client/src/app/api/recommendations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env.mjs";

const ML_API_URL = env.ML_API_URL;

/**
 * Helper: try calling an ML endpoint, return IDs + source label on success,
 * or null on failure (so the caller can try the next strategy).
 */
async function tryMLEndpoint(
  url: string,
  options: RequestInit,
  sourceLabel: string
): Promise<{ ids: string[]; source: string } | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const ids: string[] = await res.json();
    if (!ids || ids.length === 0) return null;
    return { ids, source: sourceLabel };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient({ cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const productId = req.nextUrl.searchParams.get("productId");
  const topN = parseInt(req.nextUrl.searchParams.get("topN") ?? "4", 10);

  // ── Fallback: no product context at all ──────────────────────────────
  if (!productId) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .order("rating", { ascending: false })
      .limit(topN);
    return NextResponse.json({
      ids: data?.map((p) => p.id) ?? [],
      source: "fallback_top_rated",
    });
  }

  // ── Strategy 1: Multi-modal (ml2) — richest, works for all users ─────
  const multiModalResult = await tryMLEndpoint(
    `${ML_API_URL}/recommend/multi-modal/?product_id=${productId}&top_n=${topN}`,
    { method: "POST", cache: "no-store" },
    "multi_modal"
  );
  if (multiModalResult) return NextResponse.json(multiModalResult);

  // ── Strategy 2 (authenticated): Hybrid SVD + TF-IDF ──────────────────
  if (user) {
    const hybridResult = await tryMLEndpoint(
      `${ML_API_URL}/recommend/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_id: user.id,
          top_n: topN,
        }),
        cache: "no-store",
      },
      "hybrid_ml"
    );
    if (hybridResult) return NextResponse.json(hybridResult);
  }

  // ── Strategy 3: Content-based only ───────────────────────────────────
  const contentResult = await tryMLEndpoint(
    `${ML_API_URL}/recommend/content-only/?product_id=${productId}&top_n=${topN}`,
    { method: "POST", next: { revalidate: 300 } },
    "content_based"
  );
  if (contentResult) return NextResponse.json(contentResult);

  // ── Strategy 4: Supabase fallback (top-rated products) ───────────────
  console.error("[/api/recommendations] All ML strategies failed, using Supabase fallback");
  const { data } = await supabase
    .from("products")
    .select("id")
    .order("rating", { ascending: false })
    .limit(topN);
  return NextResponse.json({
    ids: data?.map((p) => p.id) ?? [],
    source: "fallback_top_rated",
  });
}

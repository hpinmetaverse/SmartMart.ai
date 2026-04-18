
import { store } from "@/lib/db/memory-store";
import { findRelevantContent } from "@/lib/ai/embedding";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || "What is JavaScript?";
    
    const allResources = await store.getResources();
    const allEmbeddings = await store.getEmbeddings();
    const similarContent = await findRelevantContent(query);

    return NextResponse.json({
      resourceCount: allResources.length,
      embeddingCount: allEmbeddings.length,
      sampleResources: allResources.slice(0, 2),
      similarContent,
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch test data" },
      { status: 500 }
    );
  }
} 
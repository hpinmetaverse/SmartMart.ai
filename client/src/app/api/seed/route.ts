import { seedResources } from "@/lib/actions/resources";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await seedResources();
    return NextResponse.json({ message: result });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed database" },
      { status: 500 }
    );
  }
} 
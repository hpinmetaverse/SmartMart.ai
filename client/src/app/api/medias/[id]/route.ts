import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/lib/supabase/db";
import { medias } from "@/lib/supabase/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const media = await db.query.medias.findFirst({
    where: eq(medias.id, params.id),
  });

  if (!media)
    return NextResponse.json(
      {
        message: "Media not found.",
      },
      { status: 404 },
    );

  return NextResponse.json(
    {
      data: media,
      preview: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/` + media.key,
    },
    { status: 201 },
  );
}

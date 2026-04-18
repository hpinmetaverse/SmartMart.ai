"use server";

import { env } from "@/env.mjs";
import db from "@/lib/supabase/db";
import { medias } from "@/lib/supabase/schema";
import { mediaSchema } from "@/validations/medias";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import createClient from "@/lib/supabase/server";
import supabaseClient from "@/lib/supabase/client";
export async function POST(request: NextRequest) {

  // const session = await getServerSession(authOptions)
  //   if (!session) return NextResponse.json({}, { status: 401 })
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as z.infer<typeof mediaSchema>;
  const validation = mediaSchema.safeParse(data);

  if (validation.success === false) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  let statusCode = 201;
  let errorMessage = "Unexpected Error";

  const uploadResponse = await Promise.all(
    Object.entries(data).map(async ([index, file]) => {
      const fileExtension = file.type.split("/")[1];
      const key = nanoid() + "." + fileExtension;


      const { data, error } = await supabaseClient.storage.from("media").upload("" + key + file.name, file);
      if (error) {
        statusCode = 500;
        errorMessage = error.message;
        return;
      }
      if (!data) {
        statusCode = 500;
        errorMessage = "No data returned";
        return;
      }
    }),
  );

  return statusCode >= 300
    ? NextResponse.json({ message: errorMessage }, { status: statusCode })
    : NextResponse.json(uploadResponse, { status: statusCode });
}

const fileToStream = async (file: File) => {
  // Upload Image to S3 bucket
  const mimeType = file.type;
  const buffer = Buffer.from(await file.arrayBuffer());

  const imageBuffer = await sharp(buffer);
  const metadata = await imageBuffer.metadata();

  if (mimeType !== "image/gif")
    return {
      mimeType: "image/webp",
      buffer: await sharp(buffer).webp().toBuffer(),
    };

  return {
    mimeType: "image/gif",
    buffer,
  };
};

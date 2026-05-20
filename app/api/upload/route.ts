import { NextRequest, NextResponse } from "next/server";
import { createPresignedUploadUrl, type UploadFolder } from "@/services/storage/upload";

export async function POST(req: NextRequest) {
  const { contentType, fileSizeBytes, folder } = await req.json();

  if (!contentType || !fileSizeBytes || !folder) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await createPresignedUploadUrl(
    folder as UploadFolder,
    contentType,
    fileSizeBytes
  );

  return NextResponse.json(result);
}

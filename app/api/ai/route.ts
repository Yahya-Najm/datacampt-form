import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/services/ai";

export async function POST(req: NextRequest) {
  const { systemPrompt, userMessage, model } = await req.json();

  if (!userMessage) {
    return NextResponse.json({ error: "Missing userMessage" }, { status: 400 });
  }

  const result = await generateCompletion(
    systemPrompt ?? "You are a helpful assistant.",
    userMessage,
    model
  );

  return NextResponse.json({ result });
}

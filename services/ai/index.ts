import { openai } from "@/lib/openai/client";

export async function generateCompletion(
  systemPrompt: string,
  userMessage: string,
  model: string = "gpt-4o"
): Promise<string> {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

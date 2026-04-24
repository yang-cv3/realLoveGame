import { GoogleGenerativeAI } from "@google/generative-ai";
import { SimulateRequest, SimulateResponse } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { SimulateResponseSchema } from "./schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function simulate(req: SimulateRequest): Promise<SimulateResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: buildSystemPrompt(req.relation_type, req.partner_tendency),
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const userPrompt = buildUserPrompt(req.recent_snippet, req.user_situation);

  try {
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    console.log("[gemini] raw response:", text.slice(0, 200));
    const parsed = JSON.parse(text);
    return SimulateResponseSchema.parse(parsed);
  } catch (err) {
    console.error("[gemini] error:", err);
    throw err;
  }
}

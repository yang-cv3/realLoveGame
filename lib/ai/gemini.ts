import { GoogleGenerativeAI } from "@google/generative-ai";
import { SimulateRequest, SimulateResponse } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { SimulateResponseSchema, GeminiResponseSchema } from "./schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function simulate(req: SimulateRequest): Promise<SimulateResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: buildSystemPrompt(req.relation_type, req.partner_tendency),
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: GeminiResponseSchema as any,
    },
  });

  const userPrompt = buildUserPrompt(req.recent_snippet, req.user_situation);

  try {
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    console.log("[gemini] raw response:", text.slice(0, 200));
    const parsed = JSON.parse(text);
    const validated = SimulateResponseSchema.parse(parsed);
    // 선택지 역할 고정: 0=관계상승(BEST), 1=관계유지, 2=관계파탄(WORST)
    return { ...validated, best_index: 0, worst_index: 2 };
  } catch (err) {
    console.error("[gemini] error:", err);
    throw err;
  }
}

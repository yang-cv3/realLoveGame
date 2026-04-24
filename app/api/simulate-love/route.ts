import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { simulate } from "@/lib/ai/gemini";

const RequestSchema = z.object({
  relation_type: z.enum(["배우자", "애인", "썸"]),
  partner_tendency: z.enum(["EF", "IF", "ET", "IT", "UNKNOWN"]),
  recent_snippet: z.string().min(1).max(8000),
  user_situation: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RequestSchema.parse(body);
    const result = await simulate(validated);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 형식이 올바르지 않아요.", details: err.issues },
        { status: 400 }
      );
    }
    console.error("[simulate-love] error:", err);
    return NextResponse.json(
      { error: "AI 분석 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

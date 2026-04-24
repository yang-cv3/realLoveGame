import { z } from "zod";

export const ReplyOptionSchema = z.object({
  emoji: z.string(),
  reply_text: z.string(),
  affection_change: z.number().min(-5).max(5),
  anger_level: z.number().min(0).max(10),
  continuation_probability: z.number().min(0).max(100),
  risk_level: z.enum(["낮음", "중간", "높음"]),
  short_prediction: z.string(),
});

export const SimulateResponseSchema = z.object({
  options: z.array(ReplyOptionSchema).length(3),
  best_index: z.number().min(0).max(2),
  worst_index: z.number().min(0).max(2),
});

/** Gemini responseMimeType: "application/json" 에 넘길 JSON Schema */
export const GeminiResponseSchema = {
  type: "object",
  properties: {
    options: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          emoji: { type: "string" },
          reply_text: { type: "string" },
          affection_change: { type: "number" },
          anger_level: { type: "number" },
          continuation_probability: { type: "number" },
          risk_level: { type: "string", enum: ["낮음", "중간", "높음"] },
          short_prediction: { type: "string" },
        },
        required: [
          "emoji",
          "reply_text",
          "affection_change",
          "anger_level",
          "continuation_probability",
          "risk_level",
          "short_prediction",
        ],
      },
    },
    best_index: { type: "number" },
    worst_index: { type: "number" },
  },
  required: ["options", "best_index", "worst_index"],
};

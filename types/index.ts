export type RelationType = "배우자" | "애인" | "썸";
export type PartnerTendency = "EF" | "IF" | "ET" | "IT" | "UNKNOWN";
export type RiskLevel = "낮음" | "중간" | "높음";

export interface SimulateRequest {
  relation_type: RelationType;
  partner_tendency: PartnerTendency;
  recent_snippet: string;
  user_situation: string;
}

export interface ReplyOption {
  emoji: string;
  reply_text: string;
  affection_change: number;       // -5 ~ +5
  anger_level: number;            // 0 ~ 10
  continuation_probability: number; // 0 ~ 100
  risk_level: RiskLevel;
  short_prediction: string;
}

export interface SimulateResponse {
  options: ReplyOption[];
  best_index: number;
  worst_index: number;
}

export interface ParsedKakao {
  recent_snippet: string;
  my_name: string;
  partner_name: string;
}

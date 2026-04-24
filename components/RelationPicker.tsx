"use client";
import { RelationType } from "@/types";

const OPTIONS: RelationType[] = ["배우자", "애인", "썸"];
const EMOJI: Record<RelationType, string> = {
  배우자: "💍",
  애인: "❤️",
  썸: "👀",
};

interface Props {
  value: RelationType;
  onChange: (v: RelationType) => void;
}

export default function RelationPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-2">관계 유형</p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 px-3 rounded-xl border-2 font-bold text-sm transition-all ${
              value === opt
                ? "border-pink-500 bg-pink-50 text-pink-600"
                : "border-gray-200 bg-white text-gray-500 hover:border-pink-300"
            }`}
          >
            {EMOJI[opt]} {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";
import { PartnerTendency } from "@/types";

const OPTIONS: { value: PartnerTendency; label: string; desc: string }[] = [
  { value: "EF", label: "감성외향", desc: "표현 풍부, 공감 중시" },
  { value: "IF", label: "감성내향", desc: "감수성 높고 조심스러움" },
  { value: "ET", label: "이성외향", desc: "직설적, 행동 지향" },
  { value: "IT", label: "이성내향", desc: "분석적, 신중함" },
];

interface Props {
  value: PartnerTendency;
  onChange: (v: PartnerTendency) => void;
}

export default function TendencyPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-2">
        상대방 성향{" "}
        <button
          onClick={() => onChange("UNKNOWN")}
          className={`ml-2 text-xs px-2 py-0.5 rounded-full border transition-all ${
            value === "UNKNOWN"
              ? "border-purple-400 bg-purple-50 text-purple-600"
              : "border-gray-200 text-gray-400 hover:border-purple-300"
          }`}
        >
          잘 모름
        </button>
      </p>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`py-2 px-3 rounded-xl border-2 text-left transition-all ${
              value === opt.value
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-white hover:border-purple-300"
            }`}
          >
            <span
              className={`font-bold text-sm block ${
                value === opt.value ? "text-purple-600" : "text-gray-700"
              }`}
            >
              {opt.label}
            </span>
            <span className="text-xs text-gray-400">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SituationInput({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-2">지금 상황</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`예) 오빠가 "알았어 말어" 하고 읽씹 중이야.\n어떻게 답장해야 해?`}
        maxLength={500}
        rows={3}
        className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm resize-none focus:outline-none focus:border-pink-400 transition-all"
      />
      <p className="text-right text-xs text-gray-400 mt-1">{value.length}/500</p>
    </div>
  );
}

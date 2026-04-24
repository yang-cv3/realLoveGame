import { ReplyOption } from "@/types";

interface Props {
  option: ReplyOption;
  isBest: boolean;
  isWorst: boolean;
}

const RISK_COLOR = {
  낮음: "bg-green-100 text-green-700",
  중간: "bg-yellow-100 text-yellow-700",
  높음: "bg-red-100 text-red-700",
};

export default function OptionCard({ option, isBest, isWorst }: Props) {
  const borderClass = isBest
    ? "border-pink-400 shadow-pink-100 shadow-lg"
    : isWorst
    ? "border-gray-300"
    : "border-purple-200";

  return (
    <div className={`relative rounded-2xl border-2 bg-white p-4 flex flex-col gap-3 ${borderClass}`}>
      {/* 배지 */}
      {isBest && (
        <span className="absolute -top-3 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          ✨ BEST
        </span>
      )}
      {isWorst && (
        <span className="absolute -top-3 left-4 bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-full">
          💀 WORST
        </span>
      )}

      {/* 이모지 + 답장 */}
      <div className="flex items-start gap-2 pt-1">
        <span className="text-2xl">{option.emoji}</span>
        <p className="font-bold text-gray-800 text-sm leading-snug">{option.reply_text}</p>
      </div>

      {/* 스탯 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <StatRow
          label="애정 변화"
          value={`${option.affection_change > 0 ? "+" : ""}${option.affection_change}`}
          color={option.affection_change >= 0 ? "text-pink-500" : "text-blue-500"}
        />
        <StatRow
          label="분노 수치"
          value={`${option.anger_level}/10`}
          color={option.anger_level >= 7 ? "text-red-500" : "text-gray-600"}
        />
        <StatRow
          label="대화 지속"
          value={`${option.continuation_probability}%`}
          color="text-purple-500"
        />
        <div className="flex items-center gap-1">
          <span className="text-gray-400">리스크</span>
          <span className={`px-1.5 py-0.5 rounded-full font-bold ${RISK_COLOR[option.risk_level]}`}>
            {option.risk_level}
          </span>
        </div>
      </div>

      {/* 예측 */}
      <p className="text-xs text-gray-500 border-t pt-2 leading-relaxed">
        🔮 {option.short_prediction}
      </p>
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-400">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

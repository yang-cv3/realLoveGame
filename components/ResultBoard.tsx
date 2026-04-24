import { SimulateResponse } from "@/types";
import OptionCard from "./OptionCard";

interface Props {
  result: SimulateResponse;
  onReset: () => void;
}

export default function ResultBoard({ result, onReset }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-lg font-black text-gray-800">🎮 시뮬레이션 결과</p>
        <p className="text-sm text-gray-400 mt-1">3개 선택지 중 하나를 골라봐</p>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {result.options.map((opt, i) => (
          <OptionCard
            key={i}
            option={opt}
            isBest={i === result.best_index}
            isWorst={i === result.worst_index}
          />
        ))}
      </div>

      <button
        onClick={onReset}
        className="mt-2 w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:border-pink-300 hover:text-pink-500 transition-all"
      >
        다시 시뮬레이션하기
      </button>
    </div>
  );
}

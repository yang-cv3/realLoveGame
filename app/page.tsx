"use client";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import RelationPicker from "@/components/RelationPicker";
import TendencyPicker from "@/components/TendencyPicker";
import SituationInput from "@/components/SituationInput";
import ResultBoard from "@/components/ResultBoard";
import { ParsedKakao, PartnerTendency, RelationType, SimulateResponse } from "@/types";
import { anonymize } from "@/lib/privacy/anonymize";

const LOADING_MSGS = [
  "읽씹 확률 계산 중...",
  "지금 답장하면 생존 가능성 분석 중...",
  "상대방 마음 스캔 중...",
  "답장 3초 뒤 미래 시뮬레이션 중...",
  "이 선택의 나비효과 추적 중...",
];

export default function Home() {
  const [parsed, setParsed] = useState<ParsedKakao | null>(null);
  const [relation, setRelation] = useState<RelationType>("애인");
  const [tendency, setTendency] = useState<PartnerTendency>("UNKNOWN");
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = parsed && situation.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!parsed) return;
    setError(null);
    setLoading(true);
    setLoadingMsg(LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)]);
    const snippet = anonymize(parsed.recent_snippet, parsed.my_name, parsed.partner_name);
    try {
      const res = await fetch("/api/simulate-love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relation_type: relation,
          partner_tendency: tendency,
          recent_snippet: snippet,
          user_situation: situation,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "알 수 없는 오류");
      }
      const data: SimulateResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "오류가 발생했어요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSituation("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-10">
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">💘</p>
          <h1 className="text-2xl font-black text-gray-900">오빠 나 살쪘어?</h1>
          <p className="text-sm text-gray-400 mt-1">카톡 대화를 올리면 AI가 최적의 답장을 알려줘</p>
        </div>

        {result ? (
          <ResultBoard result={result} onReset={handleReset} />
        ) : (
          <div className="flex flex-col gap-5">
            <FileUpload onParsed={setParsed} />
            <RelationPicker value={relation} onChange={setRelation} />
            <TendencyPicker value={tendency} onChange={setTendency} />
            <SituationInput value={situation} onChange={setSituation} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                canSubmit
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> {loadingMsg}
                </span>
              ) : (
                "💌 시뮬레이트"
              )}
            </button>

            {!parsed && (
              <p className="text-center text-xs text-gray-400">카카오톡 파일을 먼저 올려주세요</p>
            )}
          </div>
        )}

        <div className="mt-10 text-center text-xs text-gray-400 px-4">
          업로드한 대화는 저장되지 않습니다. 브라우저에서만 처리되며, 시뮬레이션에는 요약된 일부 정보만 사용됩니다.
        </div>
      </div>
    </main>
  );
}

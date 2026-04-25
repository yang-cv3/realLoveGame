"use client";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import RelationPicker from "@/components/RelationPicker";
import TendencyPicker from "@/components/TendencyPicker";
import SituationInput from "@/components/SituationInput";
import ResultBoard from "@/components/ResultBoard";
import { ParsedKakao, PartnerTendency, RelationType, SimulateResponse } from "@/types";
import { anonymize } from "@/lib/privacy/anonymize";
import { parseKakao } from "@/lib/parser/kakao";

const LOADING_MSGS = [
  "읽씹 확률 계산 중...",
  "지금 답장하면 생존 가능성 분석 중...",
  "상대방 마음 스캔 중...",
  "답장 3초 뒤 미래 시뮬레이션 중...",
  "이 선택의 나비효과 추적 중...",
];

const PRESETS: {
  label: string;
  emoji: string;
  file: string;
  relation: RelationType;
  tendency: PartnerTendency;
  situation: string;
}[] = [
  {
    label: "배우자",
    emoji: "💍",
    file: "/dummy_배우자.txt",
    relation: "배우자",
    tendency: "IT",
    situation: "남편이 오늘도 단답만 치고 밥도 혼자 먹었어. 내가 늦는다고 했는데 토라진 것 같아.",
  },
  {
    label: "애인",
    emoji: "💑",
    file: "/dummy_애인.txt",
    relation: "애인",
    tendency: "EF",
    situation: "남친이 또 피곤하다고 만남 취소했어. 지난주에도 그랬거든. 뭔가 식은 것 같아서 불안해.",
  },
  {
    label: "썸",
    emoji: "💭",
    file: "/dummy_썸.txt",
    relation: "썸",
    tendency: "IT",
    situation: "뒤풀이에서 먼저 가버렸어. 관심 있는 건지 없는 건지 모르겠어. 어떻게 문자 보내지?",
  },
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
  const [presetLoading, setPresetLoading] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const canSubmit = parsed && situation.trim().length > 0 && !loading;

  const handlePreset = async (preset: (typeof PRESETS)[0]) => {
    setPresetLoading(preset.label);
    setError(null);
    try {
      const res = await fetch(preset.file);
      const text = await res.text();
      const parsedData = parseKakao(text);
      setParsed(parsedData);
      setRelation(preset.relation);
      setTendency(preset.tendency);
      setSituation(preset.situation);
      setActivePreset(preset.label);
    } catch {
      setError("데모 파일을 불러오는 데 실패했어요.");
    } finally {
      setPresetLoading(null);
    }
  };

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
    setActivePreset(null);
    setParsed(null);
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

            {/* 데모 프리셋 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">⚡ 데모로 빠르게 체험</p>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePreset(preset)}
                    disabled={!!presetLoading}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all active:scale-95 ${
                      activePreset === preset.label
                        ? "border-pink-400 bg-pink-50 text-pink-600"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    <span className="text-xl">
                      {presetLoading === preset.label ? "⏳" : preset.emoji}
                    </span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
              {activePreset && (
                <p className="text-xs text-pink-500 mt-2 text-center font-medium">
                  ✅ {activePreset} 데모 불러왔어! 바로 시뮬레이트 눌러봐
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">또는 직접 올리기</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <FileUpload onParsed={(data) => { setParsed(data); setActivePreset(null); }} />
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
              <p className="text-center text-xs text-gray-400">데모를 선택하거나 카카오톡 파일을 올려주세요</p>
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

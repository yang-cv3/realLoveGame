"use client";
import { useRef, useState } from "react";
import { parseKakao } from "@/lib/parser/kakao";
import { ParsedKakao } from "@/types";

interface Props {
  onParsed: (data: ParsedKakao) => void;
}

export default function FileUpload({ onParsed }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".txt")) {
      setError("카카오톡 내보내기 .txt 파일만 가능해요.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseKakao(text);
      setFileName(file.name);
      onParsed(parsed);
    };
    reader.readAsText(file, "utf-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-2">카카오톡 대화 파일</p>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          fileName
            ? "border-green-400 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-pink-400 hover:bg-pink-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {fileName ? (
          <p className="text-green-600 font-semibold text-sm">✅ {fileName}</p>
        ) : (
          <>
            <p className="text-2xl mb-1">💬</p>
            <p className="text-gray-500 text-sm">
              카카오톡 대화를 드래그하거나 클릭해서 올려주세요
            </p>
            <p className="text-gray-400 text-xs mt-1">.txt 파일만 가능 · 브라우저에서만 처리됨</p>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

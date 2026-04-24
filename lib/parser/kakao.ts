import { ParsedKakao } from "@/types";

const DATE_LINE = /^-{10,}.*-{10,}$/;
const SYSTEM_MSG = /^.*(님이 나갔습니다|님이 들어왔습니다|저장된 메시지|채팅방을|통화|사진|동영상|파일).*/;
const MSG_LINE = /^\[(.+?)\] \[(오전|오후) (\d+:\d+)\] (.+)$/;

/**
 * 카카오톡 내보내기 .txt 파일을 파싱한다.
 * - 최근 200줄만 추출
 * - 시스템 메시지·날짜 구분선 제거
 * - 이름을 추정한다 (헤더 또는 첫 발화자 기준)
 */
export function parseKakao(raw: string): ParsedKakao {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  // 헤더에서 내 이름 추출 시도 (예: "지노님과 카카오톡 대화" 형식)
  let myName = "";
  const headerMatch = lines[0]?.match(/^(.+?)님과 카카오톡 대화/);
  if (headerMatch) myName = headerMatch[1];

  const messages: string[] = [];
  const speakerSet = new Set<string>();

  for (const line of lines) {
    if (DATE_LINE.test(line)) continue;
    if (SYSTEM_MSG.test(line)) continue;

    const m = MSG_LINE.exec(line);
    if (m) {
      const speaker = m[1];
      const time = `${m[2]} ${m[3]}`;
      const text = m[4];
      speakerSet.add(speaker);
      messages.push(`[${speaker}] ${time} ${text}`);
    }
  }

  // 이름 추정: 헤더에서 못 잡았으면 첫 발화자
  const speakers = Array.from(speakerSet);
  if (!myName && speakers.length > 0) myName = speakers[0];
  const partnerName = speakers.find((s) => s !== myName) ?? "";

  // 최근 200줄
  const recent = messages.slice(-200);
  return {
    recent_snippet: recent.join("\n"),
    my_name: myName,
    partner_name: partnerName,
  };
}

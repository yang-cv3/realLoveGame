/**
 * 카카오톡 파싱 결과에서 이름을 A, B로 치환한다.
 * 서버로 보내기 전에 반드시 호출한다.
 */
export function anonymize(
  snippet: string,
  myName: string,
  partnerName: string
): string {
  let result = snippet;
  if (myName) result = result.replaceAll(myName, "A");
  if (partnerName) result = result.replaceAll(partnerName, "B");
  return result;
}

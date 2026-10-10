// Event fan-out for the membership case. Labels quote the published case text;
// the two subscriber cards stand for "each service", not a service count.
export const fanout = {
  title: "링커 통합회원",
  subtitle: "회원 이벤트 연동",
  label: "통합회원 변경 이벤트를 서비스별 DB에 반영하는 구조",
  source: { name: "회원 변경", detail: "가입·전환·정보 변경" },
  topic: { name: "AWS SNS Topic", detail: "이벤트 게시" },
  subscriber: "구독 서비스",
  caption: "서비스별로 자체 DB에 반영 · DB 플래그로 중복 처리 방지",
} as const;

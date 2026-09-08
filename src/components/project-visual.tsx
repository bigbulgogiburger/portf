import Image from "next/image";
import { ArrowRight } from "./icons";
const screens: Record<string, {file:string; alt:string}> = {
  "field-service": {file:"stanley-original-1",alt:"Stanley CS 관리자 대시보드"},
  "platform-operations": {file:"surien-1",alt:"수리엔 엔지니어 업무용 모바일 앱"},
  payments: {file:"skytab-1",alt:"스카이탭 학생·선생님 수업 화면"},
  membership: {file:"linker-1",alt:"링커 모바일 서비스 화면"},
};
export function ProjectVisual({id, eager=false}:{id:string; eager?:boolean}) {
  const screen=screens[id];
  if(screen) return <div className={`project-art product-screen screen-${id}`}><Image src={`/projects/${screen.file}.png`} alt={screen.alt} loading={eager ? "eager" : "lazy"} fill sizes="(max-width: 760px) 90vw, 600px" style={{objectFit:"contain"}} /></div>;
  const harness=id==="harness";
  return <div className={`project-art process-art ${harness?"harness-art":"agent-art"}`} aria-label={harness?"검증한 코드와 커밋 대상 비교 흐름":"접수 초안 생성과 사용자 등록 흐름"}>
    <div className="process-heading">{harness?"jira-harness":"CS AI Agent"}<span>{harness?"코드 검증 흐름":"신규 접수 흐름"}</span></div>
    <div className="process-steps">{(harness?["테스트·리뷰","Git tree 기록","커밋 대상 비교"]:["권한 내 조회","접수 초안","사용자 등록"]).map((s,i)=><div key={s}><strong>{s}</strong>{i<2&&<ArrowRight size={18}/>}</div>)}</div>
    <p>{harness?"차단 모드: 미검증·실패·코드 변경 시 재검증":"초안 유효시간 5분 · 등록 전 사용자 확인"}</p>
  </div>;
}

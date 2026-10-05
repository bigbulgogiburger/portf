import Image from "next/image";
import { ProcessTrace } from "./process-trace";
const screens: Record<string, {file:string; alt:string}> = {
  "field-service": {file:"field-service-1",alt:"글로벌 전동공구 브랜드 A/S 관리자 대시보드 (고객사 정보 가림)"},
  "platform-operations": {file:"surien-1",alt:"수리엔 엔지니어 업무용 모바일 앱"},
  payments: {file:"skytab-1",alt:"스카이탭 학생·선생님 수업 화면"},
  membership: {file:"linker-1",alt:"링커 모바일 서비스 화면"},
};
export function ProjectVisual({id, eager=false}:{id:string; eager?:boolean}) {
  const screen=screens[id];
  if(screen) return <div className={`project-art product-screen screen-${id}`}><Image src={`/projects/${screen.file}.png`} alt={screen.alt} loading={eager ? "eager" : "lazy"} fill sizes="(max-width: 760px) 90vw, 600px" style={{objectFit:"contain"}} /></div>;
  return <ProcessTrace id={id === "harness" ? "harness" : "service-agent"} controls={eager} />;
}

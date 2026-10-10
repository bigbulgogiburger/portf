import Image from "next/image";
import { ProcessTrace } from "./process-trace";
import { MigrationArt } from "./migration-art";
import { FanoutArt } from "./fanout-art";
import type { TraceId } from "@/lib/trace";

type Screen = { file: string; alt: string; caption: string };
// The A/S dashboard is the owner's own screen work, so it is the project visual.
const dashboard: Screen = {file:"field-service-1",alt:"글로벌 전동공구 브랜드 A/S 관리자 대시보드 (고객사 정보 가림)",caption:"직접 개발한 A/S 대시보드 · 집계값은 테스트 데이터 · 고객사 정보 가림"};
// The home card has no caption under the image, so it carries a short notice.
const dashboardNote = "테스트 데이터 · 고객사 정보 가림";
// Other service screens only give context on case pages.
const contexts: Record<string, Screen> = {
  payments: {file:"skytab-1",alt:"스카이탭 학생·선생님 수업 화면",caption:"서비스 맥락 · 학생과 선생님이 사용하는 스카이탭 수업 화면"},
  membership: {file:"linker-1",alt:"링커 모바일 서비스 화면",caption:"서비스 맥락 · 링커 모바일 앱 화면"},
};
const traceIds: Record<string, TraceId> = {payments:"payments",harness:"harness","service-agent":"service-agent"};
export function visualCaption(id: string): string {
  return id === "field-service" ? dashboard.caption : "핵심 흐름 · 이해를 돕기 위해 단순화한 개념도";
}
function Screenshot({screen, className, eager, note}:{screen:Screen; className:string; eager:boolean; note?:string}) {
  return <div className={`project-art product-screen ${className}`}><Image src={`/projects/${screen.file}.png`} alt={screen.alt} loading={eager ? "eager" : "lazy"} fill sizes="(max-width: 760px) 90vw, 600px" style={{objectFit:"contain"}} />{note && <span className="screen-note">{note}</span>}</div>;
}
export function ProjectVisual({id, eager=false}:{id:string; eager?:boolean}) {
  if(id==="field-service") return <Screenshot screen={dashboard} className="screen-field-service" eager={eager} note={eager ? undefined : dashboardNote} />;
  if(id==="platform-operations") return <MigrationArt controls={eager} />;
  if(id==="membership") return <FanoutArt controls={eager} />;
  return <ProcessTrace id={traceIds[id]} controls={eager} />;
}
// Service screen shown under the case-study visual, when the project has one.
export function ServiceContext({id}:{id:string}) {
  const screen=contexts[id];
  if(!screen) return null;
  return <figure className="service-context"><Screenshot screen={screen} className={`screen-${id}`} eager={false} /><figcaption>{screen.caption}</figcaption></figure>;
}

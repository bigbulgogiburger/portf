import Link from "next/link";
import { ViewTransition } from "react";
import { profile, projects, career, capabilities, assistantPreview, careerYears, education, certifications } from "@/data/portfolio";
import { Orbit } from "@/components/orbit";
import { Reveal } from "@/components/reveal";
import { Nav } from "@/components/nav";
import { ProjectVisual } from "@/components/project-visual";
import { Chat, ChatPrompts } from "@/components/chat";
import { SkillList } from "@/components/skill-list";
import { AnswerPreview } from "@/components/answer-preview";
import { ArrowUpRight, Github, Download, Mail } from "@/components/icons";

// Daily regeneration keeps the years-of-experience line current between deploys.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">본문으로 이동</a>
      <Nav />
      <Reveal />
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-meta"><span><i className="status-dot" /> BACKEND ENGINEER × AI BUILDER</span><span>PORTFOLIO / 2026</span></div>
          <div className="hero-content">
            <div className="hero-copy">
              <h1 id="hero-title"><span className="hero-role">편도훈 · Java·Spring 백엔드 개발자</span>{" "}<span className="hero-line"><span>설계에서 배포까지,</span></span>{" "}<span className="hero-line"><span>그다음의 운영까지.</span></span></h1>
              <p className="hero-description">2021년 5월부터 만 {careerYears()}년, 결제·회원·A/S 서비스를 개발해 왔습니다.<br />현재 DB Inc.에서 백엔드 개발·PM을 맡고,<br className="mobile-break" /> <span className="nowrap">CS AI Agent를</span> 운영 환경에 도입했습니다.</p>
              <p className="hero-stack">Java · Spring Boot · JPA · MySQL · Redis · AWS · LLM API</p>
              <div className="hero-actions">
                <a className="button primary" href="#work">프로젝트 살펴보기 <ArrowUpRight size={19} /></a>
                <a className="text-link" href="/dohoon-portfolio.pdf" download><Download size={17} /> PDF 다운로드</a>
              </div>
            </div>
            <Orbit />
          </div>
          <div className="proof-grid" data-reveal>
            <Link href="/projects/platform-operations"><span className="proof-number"><small>약</small> 50<span>개 API</span></span><p>Next.js → Spring Boot 이관</p></Link>
            <Link href="/projects/platform-operations"><span className="proof-number"><small>약</small> 1시간 <span>→</span> <small>약</small> 10분</span><span className="proof-bars" aria-hidden="true"><span>이전<b /></span><span>현재<b /></span></span><p>배포 자동화 · 서버 2대 기준</p></Link>
            <Link href="/projects/membership"><span className="proof-number"><small>약</small> 1만<span>명</span></span><p>통합회원 전환 완료 · DB 집계 기준</p></Link>
          </div>
        </section>
        <section className="work-section" id="work"><div className="container">
          <div className="section-kicker"><span>01 / PROJECTS</span><span>설계 판단과 구현 결과</span></div>
          <div className="section-heading" data-reveal><h2><span className="display-en">Selected work</span>주요 프로젝트<span className="lime">.</span></h2><p>고객사 업무 시스템부터 AI 도구와 운영 개선까지.<br />각 프로젝트에서 맡은 일과 해결 과정을 정리했습니다.</p></div>
          <div className="project-grid">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className={`project-card accent-${p.accent}`} aria-labelledby={`project-${p.id}-title`} data-reveal>
                <div className="project-art-wrap"><ViewTransition name={`project-${p.id}`} share="morph" default="none"><ProjectVisual id={p.id} /></ViewTransition><span className="project-index">{p.number} / {String(projects.length).padStart(2,"0")}</span><span className="project-open"><ArrowUpRight size={24} /></span></div>
                <div className="project-copy">
                  <div className="project-label"><span className="eyebrow">{p.category}</span><span className="project-status">{p.status}</span></div>
                  <h3 id={`project-${p.id}-title`}>{p.title}</h3><p className="project-subtitle">{p.subtitle}</p><p className="project-summary">{p.summary}</p>
                  <p className="project-evidence">{p.metric}</p>
                  <dl className="project-facts"><div><dt>담당</dt><dd>{p.role}</dd></div><div><dt>핵심 판단</dt><dd>{p.highlight}</dd></div></dl>
                  <div className="tag-list">{p.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div></section>
        <section className="intro-section container" id="about" data-reveal>
          <div className="section-kicker"><span>02 / ABOUT</span><span>개발·PM 겸임</span></div>
          <div className="intro-grid"><h2>업무 규칙을 확인하고,<br />직접 구현합니다.</h2><div><p>수리 플랫폼에서 고객사와 요구사항을 협의하고, DB·API·화면을 개발하고 있습니다. 설계 과정에서는 누가 어떤 데이터를 조회·수정할 수 있는지, 기존 데이터가 바뀌면 과거 정산 내역을 어떻게 유지할지 같은 업무 규칙을 구체적으로 확인합니다.</p><p className="muted">운영 중에는 외부 API 호출, 배포 과정, 요청 추적에서 문제를 찾아 개선했습니다. AI를 적용할 때도 업무 도구의 권한과 코드 검증 결과를 확인할 기준을 함께 구현했습니다.</p></div></div>
        </section>
        <section className="career-section container" id="experience" data-reveal>
          <div className="section-kicker"><span>03 / CAREER</span><span>2021.05 – 현재</span></div>
          <div className="career-grid"><div><h2>경력</h2><p className="muted">교육지대(주) 경력은 주식회사 링커 → 플랫비 주식회사 → 교육지대(주)로 법인 합병 승계된 하나의 재직(2021.05~2023.11)입니다. 같은 기간 링커 서비스 개발을 계속 담당했습니다.</p><dl className="career-extra"><div><dt>학력</dt><dd>{education.school} {education.major} · {education.period}</dd></div><div><dt>자격</dt><dd>{certifications.map((c) => `${c.name} (${c.date})`).join(" · ")}</dd></div></dl><a className="text-link" href="/dohoon-portfolio.pdf" download><Download size={16}/> 포트폴리오 PDF</a></div><div className="career-list">{career.map((c,i)=><article key={c.company}><div className="career-date"><i className={i===0?"current":""}/>{c.period}</div><h3>{c.company}<span>{c.role}</span></h3><p>{c.body}</p></article>)}</div></div>
        </section>
        <section className="capability-section container" data-reveal>
          <div className="section-kicker"><span>04 / TECHNOLOGY</span><span>실무에 사용한 기술</span></div>
          <div className="section-heading"><h2>기술과 적용 경험</h2></div>
          <div className="capability-grid">{capabilities.map((c,i)=><div key={c.title}><span className="capability-number">0{i+1}</span><h3>{c.title}</h3><p>{c.caption}</p><SkillList skills={c.skills}/></div>)}</div>
        </section>
        <section className="agent-section container" id="assistant" data-reveal>
          <div className="agent-promo"><div className="eyebrow">PORTFOLIO ASSISTANT</div><h2>경력·프로젝트 질문</h2><p>공개된 프로젝트 본문을 바탕으로 답변합니다. 담당 역할과 구현 내용은 각 프로젝트에서도 확인할 수 있습니다.</p><a className="text-link" href="#contact">이메일로 문의 <ArrowUpRight size={18}/></a></div><div className="agent-side"><AnswerPreview question={assistantPreview.question} answer={assistantPreview.answer}/><ChatPrompts/></div>
        </section>
        <section className="contact-section" id="contact"><div className="container"><div className="section-kicker"><span>05 / CONTACT</span><span>편도훈</span></div><h2><span className="display-en">Let’s build<span className="lime">.</span></span><span className="contact-invitation">채용·협업 문의를 기다립니다.</span></h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight/></a><div className="contact-links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a><a href="/dohoon-portfolio.pdf" download><Download size={17}/> 포트폴리오 PDF</a><a href={`mailto:${profile.email}`}><Mail size={17}/> 이메일</a></div></div></section>
      </main>
      <footer className="container footer"><span>© 2026 DOHOON PYUN</span><a href="/privacy">AI 이용 안내</a><a href="#main">맨 위로 ↑</a></footer>
      <Chat/>
    </>
  );
}

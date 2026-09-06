import Link from "next/link";
import { profile, projects, career, capabilities } from "@/data/portfolio";
import { Nav } from "@/components/nav";
import { Orbit } from "@/components/orbit";
import { Reveal } from "@/components/reveal";
import { ProjectVisual } from "@/components/project-visual";
import { Chat } from "@/components/chat";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Github,
  Download,
  Mail,
  Sparkles,
} from "@/components/icons";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <Nav />
      <Reveal />
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-meta">
            <span>
              <i className="status-dot" /> BACKEND ENGINEER × AI BUILDER
            </span>
            <span>PORTFOLIO — 2026</span>
          </div>
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow">편도훈 · DOHOON PYUN</p>
              <h1 id="hero-title">
                생각을 구조로.
                <br />
                <span>AI를 서비스로.</span>
              </h1>
              <p className="hero-description">
                AI 서비스를 만드는 백엔드 엔지니어.
                <br />
                견고한 백엔드 위에, 실제로 작동하는 AI를 만듭니다.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  프로젝트 살펴보기 <ArrowUpRight size={19} />
                </a>
                <a className="text-link" href="#contact">
                  함께 일하기 <ArrowRight size={17} />
                </a>
              </div>
              <div className="hero-signature">
                <span className="signature-line" />
                <p>
                  설계에서 배포까지.
                  <br />
                  <strong>그리고, 그다음의 운영까지.</strong>
                </p>
              </div>
            </div>
            <Orbit />
          </div>
          <div className="hero-bottom">
            <a href="#work">
              <ArrowDown size={16} /> SCROLL TO EXPLORE
            </a>
            <span>JAVA / SPRING / AI AGENT / DEVOPS</span>
          </div>
        </section>
        <div className="tech-ribbon" aria-hidden="true">
          <div>
            BACKEND ENGINEERING <span>✳</span> APPLIED ARTIFICIAL INTELLIGENCE{" "}
            <span>✳</span> BUILT FOR PRODUCTION <span>✳</span> SYSTEM THINKING{" "}
            <span>✳</span>
          </div>
        </div>
        <section className="intro-section container" id="about" data-reveal>
          <div className="section-kicker">
            <span>01 / THE APPROACH</span>
            <span className="small-star">✳</span>
          </div>
          <div className="intro-grid">
            <h2>
              코드의 완성은
              <br />
              <span className="muted">서비스의 시작이니까.</span>
            </h2>
            <div>
              <p>
                결제와 회원처럼 틀리면 안 되는 백엔드를 만들었습니다. 이제는 그
                경험 위에 AI를 연결합니다.
              </p>
              <p className="muted">
                새로운 기술을 도입하는 데서 멈추지 않습니다. 업무의 맥락을
                이해하고, 실패를 다루고, 배포 이후까지 책임지는 것. 제가
                개발하는 방식입니다.
              </p>
            </div>
          </div>
          <div className="proof-grid">
            <div>
              <span className="proof-number">
                2021<span>→</span>
              </span>
              <p>백엔드에서 AI 서비스까지</p>
              <small>결제 · 회원 · 업무 플랫폼</small>
            </div>
            <div>
              <span className="proof-number">
                8<span> stages</span>
              </span>
              <p>AI 개발 워크플로 직접 설계</p>
              <small>요구사항부터 품질 검증까지</small>
            </div>
            <div>
              <span className="proof-number">
                4<span> products</span>
              </span>
              <p>자작 harness를 실무에 적용</p>
              <small>플랫폼 · CS · 홈페이지 · App</small>
            </div>
          </div>
        </section>
        <section className="work-section container" id="work">
          <div className="section-kicker" data-reveal>
            <span>02 / SELECTED WORK</span>
            <span>2021 — PRESENT</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              말보다,
              <br />
              <span className="serif">만들어낸 것들.</span>
            </h2>
            <p>
              문제를 정의하고, 구조를 설계하고, 결과를 만듭니다.
              <br />
              다섯 개의 프로젝트에 담긴 개발의 과정.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={`project-card accent-${project.accent} ${i === 0 ? "featured" : ""}`}
                data-reveal
              >
                <div className="project-art-wrap">
                  <ProjectVisual id={project.id} />
                  <span className="project-index">{project.number} / 05</span>
                  <span className="project-open">
                    <ArrowUpRight size={24} />
                  </span>
                </div>
                <div className="project-copy">
                  <span className="eyebrow">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-summary">{project.summary}</p>
                  <div className="tag-list">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="agent-section container" id="assistant" data-reveal>
          <div className="agent-promo">
            <div className="eyebrow">
              <Sparkles size={15} /> MEET MY AI ASSISTANT
            </div>
            <h2>
              궁금한 건,
              <br />
              직접 물어보세요<span className="lime">.</span>
            </h2>
            <p>
              어떤 백엔드를 만들었는지, AI를 어떻게 적용했는지.
              <br />
              공개된 프로젝트를 바탕으로 제 AI가 소개해 드립니다.
            </p>
            <a className="text-link" href="#contact">
              직접 이야기하고 싶다면 <ArrowUpRight size={18} />
            </a>
          </div>
          <Chat embedded />
        </section>
        <section className="capability-section container" data-reveal>
          <div className="section-kicker">
            <span>03 / MY TOOLKIT</span>
            <span>RIGHT TOOLS. REAL SOLUTIONS.</span>
          </div>
          <div className="section-heading">
            <h2>
              필요한 기술을,
              <br />
              제대로.
            </h2>
            <p>기술의 이름보다, 그 기술로 해결한 문제를 이야기합니다.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map((c, i) => (
              <div key={c.title}>
                <span className="capability-number">0{i + 1}</span>
                <h3>
                  {c.title}
                  <ArrowUpRight size={22} />
                </h3>
                <p>{c.caption}</p>
                <ul>
                  {c.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section
          className="career-section container"
          id="experience"
          data-reveal
        >
          <div className="section-kicker">
            <span>04 / THE JOURNEY</span>
            <span>계속 쌓아가는 경험</span>
          </div>
          <div className="career-grid">
            <div>
              <h2>
                하나씩 쌓아,
                <br />
                <span className="muted">더 넓게 연결합니다.</span>
              </h2>
              <p className="muted">
                회원과 결제에서 업무 플랫폼으로.
                <br />
                백엔드에서 AI 서비스로.
              </p>
              <a className="text-link" href="/dohoon-portfolio.pdf" download>
                <Download size={16} /> 포트폴리오 PDF
              </a>
            </div>
            <div className="career-list">
              {career.map((item, i) => (
                <article key={item.company}>
                  <div className="career-date">
                    <i className={i === 0 ? "current" : ""} />
                    {item.period}
                  </div>
                  <h3>
                    {item.company}
                    <span>{item.role}</span>
                  </h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="container" data-reveal>
            <div className="section-kicker">
              <span>
                <i className="status-dot" /> LET’S BUILD WHAT’S NEXT
              </span>
              <span>05 / CONTACT</span>
            </div>
            <h2>
              다음의 좋은 서비스,
              <br />
              <span>함께 만들까요?</span>
            </h2>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight />
            </a>
            <div className="contact-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={17} /> GitHub <ArrowUpRight size={15} />
              </a>
              <a href="/dohoon-portfolio.pdf" download>
                <Download size={17} /> 포트폴리오 PDF
              </a>
              <a href={`mailto:${profile.email}`}>
                <Mail size={17} /> 이메일 연락하기
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <a className="wordmark" href="#main">
          d<span>h</span>
          <i />
        </a>
        <span>© {new Date().getFullYear()} DOHOON PYUN</span>
        <span>THOUGHTFULLY ENGINEERED.</span>
        <a href="/privacy">AI 이용 안내</a>
        <a href="#main" aria-label="맨 위로">
          BACK TO TOP ↑
        </a>
      </footer>
      <Chat />
    </>
  );
}

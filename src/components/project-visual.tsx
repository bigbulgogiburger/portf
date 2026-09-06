import { Layers, Cpu, Network, ShieldCheck, ArrowRight } from "./icons";
export function ProjectVisual({ id }: { id: string }) {
  if (id === "service-agent")
    return (
      <div className="project-art agent-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="agent-path" />
        <div className="visual-node query-node">
          <span className="node-icon">?</span>
          <span>수리 접수 상태를 알려줘</span>
        </div>
        <div className="agent-core">
          <Cpu size={32} />
          <span>CS AGENT</span>
          <small>CONTEXT → ACTION</small>
        </div>
        <div className="visual-node tool-node">
          <ShieldCheck size={17} />
          <span>권한 확인 · 도구 실행</span>
          <i />
        </div>
        <div className="visual-note">DESIGNED FOR REAL OPERATIONS</div>
      </div>
    );
  if (id === "harness")
    return (
      <div className="project-art harness-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="terminal-window">
          <div className="terminal-bar">
            <i />
            <i />
            <i />
            <span>workflow / quality-gate</span>
          </div>
          <div className="terminal-content">
            <p>
              <b>❯</b> harness run
            </p>
            <p className="terminal-muted">Requirement → Implementation</p>
            <p>
              <span className="code-line" /> Backend review <em>PASS</em>
            </p>
            <p>
              <span className="code-line" /> Security review <em>PASS</em>
            </p>
            <p>
              <span className="code-line" /> Integration check <em>PASS</em>
            </p>
            <div className="terminal-result">
              <ShieldCheck size={16} /> Ready to commit <span>↗</span>
            </div>
          </div>
        </div>
      </div>
    );
  if (id === "field-service")
    return (
      <div className="project-art field-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="stack-layer layer-back" />
        <div className="stack-layer layer-middle" />
        <div className="stack-layer layer-front">
          <Layers size={28} />
          <b>SERVICE PLATFORM</b>
          <div className="mini-cells">
            <span>접수</span>
            <span>수리</span>
            <span>정산</span>
          </div>
          <small>DOMAIN · STATE · PERMISSION</small>
        </div>
      </div>
    );
  if (id === "payments")
    return (
      <div className="project-art payment-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="payment-card">
          <div>
            <span>PAYMENT SERVICE</span>
            <ShieldCheck size={20} />
          </div>
          <b>결제부터 환불까지.</b>
          <span>CONSISTENCY BY DESIGN</span>
          <hr />
          <div>
            <small>Webhook</small>
            <ArrowRight size={16} />
            <small>Verify</small>
            <ArrowRight size={16} />
            <small>Retry</small>
          </div>
        </div>
      </div>
    );
  return (
    <div className="project-art member-art" aria-hidden="true">
      <div className="art-grid" />
      <div className="network-orbit orbit-a" />
      <div className="network-orbit orbit-b" />
      <div className="network-core">
        <Network size={28} />
        <b>EVENT BUS</b>
        <small>AWS SNS</small>
      </div>
      <span className="satellite sat-a">회원</span>
      <span className="satellite sat-b">Q&A</span>
      <span className="satellite sat-c">서비스</span>
    </div>
  );
}

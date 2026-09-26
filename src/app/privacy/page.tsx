import Link from "next/link";
export const metadata = { title: "AI 이용 안내" };
export default function Privacy() {
  return (
    <main className="container policy-page">
      <Link className="text-link" href="/">
        ← 홈으로
      </Link>
      <h1>AI 이용 안내</h1>
      <h2>포트폴리오를 소개하는 AI입니다.</h2>
      <p>
        편도훈 본인이 아닌 AI 어시스턴트입니다. 공개된 경력과 프로젝트를
        바탕으로 답변하며, 답변에 오류가 있을 수 있습니다. 정확한 내용은 연결된
        프로젝트와 이메일로 확인해 주세요.
      </p>
      <h2>대화는 어떻게 처리되나요?</h2>
      <p>
        입력한 질문과 이 대화의 이전 질문·답변을 답변 생성에 필요한 정보로
        OpenAI에 전송합니다.
        이름·연락처·회사 기밀 등 민감한 정보를 입력하지 마세요. 사이트는 대화를
        데이터베이스나 브라우저 저장소에 저장하지 않으며, 새로고침하거나 다른
        페이지로 이동하면 화면의 대화가 사라집니다.
      </p>
      <p>
        답변을 API에 저장하는 옵션은 끄고 요청합니다. 다만 제공업체가 보안·오용
        방지를 위해 정보를 보관할 수 있습니다. 처리 정책은{" "}
        <a
          href="https://platform.openai.com/docs/guides/your-data"
          target="_blank"
          rel="noreferrer"
        >
          OpenAI의 데이터 안내
        </a>
        에서 확인할 수 있습니다.
      </p>
      <h2>사용량 제한</h2>
      <p>
        안정적인 서비스를 위해 질문 길이, 대화 길이, 답변 길이와 요청 빈도를
        제한합니다. Vercel은 요청 처리와 보안을 위해 IP 등 접속 정보를 처리할 수
        있습니다. 별도의 광고·행동 분석 도구는 사용하지 않습니다.
      </p>
      <h2>문의</h2>
      <a href="mailto:dohoon321@gmail.com">dohoon321@gmail.com</a>
    </main>
  );
}

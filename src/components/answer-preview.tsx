// Example exchange quoted from the published project text.
export function AnswerPreview({ question, answer }: { question: string; answer: string }) {
  return (
    <figure className="answer-preview">
      <figcaption>답변 예시 · 프로젝트 본문 인용</figcaption>
      <div className="chat-message user">
        <span>질문</span>
        <p>{question}</p>
      </div>
      <div className="chat-message assistant">
        <span>도훈의 AI</span>
        <p>{answer}</p>
      </div>
    </figure>
  );
}

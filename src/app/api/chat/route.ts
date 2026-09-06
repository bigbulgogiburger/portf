import OpenAI from "openai";
import { checkRateLimit } from "@vercel/firewall";
import { projects } from "@/data/portfolio";
import {
  answerSchema,
  instructions,
  localRateLimit,
  validateMessages,
} from "@/lib/chat";

export const runtime = "nodejs";
export const maxDuration = 30;
const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number) =>
  Response.json({ error }, { status, headers });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return fail("이 사이트에서 질문을 보내 주세요.", 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return fail("올바른 질문 형식이 필요합니다.", 415);
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > 64000)
    return fail("대화가 너무 깁니다. 새 대화를 시작해 주세요.", 413);
  let data: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail("질문을 입력해 주세요.", 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 64000) {
        await reader.cancel();
        return fail("대화가 너무 깁니다.", 413);
      }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return fail("질문 형식을 확인해 주세요.", 400);
  }
  const messages = validateMessages((data as { messages?: unknown })?.messages);
  if (!messages)
    return fail(
      "질문은 800자 이내로 입력하고, 긴 대화는 새로 시작해 주세요.",
      400,
    );
  if (!process.env.OPENAI_API_KEY)
    return fail(
      "AI 어시스턴트를 준비하고 있어요. 지금은 프로젝트 페이지를 살펴보거나 이메일로 연락해 주세요.",
      503,
    );
  try {
    if (process.env.VERCEL) {
      if (!process.env.CHAT_RATE_LIMIT_ID)
        return fail(
          "AI 어시스턴트를 준비하고 있어요. 잠시 후 다시 방문해 주세요.",
          503,
        );
      const { rateLimited } = await checkRateLimit(
        process.env.CHAT_RATE_LIMIT_ID,
        { request },
      );
      if (rateLimited)
        return fail("잠시 쉬어갈게요. 1분 후 다시 질문해 주세요.", 429);
    } else if (localRateLimit("local-development")) {
      return fail("잠시 쉬어갈게요. 1분 후 다시 질문해 주세요.", 429);
    }
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 24000,
      maxRetries: 0,
    });
    const response = await client.responses.create(
      {
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        instructions,
        input: messages,
        store: false,
        max_output_tokens: 1100,
        reasoning: { effort: "none" },
        text: {
          format: {
            type: "json_schema",
            name: "portfolio_answer",
            strict: true,
            schema: answerSchema,
          },
        },
      },
      { signal: request.signal },
    );
    if (response.status !== "completed" || !response.output_text)
      return fail(
        "답변을 완성하지 못했어요. 질문을 조금 짧게 바꿔 주세요.",
        502,
      );
    const parsed = JSON.parse(response.output_text) as {
      answer: unknown;
      sourceIds: unknown;
    };
    if (
      typeof parsed.answer !== "string" ||
      !parsed.answer.trim() ||
      !Array.isArray(parsed.sourceIds)
    )
      throw new Error("Invalid model output");
    const ids = new Set(parsed.sourceIds);
    return Response.json(
      {
        answer: parsed.answer,
        sources: projects
          .filter((p) => ids.has(p.id))
          .slice(0, 3)
          .map((p) => ({ id: p.id, title: p.subtitle })),
      },
      { headers },
    );
  } catch (error) {
    if (error instanceof OpenAI.APIError && error.status === 429)
      return fail("지금은 AI 요청이 많아요. 잠시 후 다시 시도해 주세요.", 429);
    // Do not log prompts, personal data, provider responses, or credentials.
    return fail("AI 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.", 503);
  }
}

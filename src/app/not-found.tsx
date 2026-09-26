import Link from "next/link";
import { Nav } from "@/components/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="container policy-page">
        <p className="eyebrow">404</p>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <p>주소가 바뀌었거나 없는 페이지입니다. 프로젝트 목록에서 다시 찾아 주세요.</p>
        <Link className="text-link" href="/#work">
          ← 프로젝트 목록으로
        </Link>
      </main>
    </>
  );
}

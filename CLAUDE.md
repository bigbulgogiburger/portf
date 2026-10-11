@AGENTS.md

## E2E 테스트

- 브라우저 E2E 테스트(화면 확인, 클릭, 폼 입력, 스크린샷, QA)는 **aside browser**(`aside` CLI, `aside-browser` 스킬)로 수행한다. 쓰기 전에 `aside guide`, REPL을 쓸 때는 `aside guide repl`도 읽는다. aside를 쓸 수 없을 때만 ego-browser(ego-lite)를 쓴다.
- aside REPL에는 화면 크기를 바꾸는 API가 없다. 모바일 너비는 `X-Frame-Options`를 뺀 테스트용 로컬 프록시를 띄우고, 같은 출처 iframe의 너비를 바꿔 확인한다(`next.config.ts`가 `X-Frame-Options: DENY`를 보낸다).
- Playwright MCP나 chrome-devtools MCP는 E2E에 사용하지 않는다.
- 단위 테스트는 기존대로 `npm test`(tsx `--test`)를 사용한다.

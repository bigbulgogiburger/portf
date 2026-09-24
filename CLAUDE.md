@AGENTS.md

## E2E 테스트

- 브라우저 E2E 테스트(화면 확인, 클릭, 폼 입력, 스크린샷, QA)는 **ego-browser(ego-lite)**로 수행한다. `ego-browser` 스킬을 사용한다.
- Playwright MCP나 chrome-devtools MCP는 E2E에 사용하지 않는다.
- 단위 테스트는 기존대로 `npm test`(tsx `--test`)를 사용한다.

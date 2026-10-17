import { test } from "node:test";
import assert from "node:assert/strict";
import { copyEmail } from "../src/lib/copy-email";

const email = "dohoon321@gmail.com";

test("copyEmail writes the address and does not open mail", async () => {
  const written: string[] = [];
  const opened: string[] = [];
  const result = await copyEmail(email, {
    writeText: async (text) => void written.push(text),
    openMailto: (href) => void opened.push(href),
  });
  assert.equal(result, "copied");
  assert.deepEqual(written, [email]);
  assert.deepEqual(opened, []);
});

test("copyEmail opens mailto when the clipboard API is missing", async () => {
  const opened: string[] = [];
  const result = await copyEmail(email, { openMailto: (href) => void opened.push(href) });
  assert.equal(result, "mailto");
  assert.deepEqual(opened, [`mailto:${email}`]);
});

test("copyEmail opens mailto when writeText is rejected", async () => {
  const opened: string[] = [];
  const result = await copyEmail(email, {
    writeText: () => Promise.reject(new DOMException("denied", "NotAllowedError")),
    openMailto: (href) => void opened.push(href),
  });
  assert.equal(result, "mailto");
  assert.deepEqual(opened, [`mailto:${email}`]);
});

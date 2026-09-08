import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const base = process.env.PORTFOLIO_BASE_URL || "http://localhost:3100";
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(base + "/print", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page
      .locator(".print-sheet")
      .evaluateAll(
        (nodes) => nodes.filter((n) => n.scrollHeight > 1124).length,
      );
    if (overflow)
      throw new Error("Print page overflows; inspect before publishing.");
    await mkdir("output/pdf", { recursive: true });
    await page.pdf({
      path: "output/pdf/portfolio-web-print.pdf",
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log("Generated output/pdf/portfolio-web-print.pdf (7 pages expected)");
  } finally {
    await browser.close();
  }
}
void main();

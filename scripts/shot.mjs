/**
 * shot.mjs — headless-Chrome screenshotter via CDP (no puppeteer dependency).
 * Usage: node scripts/shot.mjs <url> <out.png> <width> <height> [full]
 */
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const [, , url, out, wStr, hStr, full, action] = process.argv;
const width = Number(wStr) || 1440;
const height = Number(hStr) || 900;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222 + Math.floor((width % 100));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
  `--window-size=${width},${height}`,
  "--user-data-dir=/tmp/cdp-shot-" + PORT,
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await res.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("CDP not ready");
}

let id = 0;
function send(ws, method, params = {}, sessionId) {
  return new Promise((resolve) => {
    const myId = ++id;
    const onMsg = (event) => {
      const raw = typeof event.data === "string" ? event.data : Buffer.from(event.data).toString();
      const msg = JSON.parse(raw);
      if (msg.id === myId) {
        ws.removeEventListener("message", onMsg);
        resolve(msg.result);
      }
    };
    ws.addEventListener("message", onMsg);
    ws.send(JSON.stringify({ id: myId, method, params, sessionId }));
  });
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));

const { targetId } = await send(ws, "Target.createTarget", { url: "about:blank" });
const { sessionId } = await send(ws, "Target.attachToTarget", { targetId, flatten: true });

await send(ws, "Page.enable", {}, sessionId);
await send(ws, "Emulation.setDeviceMetricsOverride", {
  width, height, deviceScaleFactor: 2, mobile: width < 600,
}, sessionId);
await send(ws, "Runtime.enable", {}, sessionId);
await send(ws, "Page.navigate", { url }, sessionId);
await sleep(3000); // let fonts + hero image paint

// Scroll through the page to trigger lazy-loaded (below-the-fold) images, then back to top.
await send(
  ws,
  "Runtime.evaluate",
  {
    awaitPromise: true,
    expression: `(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 250));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 800));
    })()`,
  },
  sessionId,
);
await sleep(1200); // let any just-requested images decode

// Optional interaction: unlock the units gate (set the email input the React way, then submit).
if (action === "unlock") {
  await send(
    ws,
    "Runtime.evaluate",
    {
      awaitPromise: true,
      expression: `(async () => {
        const input = document.querySelector('input[type=email]');
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'demo@invedi.com');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Unlock units');
        if (btn) btn.click();
        await new Promise(r => setTimeout(r, 700));
        window.scrollTo(0, 0);
      })()`,
    },
    sessionId,
  );
  await sleep(900);
}

const params = { format: "png", captureBeyondViewport: true };
if (full) {
  const { cssContentSize } = await send(ws, "Page.getLayoutMetrics", {}, sessionId);
  params.clip = { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 };
}
const { data } = await send(ws, "Page.captureScreenshot", params, sessionId);
await writeFile(out, Buffer.from(data, "base64"));
console.log("saved", out);

ws.close();
chrome.kill();
process.exit(0);

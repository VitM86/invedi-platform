/**
 * shot-el.mjs — scroll a target section into view, then capture the VIEWPORT (not full page).
 * Usage: node scripts/shot-el.mjs <url> <out.png> <width> <height> <mode>
 * mode ∈ panel | location | compare | gate
 */
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const [, , url, out, wStr, hStr, mode] = process.argv;
const width = Number(wStr) || 1440;
const height = Number(hStr) || 900;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9400 + (width % 100);

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check", "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist", `--window-size=${width},${height}`,
  "--user-data-dir=/tmp/cdp-el-" + PORT, "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ws() {
  for (let i = 0; i < 50; i++) {
    try { const j = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl; } catch {}
    await sleep(200);
  }
  throw new Error("CDP not ready");
}
let id = 0;
function send(sock, method, params = {}, sessionId) {
  return new Promise((resolve) => {
    const myId = ++id;
    const on = (e) => { const m = JSON.parse(typeof e.data === "string" ? e.data : Buffer.from(e.data).toString()); if (m.id === myId) { sock.removeEventListener("message", on); resolve(m.result); } };
    sock.addEventListener("message", on);
    sock.send(JSON.stringify({ id: myId, method, params, sessionId }));
  });
}

const SCROLL = {
  panel: `window.scrollTo(0,0);`,
  location: `(()=>{const e=[...document.querySelectorAll('h2')].find(x=>x.textContent.trim()==='Location');e&&e.scrollIntoView({block:'start'});window.scrollBy(0,-90);})();`,
  compare: `(()=>{const e=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('Region overview'));e&&e.scrollIntoView({block:'start'});window.scrollBy(0,-90);})();`,
  gate: `(()=>{const e=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('Units ('));e&&e.scrollIntoView({block:'start'});window.scrollBy(0,-90);})();`,
};

const sock = new WebSocket(await ws());
await new Promise((r) => (sock.onopen = r));
const { targetId } = await send(sock, "Target.createTarget", { url: "about:blank" });
const { sessionId } = await send(sock, "Target.attachToTarget", { targetId, flatten: true });
await send(sock, "Page.enable", {}, sessionId);
await send(sock, "Runtime.enable", {}, sessionId);
await send(sock, "Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 600 }, sessionId);
await send(sock, "Page.navigate", { url }, sessionId);
await sleep(3500);
// settle: nudge scroll so lazy content + maps start, then go to the target
await send(sock, "Runtime.evaluate", { expression: `window.scrollTo(0,document.body.scrollHeight);` }, sessionId);
await sleep(1500);
let scrollExpr = SCROLL[mode] || "window.scrollTo(0,0);";
if (mode && mode.startsWith("text:")) {
  const t = mode.slice(5).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  scrollExpr = `(()=>{const t="${t}";const el=[...document.querySelectorAll('h1,h2,h3,p,li,span')].find(x=>x.textContent&&x.textContent.includes(t));if(el){el.scrollIntoView({block:'center'});window.scrollBy(0,-40);}})();`;
}
await send(sock, "Runtime.evaluate", { expression: scrollExpr }, sessionId);
await sleep(3500); // let Mapbox tiles paint after scrolling into view

// Optional: click a button by (exact-ish) text, then wait for the popup to open.
if (mode && mode.startsWith("click:")) {
  const t = mode.slice(6).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  await send(sock, "Runtime.evaluate", {
    expression: `(()=>{const t="${t}";const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent&&x.textContent.trim()===t);if(b)b.click();})();`,
  }, sessionId);
  await sleep(1200);
}
const { data } = await send(sock, "Page.captureScreenshot", { format: "png" }, sessionId);
await writeFile(out, Buffer.from(data, "base64"));
console.log("saved", out);
sock.close(); chrome.kill(); process.exit(0);

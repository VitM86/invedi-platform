/**
 * shot-slides.mjs — load a page once and capture the viewport N times spaced `interval` apart,
 * to catch each slide of an auto-advancing hero slideshow (10s crossfade). Stays at scroll 0.
 * Usage: node scripts/shot-slides.mjs <url> <outPrefix> <count> <intervalMs> <firstDelayMs> <w> <h>
 */
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const [, , url, outPrefix, countStr, intStr, firstStr, wStr, hStr] = process.argv;
const count = Number(countStr) || 4;
const interval = Number(intStr) || 10000;
const first = Number(firstStr) || 4000;
const width = Number(wStr) || 1440;
const height = Number(hStr) || 860;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9600 + (width % 100);

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check", "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist", `--window-size=${width},${height}`,
  "--user-data-dir=/tmp/cdp-slides-" + PORT, "about:blank",
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

const sock = new WebSocket(await ws());
await new Promise((r) => (sock.onopen = r));
const { targetId } = await send(sock, "Target.createTarget", { url: "about:blank" });
const { sessionId } = await send(sock, "Target.attachToTarget", { targetId, flatten: true });
await send(sock, "Page.enable", {}, sessionId);
await send(sock, "Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 600 }, sessionId);
await send(sock, "Page.navigate", { url }, sessionId);

await sleep(first);
for (let i = 0; i < count; i++) {
  if (i > 0) await sleep(interval);
  const { data } = await send(sock, "Page.captureScreenshot", { format: "png" }, sessionId);
  const out = `${outPrefix}-${i + 1}.png`;
  await writeFile(out, Buffer.from(data, "base64"));
  console.log("saved", out);
}
sock.close(); chrome.kill(); process.exit(0);

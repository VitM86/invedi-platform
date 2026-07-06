/**
 * shot-story.mjs — task-specific captures for the /story hero slideshow + gallery lightbox.
 * Usage: node scripts/shot-story.mjs <url> <outBase.png> <width> <height> <action>
 * actions:
 *   hero-seq  → three shots (outBase-1/-2/-3.png) at settled slide 1, 2, 3 (12s apart)
 *   gallery   → scroll the new Comporta collage images into view, capture viewport
 *   lightbox  → open the lightbox on the first collage image, capture
 *   lightbox2 → open lightbox, click Next once, capture (shows a different gallery photo)
 */
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const [, , url, outBase, wStr, hStr, action] = process.argv;
const width = Number(wStr) || 1440;
const height = Number(hStr) || 900;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9600 + (width % 100);

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check", "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist", `--window-size=${width},${height}`,
  "--user-data-dir=/tmp/cdp-story-" + PORT, "about:blank",
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
async function shot(sock, sessionId, out) {
  const { data } = await send(sock, "Page.captureScreenshot", { format: "png" }, sessionId);
  await writeFile(out, Buffer.from(data, "base64"));
  console.log("saved", out);
}
const evalJs = (sock, sessionId, expression) => send(sock, "Runtime.evaluate", { expression }, sessionId);

const sock = new WebSocket(await ws());
await new Promise((r) => (sock.onopen = r));
const { targetId } = await send(sock, "Target.createTarget", { url: "about:blank" });
const { sessionId } = await send(sock, "Target.attachToTarget", { targetId, flatten: true });
await send(sock, "Page.enable", {}, sessionId);
await send(sock, "Runtime.enable", {}, sessionId);
await send(sock, "Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 600 }, sessionId);
await send(sock, "Page.navigate", { url }, sessionId);
await sleep(3500);

const base = outBase.replace(/\.png$/, "");

if (action === "hero-seq") {
  // Hero is at the top. Let the entrance scale-in settle, capture slide 1, then wait for the
  // 10s crossfades to land on slides 2 and 3.
  await evalJs(sock, sessionId, `window.scrollTo(0,0);`);
  await sleep(2000);
  await shot(sock, sessionId, `${base}-1.png`);
  await sleep(12000); // → slide 2 settled
  await shot(sock, sessionId, `${base}-2.png`);
  await sleep(12000); // → slide 3 settled
  await shot(sock, sessionId, `${base}-3.png`);
} else if (action === "gallery") {
  // Bring the new Comporta collage frames into view.
  await evalJs(sock, sessionId, `(()=>{const i=[...document.querySelectorAll('img')].find(x=>x.src.includes('comporta-dunes.jpg')||x.src.includes('comporta-dunes2.jpg'));if(i)i.scrollIntoView({block:'center'});})();`);
  await sleep(1800);
  await shot(sock, sessionId, `${base}.png`);
} else if (action === "lightbox" || action === "lightbox2") {
  await evalJs(sock, sessionId, `(()=>{const b=document.querySelector('button[aria-label^="View photo"]');if(b){b.scrollIntoView({block:'center'});}})();`);
  await sleep(1000);
  await evalJs(sock, sessionId, `(()=>{const b=document.querySelector('button[aria-label^="View photo"]');if(b)b.click();})();`);
  await sleep(1200);
  if (action === "lightbox2") {
    await evalJs(sock, sessionId, `(()=>{const n=document.querySelector('button[aria-label="Next image"]');if(n)n.click();})();`);
    await sleep(900);
  }
  await shot(sock, sessionId, `${base}.png`);
}

sock.close(); chrome.kill(); process.exit(0);

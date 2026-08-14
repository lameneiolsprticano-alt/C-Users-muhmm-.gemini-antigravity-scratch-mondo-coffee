import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";

const chromePort = 9333;
const chromeProfile = `/tmp/mondo-iphone-sequence-profile-${process.pid}`;
const targetUrl = process.env.MONDO_VERIFY_URL ?? "http://127.0.0.1:3000/";
const isMobile = process.env.MONDO_VERIFY_MODE !== "desktop";
const viewport = isMobile ? { width: 390, height: 844, deviceScaleFactor: 3 } : { width: 1280, height: 720, deviceScaleFactor: 1 };
const errors = [];
const emulatedDeviceMemory = Number(process.env.MONDO_VERIFY_DEVICE_MEMORY ?? "");
const emulatedHardwareConcurrency = Number(process.env.MONDO_VERIFY_HARDWARE_CONCURRENCY ?? "");
const galleryPaths = [
  "/manus-storage/mondo-gallery-cookie_094c4dad.png",
  "/manus-storage/mondo-gallery-strawberry-velvet_5210e121.png",
  "/manus-storage/mondo-gallery-red-velvet_25b66fd2.png",
  "/manus-storage/mondo-gallery-mango_298b89dc.png",
  "/manus-storage/mondo-gallery-strawberry-roll_b0f6b1f5.png",
  "/manus-storage/mondo-gallery-pistachio-roll_a7020802.png",
];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
      if (response.ok) return response.json();
    } catch {
      // Chromium is still starting.
    }
    await wait(200);
  }
  throw new Error("Chromium DevTools did not become available.");
}

function openSocket(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener("open", () => resolve(socket), { once: true });
    socket.addEventListener("error", () => reject(new Error("Could not connect to Chromium DevTools.")), {
      once: true,
    });
  });
}

function createCommandClient(socket) {
  let commandId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails.text);
    }

    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  return (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = (commandId += 1);
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
}

const chromium = spawn(
  "/usr/bin/chromium",
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${chromeProfile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  const version = await waitForDebugger();
  const socket = await openSocket(version.webSocketDebuggerUrl);
  const command = createCommandClient(socket);
  const { targetId } = await command("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await command("Target.attachToTarget", { targetId, flatten: true });

  await command("Page.enable", {}, sessionId);
  await command(
    "Emulation.setDeviceMetricsOverride",
    { ...viewport, mobile: isMobile },
    sessionId,
  );
  await command("Emulation.setTouchEmulationEnabled", { enabled: isMobile, maxTouchPoints: isMobile ? 5 : 1 }, sessionId);
  if (isMobile && (Number.isFinite(emulatedDeviceMemory) || Number.isFinite(emulatedHardwareConcurrency))) {
    await command(
      "Page.addScriptToEvaluateOnNewDocument",
      {
        source: `
          ${Number.isFinite(emulatedDeviceMemory) ? `Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: ${emulatedDeviceMemory} });` : ""}
          ${Number.isFinite(emulatedHardwareConcurrency) ? `Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: ${emulatedHardwareConcurrency} });` : ""}
        `,
      },
      sessionId,
    );
  }
  await command("Page.navigate", { url: targetUrl }, sessionId);
  await wait(5000);

  const evaluate = async (expression) => {
    const result = await command(
      "Runtime.evaluate",
      { expression, awaitPromise: true, returnByValue: true },
      sessionId,
    );
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const initialFrame = await evaluate("document.querySelector('canvas')?.dataset.frame ?? null");
    if (initialFrame !== null) break;
    await wait(250);
  }

  const before = await evaluate(`(() => {
    const hero = document.querySelector('[aria-label="Mondo Coffee hero"]');
    const canvas = document.querySelector('canvas');
    return {
      frame: canvas?.dataset.frame ?? null,
      sourceFrame: canvas?.dataset.sourceFrame ?? null,
      scrollY: window.scrollY,
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      touchAction: hero ? getComputedStyle(hero).touchAction : null,
      canvasPointerEvents: canvas ? getComputedStyle(canvas).pointerEvents : null,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      mobileTier: hero?.dataset.mobileTier ?? null,
    };
  })()`);

  await evaluate(`(() => {
    const hero = document.querySelector('[aria-label="Mondo Coffee hero"]');
    const distance = ${isMobile ? "Math.max(1, hero.offsetHeight - window.innerHeight)" : "1200"};
    window.scrollTo(0, Math.round(distance * ${isMobile ? "0.7" : "1"}));
  })()`);
  await wait(800);

  const progressed = await evaluate(`(() => {
    const canvas = document.querySelector('canvas');
    return { frame: canvas?.dataset.frame ?? null, sourceFrame: canvas?.dataset.sourceFrame ?? null, scrollY: window.scrollY };
  })()`);

  await evaluate("window.scrollTo(0, 0)");
  await wait(500);

  const reset = await evaluate(`(() => {
    const canvas = document.querySelector('canvas');
    return { frame: canvas?.dataset.frame ?? null, sourceFrame: canvas?.dataset.sourceFrame ?? null, scrollY: window.scrollY };
  })()`);

  const gallery = await evaluate(`(() => {
    const paths = ${JSON.stringify(galleryPaths)};
    const capture = (path) => new Promise((resolve) => {
      const mounted = [...document.images].find((image) => new URL(image.src).pathname === path) ?? null;
      const image = mounted ?? new Image();
      if (!mounted) image.src = path;
      const result = () => resolve({
        path,
        mounted: Boolean(mounted),
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      });
      if (image.complete) result();
      else {
        image.addEventListener('load', result, { once: true });
        image.addEventListener('error', result, { once: true });
        setTimeout(result, 10000);
      }
    });
    return Promise.all(paths.map(capture));
  })()`);

  const result = { targetUrl, before, progressed, reset, gallery, errors };
  console.log(JSON.stringify(result, null, 2));

  const hasNativeScroll = progressed.scrollY > before.scrollY;
  const hasFrameProgression = Number(progressed.frame) > Number(before.frame);
  const hasReverseProgression = Number(reset.frame) === 0 && reset.scrollY === 0;
  const noHorizontalOverflow = before.scrollWidth <= before.viewportWidth;
  const touchSafe = !isMobile || (before.touchAction === "pan-y" && before.canvasPointerEvents === "none");
  const galleryLoaded = gallery.length === galleryPaths.length && gallery.every((image) =>
    image.mounted && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
  );
  const expectedMobileTier = process.env.MONDO_VERIFY_EXPECTED_TIER;
  const correctMobileTier = !isMobile || !expectedMobileTier || before.mobileTier === expectedMobileTier;

  if (!hasNativeScroll || !hasFrameProgression || !hasReverseProgression || !noHorizontalOverflow || !touchSafe || !galleryLoaded || !correctMobileTier || errors.length) {
    process.exitCode = 1;
  }

  socket.close();
} finally {
  chromium.kill("SIGTERM");
  await new Promise((resolve) => chromium.once("exit", resolve));
  await rm(chromeProfile, { recursive: true, force: true }).catch(() => undefined);
}

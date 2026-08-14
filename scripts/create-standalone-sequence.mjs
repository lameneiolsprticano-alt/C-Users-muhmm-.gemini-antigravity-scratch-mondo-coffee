import fs from "node:fs";

const frameListPath = "/home/ubuntu/webdev-static-assets/mondo-sequence/frames.txt";
const outputPath = "/home/ubuntu/mondo-coffee-website/mondo-coffee-scroll-sequence.html";
const frameUrls = fs
  .readFileSync(frameListPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mondo Coffee · Scroll Sequence</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root { color-scheme: dark; --espresso: #1e1613; --gold: #c28e38; --cream: #fdfbf7; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--espresso); color: var(--cream); font-family: "Plus Jakarta Sans", sans-serif; }
    .sequence-stage { position: relative; min-height: 100vh; overflow: hidden; isolation: isolate; background: var(--espresso); }
    .sequence-canvas, .sequence-fallback, .sequence-overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
    .sequence-canvas { z-index: -2; display: block; }
    .sequence-fallback { z-index: -3; object-fit: cover; opacity: .36; transition: opacity .7s ease; }
    .sequence-stage.is-ready .sequence-fallback { opacity: 0; }
    .sequence-overlay { z-index: -1; background: linear-gradient(180deg, rgba(30,22,19,.18), rgba(30,22,19,.32) 55%, rgba(30,22,19,1)); }
    .sequence-content { min-height: 100vh; display: grid; place-items: center; padding: 8rem 1.5rem 4rem; text-align: center; }
    .sequence-inner { width: min(100%, 960px); }
    .sequence-kicker { display: inline-flex; align-items: center; gap: .5rem; padding: .65rem 1rem; border: 1px solid rgba(194,142,56,.5); border-radius: 999px; background: rgba(194,142,56,.18); color: #e5b25d; font-size: .7rem; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; }
    .sequence-title { margin: 1.5rem 0 1rem; font-family: "Playfair Display", Georgia, serif; font-size: clamp(3.25rem, 9vw, 7.5rem); line-height: .98; letter-spacing: -.04em; }
    .sequence-copy { width: min(100%, 680px); margin: 0 auto 2.5rem; color: #e8e2d5; font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.7; }
    .sequence-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .85rem; }
    .sequence-actions a { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-width: 180px; padding: .95rem 1.3rem; border-radius: 999px; color: white; text-decoration: none; font-weight: 600; transition: transform .18s ease, background .18s ease, border-color .18s ease; }
    .sequence-actions a:hover { transform: translateY(-2px); }
    .sequence-actions .primary { background: var(--gold); box-shadow: 0 14px 36px rgba(194,142,56,.26); }
    .sequence-actions .primary:hover { background: #a9782b; }
    .sequence-actions .secondary { border: 1px solid rgba(255,255,255,.32); background: rgba(255,255,255,.04); backdrop-filter: blur(8px); }
    .sequence-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; width: min(100%, 720px); margin: 4rem auto 0; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,.18); text-align: left; }
    .sequence-meta small { display: block; margin-bottom: .35rem; color: #c28e38; font-size: .65rem; letter-spacing: .2em; text-transform: uppercase; }
    .sequence-meta strong, .sequence-meta a { color: white; font-family: "Playfair Display", Georgia, serif; font-size: 1rem; text-decoration: none; }
    .sequence-status { min-height: 1.2rem; margin-top: 1.5rem; color: rgba(255,255,255,.78); font-size: .75rem; }
    .sequence-loader { display: inline-flex; align-items: center; gap: .5rem; }
    .sequence-loader::before { content: ""; width: .55rem; height: .55rem; border: 1px solid rgba(255,255,255,.4); border-top-color: var(--gold); border-radius: 50%; animation: spin .9s linear infinite; }
    .sequence-after { min-height: 80vh; display: grid; place-items: center; padding: 4rem 1.5rem; background: var(--cream); color: #2d2421; text-align: center; }
    .sequence-after h2 { margin: 0 0 .75rem; font-family: "Playfair Display", Georgia, serif; font-size: clamp(2rem, 5vw, 4rem); }
    .sequence-after p { max-width: 620px; line-height: 1.7; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 640px) {
      .sequence-content { padding-inline: 1.15rem; }
      .sequence-actions a { width: 100%; }
      .sequence-meta { grid-template-columns: 1fr 1fr; }
      .sequence-meta > :last-child { grid-column: 1 / -1; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .sequence-loader::before { animation: none; }
    }
  </style>
</head>
<body>
  <main>
    <section class="sequence-stage" id="mondo-sequence" aria-label="Mondo Coffee scroll-linked hero">
      <img class="sequence-fallback" src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85" alt="Mondo Coffee atmosphere fallback">
      <canvas class="sequence-canvas" aria-hidden="true"></canvas>
      <div class="sequence-overlay" aria-hidden="true"></div>
      <div class="sequence-content">
        <div class="sequence-inner">
          <div class="sequence-kicker">✦ Third-Wave Roastery &amp; Design Space</div>
          <h1 class="sequence-title">Mondo Coffee</h1>
          <p class="sequence-copy">Where exceptional single-origin specialty coffees meet contemporary architectural design. Located in the heart of Esenyurt, Istanbul.</p>
          <div class="sequence-actions">
            <a class="primary" href="#menu">Explore Menu <span aria-hidden="true">→</span></a>
            <a class="secondary" href="#location">Visit Café (09:00–00:00)</a>
          </div>
          <div class="sequence-meta">
            <div><small>Location</small><strong>Esenyurt, Istanbul</strong></div>
            <div><small>Hours</small><strong>09:00–00:00</strong></div>
            <div><small>Social</small><a href="https://www.instagram.com/mondoocoffee" target="_blank" rel="noopener noreferrer">@mondoocoffee ↗</a></div>
          </div>
          <div class="sequence-status" aria-live="polite"><span class="sequence-loader">Preparing the atmosphere · 0%</span></div>
        </div>
      </div>
    </section>
    <section class="sequence-after" id="menu"><div><h2>Keep scrolling.</h2><p>The pinned sequence releases into the rest of your page after the last frame. Replace this section with your existing Mondo Coffee content.</p></div></section>
    <section class="sequence-after" id="location"><div><h2>İncirtepe, Esenyurt</h2><p>İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt · 09:00–00:00</p></div></section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
  <script>
    (() => {
      const FRAME_URLS = __FRAME_URLS__;
      const stage = document.querySelector("#mondo-sequence");
      const canvas = stage?.querySelector(".sequence-canvas");
      const status = stage?.querySelector(".sequence-status");
      if (!stage || !canvas || !status || !window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);
      const context = canvas.getContext("2d", { alpha: true });
      const images = FRAME_URLS.map(() => new Image());
      const playhead = { frame: 0 };
      let loaded = 0;
      let failed = 0;
      let resizeObserver;
      let trigger;
      let destroyed = false;

      const drawFrame = (index) => {
        const image = images[Math.max(0, Math.min(images.length - 1, Math.round(index)))];
        if (!image?.naturalWidth || destroyed) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        const pixelWidth = Math.round(width * dpr);
        const pixelHeight = Math.round(height * dpr);
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      };

      const updateStatus = (text, loading = false) => {
        status.innerHTML = loading ? '<span class="sequence-loader">' + text + '</span>' : text;
      };

      const startSequence = () => {
        if (destroyed || loaded === 0) return;
        stage.classList.add("is-ready");
        drawFrame(0);
        trigger = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=3200",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.to(playhead, { frame: self.progress * (images.length - 1), duration: 0.12, overwrite: true, ease: "none", onUpdate: () => drawFrame(playhead.frame) });
          }
        });
        updateStatus("Scroll to explore the Mondo atmosphere");
        ScrollTrigger.refresh();
      };

      images.forEach((image, index) => {
        image.decoding = "async";
        image.onload = () => {
          loaded += 1;
          updateStatus('Preparing the atmosphere · ' + Math.round((loaded / FRAME_URLS.length) * 100) + '%', true);
          if (loaded + failed === FRAME_URLS.length) {
            if (loaded > 0) startSequence();
            else updateStatus("Atmosphere preview available");
          }
        };
        image.onerror = () => {
          failed += 1;
          if (loaded + failed === FRAME_URLS.length) {
            if (loaded > 0) startSequence();
            else updateStatus("Atmosphere preview available");
          }
        };
        image.src = FRAME_URLS[index];
      });

      resizeObserver = new ResizeObserver(() => drawFrame(playhead.frame));
      resizeObserver.observe(canvas);
      window.addEventListener("pagehide", () => {
        destroyed = true;
        resizeObserver?.disconnect();
        trigger?.kill();
        images.forEach((image) => { image.onload = null; image.onerror = null; image.src = ""; });
      }, { once: true });
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html.replace("__FRAME_URLS__", JSON.stringify(frameUrls)));
console.log(`Wrote ${outputPath} with ${frameUrls.length} frames.`);

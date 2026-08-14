# Mobile Hero Verification Notes

## 2026-08-14 — local iPhone viewport inspection

At a 390 × 844 phone viewport, the full-page capture reached the menu, gallery, location, and footer after the hero. This confirms that downstream content remains reachable and there is no evident horizontal overflow in the current local layout.

The image capture alone cannot establish whether the canvas changes frames during a touch scroll. The companion `scripts/verify-iphone-sequence.mjs` therefore checks the running site through Chromium’s DevTools protocol, including forward and reverse frame progression, native vertical movement, touch-safe styles, and page errors.

## 2026-08-14 — deterministic runtime result

The iPhone-sized runtime check completed with no page errors. The page moved from `scrollY: 0` to `scrollY: 945`, while the sampled mobile canvas advanced from frame `0` (source frame `0`) to frame `27` (source frame `207`); returning to the top reset both values to `0`. The verifier also confirmed `touch-action: pan-y`, `pointer-events: none` on the canvas, and no horizontal overflow at 390 px.

The desktop companion run advanced from its initial state to canvas frame `69` after a 1,200 px scroll and reset to frame `0` on the return scroll, with no page errors.

## Deployment status — 2026-08-14

Vercel marked commit `b8d4f65` (`Restore mobile cup scroll sequence`) as Ready at `https://mondo-coffee-g94fuoh69-onlyfakemeta-6380s-projects.vercel.app`.

An unauthenticated command-line request to that URL was redirected through Vercel’s `/api/sso` and `/login` routes despite the API result obtained for the initially identified project. The public-access verification is therefore incomplete: the access setting must be reconciled with the Vercel project that owns the `mondo-coffee` deployment before the URL can be treated as publicly accessible.

The Vercel dashboard for the actual `mondo-coffee` project showed **Require Log In** enabled. After the user’s explicit confirmation, it was disabled using Vercel’s required confirmation dialog. A Vercel success notice reported **“Vercel Authentication disabled.”** The next step is an unauthenticated request and iPhone runtime check after setting propagation.

## Public production verification — 2026-08-14

The latest Vercel deployment returned an unauthenticated `HTTP 200` response after the setting change. The live iPhone-sized run loaded an initial canvas frame `0`, advanced to sampled frame `27` (source frame `207`) at `scrollY: 945`, then returned to frame `0` at the top. It also reported `touch-action: pan-y`, a non-interactive canvas layer, no horizontal overflow at 390 px, and no page errors.

The same public deployment retained desktop behavior: it advanced to frame `112` after a 1,200 px scroll and reset to frame `0` when returning to the top, without page errors. The desktop initial frame may still be briefly blank while its larger 300-frame preload completes; the existing first-frame fallback remains visible during that short load interval.

The final public deployment loaded the Mondo Coffee page successfully. An initial gallery selector based on a presumed `mondo-gallery-*` filename convention returned no elements, so the deployed asset check is being matched against the current source-declared gallery paths rather than an assumed storage filename.

The interactive-browser session subsequently returned to `about:blank` before a second DOM inspection. Final gallery verification is therefore being performed through the project’s DevTools-based runtime verifier, which already provides deterministic checks against the deployed public URL.

The final public iPhone runtime check completed successfully against `mondo-coffee-g94fuoh69-onlyfakemeta-6380s-projects.vercel.app`. All six source-declared gallery images were mounted in the live page, completed their loads, and reported natural dimensions of **1086 × 1448**. The same run confirmed frame `0` at the top, frame `27` / source frame `207` after a 945 px phone scroll, frame `0` after returning to the top, no page errors, `touch-action: pan-y`, and no horizontal overflow.

## Adaptive all-phone animation check — 2026-08-14

The scroll-driven cup sequence now selects a capability tier without checking a phone brand or browser name. A constrained 4 GB / 4-core Android-style profile receives 12 sampled frames and a 1.5× canvas limit; a standard 6 GB / 6-core profile receives 24 frames at 2×; and a high 8 GB / 8-core profile retains 40 frames at 2.25×. All three profiles progressed forward, reset on reverse scroll, retained `touch-action: pan-y`, had no horizontal overflow, and produced no page errors in the local mobile runtime verifier.

The renderer now also coalesces mobile scroll updates into `requestAnimationFrame` and draws the closest successfully decoded image when an individual sampled frame is unavailable. The exact first uploaded cup image remains visible underneath until the initial animated frame has loaded, preventing a blank hero if a constrained browser declines or delays one or more image decodes.

The public Vercel deployment `mondo-coffee-qqevnu9x4-onlyfakemeta-6380s-projects.vercel.app` passed the constrained 4 GB / 4-core Android-style runtime check: frame `0` progressed to frame `8` / source frame `217` at `scrollY: 945`, returned to frame `0`, kept `touch-action: pan-y`, showed no horizontal overflow, and produced no page errors.

## Phone-only load reduction — 2026-08-14

The mobile tiers have been reduced again to 8 sampled frames at 1× canvas density for constrained phones, 12 frames at 1.25× for standard phones, and 20 frames at 1.5× for higher-capability phones. The desktop path is unchanged: it still uses the full 300-frame sequence and high-quality canvas smoothing. The below-the-fold story video is now activated on phones only when its section nears the viewport, and the six gallery images use native lazy loading and asynchronous decoding.

After the reduction, the constrained local profile progressed from frame `0` to frame `5` / source frame `214` at `scrollY: 945`, then reset to frame `0` without errors or horizontal overflow. The desktop verifier still progressed to frame `112` and reset to frame `0` without errors.

The Vercel production deployment for this mobile-only reduction, commit `e06e9f6`, completed successfully and is available at `mondo-coffee-cudgkicr5-onlyfakemeta-6380s-projects.vercel.app`.

The public constrained-device run against that deployment passed: frame `0` advanced to frame `5` / source frame `214` at `scrollY: 945`, returned to frame `0`, preserved `touch-action: pan-y`, had no horizontal overflow, loaded all six gallery assets after the gallery entered view, and reported no page errors.

## Desktop first-frame repair — 2026-08-14

The previous desktop verification exposed the issue: its initial canvas frame was unset before the 300-frame preload completed, although later scrolling could eventually render frames. The desktop loader now draws the first successfully loaded batch immediately, while the other frames continue loading in the background. The local desktop runtime now starts at frame `0`, advances to frame `63` at a 1,200 px scroll, and resets to frame `0` with no errors. The constrained phone runtime remains at its lightweight 8-frame tier and advances from frame `0` to frame `5` with no errors.

The Vercel production deployment for the desktop repair, commit `fe4ac3c`, is Ready at `mondo-coffee-hjb7yw3xz-onlyfakemeta-6380s-projects.vercel.app`.

The public desktop verification now begins on frame `0`, advances to frame `79` at a 1,200 px scroll, then returns to frame `0`; it recorded no page errors. The same deployment retains the constrained phone setting, progressing from frame `0` to frame `5` / source frame `214` at `scrollY: 945` and returning to frame `0`, also without page errors or horizontal overflow.

## Windows-safe desktop image fallback — 2026-08-14

The native hero image now stays behind the canvas and is updated to the same selected frame on every scroll render. When a 2D canvas context is unavailable, the renderer switches to `image-fallback` mode instead of leaving the hero blank. The software-rendering simulation began on source frame `1`, changed its native fallback image to source frame `78` at a 1,200 px scroll, and returned to source frame `1` on reverse scrolling, with no page errors. With canvas available, the normal desktop path continued in `canvas` mode and progressed identically. The constrained phone path remained in `canvas` mode and progressed from source frame `1` to source frame `215` without errors.

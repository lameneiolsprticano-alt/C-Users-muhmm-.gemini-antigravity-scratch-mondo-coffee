# Mobile Hero Verification Notes

## 2026-08-14 — local iPhone viewport inspection

At a 390 × 844 phone viewport, the full-page capture reached the menu, gallery, location, and footer after the hero. This confirms that downstream content remains reachable and there is no evident horizontal overflow in the current local layout.

The image capture alone cannot establish whether the canvas changes frames during a touch scroll. The companion `scripts/verify-iphone-sequence.mjs` therefore checks the running site through Chromium’s DevTools protocol, including forward and reverse frame progression, native vertical movement, touch-safe styles, and page errors.

## 2026-08-14 — deterministic runtime result

The iPhone-sized runtime check completed with no page errors. The page moved from `scrollY: 0` to `scrollY: 945`, while the sampled mobile canvas advanced from frame `0` (source frame `0`) to frame `27` (source frame `207`); returning to the top reset both values to `0`. The verifier also confirmed `touch-action: pan-y`, `pointer-events: none` on the canvas, and no horizontal overflow at 390 px.

The desktop companion run advanced from its initial state to canvas frame `69` after a 1,200 px scroll and reset to frame `0` on the return scroll, with no page errors.

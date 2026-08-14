# Mondo Coffee Website TODO

- [x] Create todo.md and set up project scope
- [x] Initialize branding, custom Tailwind color palette (warm mocha, espresso, cream, gold accents), and Google Fonts (Playfair Display / Plus Jakarta Sans)
- [x] Implement responsive Navigation bar with smooth scrolling and mobile hamburger menu
- [x] Build Hero Section with full-screen visual, tagline, and call-to-action buttons
- [x] Build About Section describing the third-wave roastery and design space in Esenyurt, Istanbul
- [x] Build Menu Section showcasing espresso, V60, filter, cold brew, and exquisite desserts and treats with descriptions and pricing
- [x] Build Gallery Section with curated imagery of café interior, coffee, and artisanal desserts
- [x] Build Location & Contact Section with exact address (İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt), opening hours (09:00–00:00), and Google Maps widget / directions
- [x] Build Social Media Links Section pointing to Instagram handle @mondoocoffee
- [x] Build Footer with brand name, social links, address, and copyright
- [x] Add unit tests and verify the responsive website presentation

- [x] Inspect supplied zip archive of image frames (300 frames)
- [x] Extract frames to public storage asset directory and generate frame URL list
- [x] Integrate GSAP + ScrollTrigger canvas image-sequence component into the first page (Hero section) with preloading and fallback
- [x] Create a standalone self-contained HTML drop-in file with GSAP ScrollTrigger sequence
- [x] Verify responsive rendering, pinning, smooth scrubbing, and test suite
- [x] Manually verify GSAP ScrollTrigger pinning, frame progression, and smooth scrubbing during desktop and mobile scroll interaction
- [x] Document the runtime verification evidence for the scroll-linked hero

- [x] Upload and integrate user-provided gallery photos for the first page
- [x] Update Home.tsx gallery array with the new uploaded image URLs and descriptive captions
- [x] Verify responsive gallery grid rendering and test suite

- [x] Investigate why gallery image storage paths failed to resolve and correct URL encoding/serving
- [x] Update Home.tsx gallery array with correct storage proxy paths
- [x] Verify image loading via browser screenshot and test suite

- [x] Remove the highlighted hero heading, subtitle, tag, metadata, and status copy from the first-page hero; retain only the two CTA buttons over the background visual

- [x] Reintroduce only the hero CTA buttons while keeping the heading, subtitle, tag, metadata, and status copy removed
- [x] Verify the restored CTAs on desktop and mobile and rerun the test suite
- [x] Update the completed hero-removal task wording to reflect CTA preservation

## Latest verification note
The hero background and navigation were verified after the overlay copy removal. Only the two requested CTA buttons remain, and they were verified on desktop and mobile after the TypeScript and Vitest checks passed.

## Change history
- [x] Removed the hero heading, subtitle, badge, metadata bars, and status copy.
- [x] Restored the hero CTA buttons as the only remaining hero overlay controls.
- [x] Verified the restored CTA layout on desktop and mobile.

---

## Accessibility note
The hero canvas remains decorative and is marked `aria-hidden`. The restored CTA links remain native anchors so they are keyboard reachable and continue to target the existing Menu and Location sections.

## Implementation note
The final hero should retain only two action links over the canvas: one to `#menu` and one to `#location`. No other hero copy should be rendered in the overlay.

## Delivery note
A new checkpoint is required after the CTA restoration, automated checks, and desktop/mobile screenshot verification.

- [x] Remove the remaining hero CTA buttons so the first-page hero contains only the canvas animation background and top navigation

- [x] Adjust ScrollSequenceHero.tsx canvas drawing logic so mobile viewports render the image smaller with a containment scale factor, avoiding the overly zoomed-in appearance

- [x] Replace the About-section static image in Home.tsx with the uploaded Mondo Coffee video asset (autoplay, muted, loop, playsinline)

## iPhone scrolling follow-up

- [x] Inspect the restored hero for iPhone Safari scroll-blocking behavior
- [x] Apply a native-scroll-safe iPhone hero fallback without changing the desktop sequence
- [x] Verify iPhone scrolling and desktop hero behavior after the fix
- [x] Save a reviewable iPhone-safe checkpoint

## iPhone-safe delivery follow-up

- [x] Explicitly verify the desktop pinned frame sequence after the iPhone-only fallback change
- [x] Save a new reviewable checkpoint after the iPhone-safe verification

## Vercel deployment connection

- [x] Inspect the available Vercel integration and the exported GitHub repository
- [x] Prepare Vercel-compatible deployment configuration for the static site
- [x] Initiate a Vercel preview deployment of the tested static site bundle
- [x] Verify the Vercel deployment URL and Mondo Coffee runtime presentation
- [x] Connect the exact GitHub repository as Vercel's source for automatic deployments

## Vercel source alignment

- [x] Compare the Vercel-deployed source with the current Mondo Coffee project version
- [x] Synchronize the current Mondo Coffee source and required deployable assets to the connected GitHub repository
- [x] Trigger and verify a Vercel deployment that matches the current cup-hero version

## Vercel asset verification — 2026-08-14

The GitHub commit `68c2748` adds a Vercel rewrite for `/manus-storage/*` before the SPA fallback. The production deployment `mondo-coffee-7aeew7quf-onlyfakemeta-6380s-projects.vercel.app` is Ready. Authenticated browser verification confirms the first cup frame renders, desktop scrolling advances from canvas frame `0` at `scrollY: 0` to frame `90` at `scrollY: 962` and returns to frame `0` when scrolled back to the top. All six gallery images return completed dimensions of 1086 × 1448 through the Vercel domain.

The full project-to-GitHub source comparison excluded only generated or local-only directories (`.git`, `node_modules`, `.manus-logs`, `dist`, and `.vite`). It identified `todo.md` as the only remaining difference after commit `68c2748`; that documentation change is being synchronized in the next GitHub commit.

## Public Vercel access

- [x] Inspect the current Vercel deployment protection settings
- [x] Make the Vercel production deployment accessible without a sign-in or access-protection prompt
- [x] Verify the Vercel URL responds publicly while preserving the cup hero and gallery assets

## Mobile scroll regression — reported 2026-08-14

- [x] Reproduce the missing mobile cup animation on the latest Vercel deployment at iPhone viewport dimensions
- [x] Identify and remove the source of any mobile scroll interception, scroll lock, or touch-event conflict
- [x] Retire the static first-frame phone fallback while preserving desktop-only GSAP pinning
- [x] Verify native touch scrolling, no horizontal overflow, and desktop sequence progression on the deployed Vercel URL

## Mobile cup-sequence requirement — clarified 2026-08-14

- [x] Replace the static-only phone fallback with a lightweight scroll-driven cup sequence
- [x] Keep the mobile sequence free of fixed/pinned touch interception so native iPhone scrolling remains available
- [x] Verify the phone sequence advances and reverses with page scroll while desktop keeps the complete 300-frame experience

## Final public asset verification

- [x] Verify all six supplied gallery images load on the final public Vercel deployment
- [x] Record combined live Vercel evidence for the cup-sequence frames and gallery asset requests

## Redmi Android compatibility — reported 2026-08-14

- [x] Reproduce the reported Redmi-specific risk under constrained Android-style browser conditions
- [x] Identify decoded-frame memory, canvas pixel density, and direct scroll rendering as the likely compatibility risks addressed by the repair
- [x] Add a Redmi-safe loading path that preserves page access and the cup experience
- [x] Verify the repair across constrained and high-capability Android-style mobile browser profiles locally

## All-phone mobile compatibility — clarified 2026-08-14

- [x] Define low-, standard-, and high-capability mobile hero behavior without user-agent targeting
- [x] Limit decoded-frame memory and canvas pixel density on constrained phones
- [x] Keep a visual hero fallback and native scrolling available when the animated sequence cannot be safely loaded
- [x] Verify the mobile hero with constrained, standard, and high-capability phone profiles locally

## Animation-only scope — clarified 2026-08-14

- [x] Restrict the compatibility repair to the scroll-driven cup animation; do not change the otherwise working mobile page
- [x] Preserve the cup animation on all capability tiers using adaptive frame density rather than removing it

## Adaptive animation deployment

- [x] Synchronize the tested cross-phone cup-animation repair to Vercel
- [x] Verify the public deployment retains native scrolling and frame progression

## Mobile-only performance reduction — requested 2026-08-14

- [x] Reduce the default decoded-frame count and canvas workload on phone viewports only
- [x] Ensure non-critical below-the-fold phone media does not contend with the hero during initial load
- [x] Keep desktop visual quality and its complete 300-frame sequence unchanged
- [x] Verify phone frame progression, native scroll, and no page errors after the reduction

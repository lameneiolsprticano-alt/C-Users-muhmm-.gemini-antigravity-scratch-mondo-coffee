import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mondoSequenceFrames } from "../client/src/data/mondoSequenceFrames";

describe("Mondo Coffee Website Requirements", () => {
  it("verifies brand name, social handle, address, and hours", () => {
    const brandName = "Mondo Coffee";
    const instagramHandle = "@mondoocoffee";
    const address = "İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt";
    const hours = "09:00–00:00";

    expect(brandName).toBe("Mondo Coffee");
    expect(instagramHandle).toBe("@mondoocoffee");
    expect(address).toBe("İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt");
    expect(hours).toBe("09:00–00:00");
  });

  it("contains the complete ordered uploaded frame sequence", () => {
    expect(mondoSequenceFrames).toHaveLength(300);
    expect(mondoSequenceFrames[0]).toMatch(/ezgif-frame-001_/);
    expect(mondoSequenceFrames.at(-1)).toMatch(/ezgif-frame-300_/);
    expect(mondoSequenceFrames.every((url) => url.startsWith("/manus-storage/"))).toBe(true);
  });

  it("uses the six uploaded Mondo dessert photos in the first-page gallery", () => {
    const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const uploadedGalleryPhotos = homeSource.match(/\/manus-storage\/mondo-gallery-[a-z-]+_[a-f0-9]+\.png/g) ?? [];

    expect(uploadedGalleryPhotos).toHaveLength(6);
    expect(homeSource).not.toContain("images.unsplash.com/photo-1554118811");
    expect(homeSource).toContain("Chocolate Chip Cookie Pie");
    expect(homeSource).toContain("Pistachio Cream Roll");
  });

  it("uses a reduced canvas containment scale on phone-sized viewports", () => {
    const heroSource = readFileSync(
      resolve(process.cwd(), "client/src/components/ScrollSequenceHero.tsx"),
      "utf8",
    );

    expect(heroSource).toContain("const mobileContainment = cssWidth <= 640 ? 0.76 : 1;");
    expect(heroSource).toContain("const scale = coverScale * mobileContainment;");
  });

  it("uses a lightweight, touch-safe scroll-driven hero path on iPhone-sized viewports", () => {
    const heroSource = readFileSync(
      resolve(process.cwd(), "client/src/components/ScrollSequenceHero.tsx"),
      "utf8",
    );

    expect(heroSource).toContain("const MOBILE_BREAKPOINT = 767;");
    expect(heroSource).toContain("const MOBILE_FRAME_COUNT = 20;");
    expect(heroSource).toContain("getSampledMobileFrames(frameUrls, mobileProfile?.frameCount)");
    expect(heroSource).toContain('window.addEventListener("scroll", mobileScrollHandler, { passive: true });');
    expect(heroSource).toContain("sticky top-0 h-screen");
    expect(heroSource).toContain("touch-pan-y");
    expect(heroSource).toContain("pointer-events-none");
    expect(heroSource).toContain("canvas.dataset.frame = String(renderedIndex);");
  });

  it("adapts mobile cup-animation pressure without removing the scroll-driven experience", () => {
    const heroSource = readFileSync(
      resolve(process.cwd(), "client/src/components/ScrollSequenceHero.tsx"),
      "utf8",
    );

    expect(heroSource).toContain("MOBILE_CONSTRAINED_FRAME_COUNT = 8");
    expect(heroSource).toContain("MOBILE_STANDARD_FRAME_COUNT = 12");
    expect(heroSource).toContain("getMobileSequenceProfile()");
    expect(heroSource).toContain("navigator.hardwareConcurrency");
    expect(heroSource).toContain("deviceMemory");
    expect(heroSource).toContain("window.requestAnimationFrame");
    expect(heroSource).toContain("section.dataset.mobileTier");
    expect(heroSource).toContain("for (let offset = 1; offset < images.length; offset += 1)");
    expect(heroSource).toContain("setSequenceReady(Boolean(images[0]?.naturalWidth))");
    expect(heroSource).toContain("context.imageSmoothingQuality = isMobile ? \"medium\" : \"high\"");
  });

  it("uses the supplied video in the About section", () => {
    const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(homeSource).toContain("/manus-storage/mondo-about-story_454ca9d1.mp4");
    expect(homeSource).toContain("autoPlay");
    expect(homeSource).toContain("playsInline");
    expect(homeSource).toContain("IntersectionObserver");
    expect(homeSource).toContain('loading="lazy"');
  });
});

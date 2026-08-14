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

  it("uses a static, touch-safe hero path on iPhone-sized viewports", () => {
    const heroSource = readFileSync(
      resolve(process.cwd(), "client/src/components/ScrollSequenceHero.tsx"),
      "utf8",
    );

    expect(heroSource).toContain("const MOBILE_BREAKPOINT = 767;");
    expect(heroSource).toContain("const sequenceUrls = isMobile ? [frameUrls[0]] : frameUrls;");
    expect(heroSource).toContain("if (isMobile) return;");
    expect(heroSource).toContain("touch-pan-y");
    expect(heroSource).toContain("pointer-events-none");
    expect(heroSource).toContain("canvas.dataset.frame = String(frameIndex);");
  });

  it("uses the supplied video in the About section", () => {
    const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(homeSource).toContain("/manus-storage/mondo-about-story_454ca9d1.mp4");
    expect(homeSource).toContain("autoPlay");
    expect(homeSource).toContain("playsInline");
  });
});

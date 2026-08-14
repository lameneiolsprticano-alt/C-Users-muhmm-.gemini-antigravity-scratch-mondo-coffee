import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollSequenceHeroProps = {
  frameUrls: readonly string[];
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85";
const MOBILE_BREAKPOINT = 767;
const MOBILE_FRAME_COUNT = 40;

function getSampledMobileFrames(frameUrls: readonly string[]) {
  if (frameUrls.length <= MOBILE_FRAME_COUNT) return [...frameUrls];

  return Array.from({ length: MOBILE_FRAME_COUNT }, (_, index) => {
    const sourceIndex = Math.round((index * (frameUrls.length - 1)) / (MOBILE_FRAME_COUNT - 1));
    return frameUrls[sourceIndex];
  });
}

export default function ScrollSequenceHero({ frameUrls }: ScrollSequenceHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ current: 0 });
  const [sequenceReady, setSequenceReady] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || frameUrls.length === 0) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let destroyed = false;
    let resizeObserver: ResizeObserver | undefined;
    let scrollTrigger: ScrollTrigger | undefined;
    let mobileScrollHandler: (() => void) | undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    const sequenceUrls = prefersReducedMotion
      ? [frameUrls[0]]
      : isMobile
        ? getSampledMobileFrames(frameUrls)
        : frameUrls;
    const images = sequenceUrls.map(() => new Image());
    imagesRef.current = images;

    const drawFrame = (index: number) => {
      const frameIndex = Math.max(0, Math.min(images.length - 1, Math.round(index)));
      const image = images[frameIndex];
      if (!image || !image.naturalWidth || destroyed) return;

      canvas.dataset.frame = String(frameIndex);
      canvas.dataset.sourceFrame = String(
        Math.round((frameIndex * (frameUrls.length - 1)) / Math.max(1, images.length - 1)),
      );

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 3 : 2);
      const cssWidth = Math.max(1, Math.round(rect.width));
      const cssHeight = Math.max(1, Math.round(rect.height));
      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.clearRect(0, 0, cssWidth, cssHeight);

      const coverScale = Math.max(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
      const mobileContainment = cssWidth <= 640 ? 0.76 : 1;
      const scale = coverScale * mobileContainment;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (cssWidth - drawWidth) / 2;
      const y = (cssHeight - drawHeight) / 2;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const fitCanvas = () => drawFrame(frameRef.current.current);

    const loadImage = (image: HTMLImageElement, url: string) =>
      new Promise<boolean>((resolve) => {
        image.decoding = "async";
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = url;
      });

    const preloadFrames = async () => {
      let successful = 0;
      const batchSize = isMobile ? 4 : 8;

      for (let start = 0; start < images.length; start += batchSize) {
        if (destroyed) return;
        const batch = images.slice(start, start + batchSize);
        const results = await Promise.all(
          batch.map((image, offset) => loadImage(image, sequenceUrls[start + offset])),
        );
        successful += results.filter(Boolean).length;
      }

      if (destroyed || successful === 0) return;
      setSequenceReady(true);
      drawFrame(frameRef.current.current);
    };

    resizeObserver = new ResizeObserver(fitCanvas);
    resizeObserver.observe(canvas);

    if (prefersReducedMotion) {
      loadImage(images[0], sequenceUrls[0]).then((loaded) => {
        if (destroyed || !loaded) return;
        setSequenceReady(true);
        drawFrame(0);
      });

      return () => {
        destroyed = true;
        resizeObserver?.disconnect();
        images.forEach((image) => {
          image.onload = null;
          image.onerror = null;
          image.src = "";
        });
      };
    }

    if (isMobile) {
      mobileScrollHandler = () => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollDistance));
        frameRef.current.current = progress * (sequenceUrls.length - 1);
        drawFrame(frameRef.current.current);
      };
      window.addEventListener("scroll", mobileScrollHandler, { passive: true });
      mobileScrollHandler();
    } else {
      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=3200",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          frameRef.current.current = self.progress * (sequenceUrls.length - 1);
          drawFrame(frameRef.current.current);
        },
      });
      ScrollTrigger.refresh();
    }

    preloadFrames();

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      scrollTrigger?.kill();
      if (mobileScrollHandler) window.removeEventListener("scroll", mobileScrollHandler);
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      });
    };
  }, [frameUrls]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] md:h-screen flex items-start justify-center bg-[#1E1613] text-white overflow-visible md:overflow-hidden pt-20 touch-pan-y"
      aria-label="Mondo Coffee hero"
      data-scroll-sequence="true"
    >
      <div className="sticky top-0 h-screen w-full pointer-events-none z-0 bg-[#1E1613]">
        <img
          src={frameUrls[0] ?? FALLBACK_IMAGE}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover opacity-35 transition-opacity duration-700 ${sequenceReady ? "opacity-0" : "opacity-35"}`}
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1613] via-[#1E1613]/45 to-transparent" />
      </div>
    </section>
  );
}

export type { ScrollSequenceHeroProps };

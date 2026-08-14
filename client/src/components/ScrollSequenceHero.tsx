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
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    // iPhone Safari should never decode or pin the 300-frame desktop animation.
    // Loading one static source preserves native touch scrolling from the first gesture.
    const sequenceUrls = isMobile ? [frameUrls[0]] : frameUrls;
    const images = sequenceUrls.map(() => new Image());
    imagesRef.current = images;

    const drawFrame = (index: number) => {
      const frameIndex = Math.max(0, Math.min(images.length - 1, Math.round(index)));
      const image = images[frameIndex];
      if (!image || !image.naturalWidth || destroyed) return;

      canvas.dataset.frame = String(frameIndex);

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = Math.max(1, Math.round(rect.width));
      const cssHeight = Math.max(1, Math.round(rect.height));
      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);

      const coverScale = Math.max(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
      // On portrait phones, a strict cover fit makes the cup feel excessively zoomed in.
      // Render the sequence slightly smaller while keeping it centered so more atmosphere remains visible.
      const mobileContainment = cssWidth <= 640 ? 0.76 : 1;
      const scale = coverScale * mobileContainment;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (cssWidth - drawWidth) / 2;
      const y = (cssHeight - drawHeight) / 2;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const fitCanvas = () => {
      drawFrame(frameRef.current.current);
    };

    const preloadFrames = async () => {
      let successful = 0;
      await Promise.all(
        images.map(
          (image, index) =>
            new Promise<void>((resolve) => {
              image.decoding = "async";
              image.onload = () => {
                successful += 1;
                resolve();
              };
              image.onerror = () => resolve();
              image.src = sequenceUrls[index];
            }),
        ),
      );

      if (destroyed) return;
      if (successful === 0) return;

      setSequenceReady(true);
      drawFrame(0);
      if (isMobile) return;
      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=3200",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          frameRef.current.current = self.progress * (images.length - 1);
          drawFrame(frameRef.current.current);
        },
      });
      ScrollTrigger.refresh();
    };

    resizeObserver = new ResizeObserver(fitCanvas);
    resizeObserver.observe(canvas);
    preloadFrames();

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      scrollTrigger?.kill();
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
      className="relative min-h-screen flex items-center justify-center bg-[#1E1613] text-white overflow-x-hidden md:overflow-hidden pt-20 touch-pan-y"
      aria-label="Mondo Coffee hero"
    >
      <div className="absolute inset-0 z-0 bg-[#1E1613] pointer-events-none">
        <img
          src={FALLBACK_IMAGE}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover opacity-35 transition-opacity duration-700 ${sequenceReady ? "opacity-0" : "opacity-35"}`}
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1613] via-[#1E1613]/45 to-transparent" />
      </div>


    </section>
  );
}

export type { ScrollSequenceHeroProps };

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Loader2, ArrowRight } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import { ProgressIndicator } from "@/components/landing/progress-indicator";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

declare global {
  interface Window {
    __restoreHash?: string;
  }
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Prevent native browser scroll restoration immediately
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Temporarily strip the operations hash on initial load to prevent premature native jump
  if (window.location.hash === "#operations") {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.__restoreHash = "#operations";
  }
}

const FRAME_COUNT = 269;
const FRAME_START = 1;

function getFrameUrl(index: number) {
  const paddedIndex = index.toString().padStart(3, "0");
  return `/sequence/frames/ezgif-frame-${paddedIndex}.webp`;
}

const STORY_STAGES = [
  {
    title: "RestaurantOS",
    subtitle: "The engine for modern restaurant operations.",
    showCTA: false
  },
  {
    title: "Start every shift with clarity.",
    subtitle: "",
    showCTA: false
  },
  {
    title: "Total visibility, instantly.",
    subtitle: "Live tables, active orders, kitchen flow,\nand revenue—all synchronized in real time.",
    showCTA: false
  },
  {
    title: "Everything in one place.",
    subtitle: "",
    showCTA: false
  },
  {
    title: "RestaurantOS",
    subtitle: "One intelligent platform.\nFrom the front door to the back office.",
    showCTA: true
  }
];

export function SequenceHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderState = useRef({ frame: 0 });
  const hasRestored = useRef(false);
  const isBootingRef = useRef(true);
  const initialSavedScrollRef = useRef<number | null>(null);

  // Read saved scroll position ONCE on component mount before any scroll listener is attached
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = sessionStorage.getItem("restaurantOS:landingScrollY");
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        initialSavedScrollRef.current = parsed;
      }
    }
  }, []);

  // 1. Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = FRAME_START; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      if (img.complete && img.naturalWidth > 0) {
        img.onload = null;
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = images;
          setLoaded(true);
        }
      }
      images.push(img);
    }
  }, []);

  // Track scroll position for manual restoration during reloads (gated during boot/restoration)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handleScroll = () => {
      // Ignore premature scroll events to 0 during boot/hydration
      if (isBootingRef.current) return;
      sessionStorage.setItem("restaurantOS:landingScrollY", window.scrollY.toString());
    };

    const handlePageHide = () => {
      if (!isBootingRef.current) {
        sessionStorage.setItem("restaurantOS:landingScrollY", window.scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // 2. Setup GSAP ScrollTrigger and Canvas Rendering
  useGSAP(
    () => {
      if (!loaded || !canvasRef.current || !containerRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const images = imagesRef.current;

      const renderFrame = (index: number) => {
        if (!images[index]) return;
        const img = images[index];

        // Reduce overall scale by 15% for a less overwhelming, premium hero
        const scale = 0.85;
        const targetWidth = canvas.width * scale;
        const targetHeight = canvas.height * scale;

        const canvasRatio = targetWidth / targetHeight;
        const imgRatio = img.width / img.height;
        let renderWidth = targetWidth;
        let renderHeight = targetHeight;

        if (canvasRatio > imgRatio) {
          renderHeight = targetWidth / imgRatio;
        } else {
          renderWidth = targetHeight * imgRatio;
        }

        const offsetX = (canvas.width - renderWidth) / 2;
        // Shift downwards (+80px) to clear the fixed navbar entirely
        const offsetY = ((canvas.height - renderHeight) / 2) + 80;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
      };

      // Initial render
      renderFrame(0);

      // ScrollTrigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=5000",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          const frameIndex = Math.floor(self.progress * (FRAME_COUNT - 1));
          
          requestAnimationFrame(() => {
            if (renderState.current.frame !== frameIndex) {
              renderState.current.frame = frameIndex;
              renderFrame(frameIndex);
            }
          });
        },
      });

      // Force calculate dimensions
      ScrollTrigger.refresh();

      // Single-owner scroll restoration
      if (!hasRestored.current) {
        hasRestored.current = true;

        const hash = window.__restoreHash || window.location.hash;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const isReloadOrBack = navigation && (navigation.type === 'reload' || navigation.type === 'back_forward');

        if (hash === "#operations") {
          const section = document.getElementById("operations");
          if (section) {
            const targetTop = section.getBoundingClientRect().top + window.scrollY + 72;
            window.scrollTo(0, targetTop);
          }
          window.history.replaceState(null, "", "#operations");
        } else if (isReloadOrBack && initialSavedScrollRef.current !== null) {
          window.scrollTo(0, initialSavedScrollRef.current);
        }

        // Enable scroll position writer AFTER single restoration finishes
        requestAnimationFrame(() => {
          isBootingRef.current = false;
        });
      }

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(renderState.current.frame);
      };
      
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [loaded], scope: containerRef }
  );

  const stageIndex = Math.min(
    Math.floor(scrollProgress * STORY_STAGES.length),
    STORY_STAGES.length - 1
  );
  const activeStage = STORY_STAGES[stageIndex];

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById("operations");
    if (!section) return;

    // Target the section top boundary with +72px offset to position the content 72px upward
    const targetTop = section.getBoundingClientRect().top + window.scrollY + 72;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    window.history.pushState(null, "", "#operations");
  };

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex flex-col justify-center">
      {!loaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-50">
          <Loader2 className="size-8 animate-spin text-brand mb-4" />
          <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-100 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm mt-4 tracking-widest font-mono">
            INITIALIZING {loadProgress}%
          </p>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
          />
          
          {/* Custom Progress Indicator */}
          <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <ProgressIndicator progress={scrollProgress} />
          </div>

          {/* Narrative Storytelling Elements */}
          <div 
            className="absolute inset-0 flex flex-col justify-start px-6 md:px-32 max-w-7xl mx-auto z-10 pointer-events-none md:pl-64 pt-[15vh] md:pt-[22vh] transition-opacity duration-300"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={stageIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl pointer-events-auto"
              >
                <TextEffect 
                  per="word" 
                  preset="fade" 
                  className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight drop-shadow-2xl"
                >
                  {activeStage.title}
                </TextEffect>
                
                {activeStage.subtitle && (
                  <div className="mt-12 flex flex-col gap-2 drop-shadow-lg">
                    {activeStage.subtitle.split('\n').map((line, i) => (
                      <TextEffect 
                        key={i}
                        per="word"
                        delay={0.4 + (i * 0.1)}
                        preset="fade"
                        className="text-xl md:text-2xl text-zinc-400 font-light w-full"
                      >
                        {line}
                      </TextEffect>
                    ))}
                  </div>
                )}

                {activeStage.showCTA && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-24"
                  >
                    <a href="#operations" onClick={handleCTAClick}>
                      <Button size="lg" className="glow-brand group text-base h-14 px-10 text-white shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                        See RestaurantOS in Action
                        <ArrowRight className="ml-3 size-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Scroll Prompt */}
          <motion.div 
            animate={{ opacity: scrollProgress > 0.05 ? 0 : 0.9 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/25 to-white/70" />
            <span className="text-[10px] tracking-[0.4em] text-zinc-300 uppercase mt-2.5 font-medium">Scroll</span>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChefHat, ArrowRight } from "lucide-react";
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

  // Claim scroll restoration ownership immediately on module parse — before
  // any React effect or browser restoration can run.
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Strip the hash from the URL before React hydrates to prevent the browser
  // from jumping to the anchor natively. We restore it manually after layout.
  if (window.location.hash === "#operations") {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
    window.__restoreHash = "#operations";
  }
}

// ── Module-level flags ───────────────────────────────────────────────────────
// isInitialPageLoad: true on a fresh browser load; set to false after the
// first SequenceHero mount so the boot overlay is skipped on client-side
// Next.js navigations where the JS module is not re-parsed.
let isInitialPageLoad = true;

// Minimum ms the boot overlay stays visible once mounted.
const MIN_BOOT_VISIBLE = 500;

// ── Frame constants ──────────────────────────────────────────────────────────
const FRAME_COUNT = 269;
const FRAME_START = 1;

function getFrameUrl(index: number) {
  const paddedIndex = index.toString().padStart(3, "0");
  return `/sequence/frames/ezgif-frame-${paddedIndex}.webp`;
}

// ── Story stages ─────────────────────────────────────────────────────────────
const STORY_STAGES = [
  {
    title: "RestaurantOS",
    subtitle: "The engine for modern restaurant operations.",
    showCTA: false,
  },
  {
    title: "Start every shift with clarity.",
    subtitle: "",
    showCTA: false,
  },
  {
    title: "Total visibility, instantly.",
    subtitle:
      "Live tables, active orders, kitchen flow,\nand revenue—all synchronized in real time.",
    showCTA: false,
  },
  {
    title: "Everything in one place.",
    subtitle: "",
    showCTA: false,
  },
  {
    title: "RestaurantOS",
    subtitle: "One intelligent platform.\nFrom the front door to the back office.",
    showCTA: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
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

  // ── Boot overlay state ────────────────────────────────────────────────────
  // bootComplete: single source of truth set at the END of scroll restoration.
  // showBootOverlay: initialized to true via isInitialPageLoad so Next.js SSR
  // includes the fixed full-screen overlay directly in the initial server HTML.
  const [bootComplete, setBootComplete] = useState(false);
  const [showBootOverlay, setShowBootOverlay] = useState(() => isInitialPageLoad);
  const bootOverlayShownAtRef = useRef<number | null>(null);
  const prevBodyOverflowRef = useRef("");

  // Lock body scroll and record mount time as soon as the overlay is active
  useEffect(() => {
    if (!showBootOverlay) return;
    prevBodyOverflowRef.current = document.body.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    bootOverlayShownAtRef.current = Date.now();
  }, [showBootOverlay]);

  // Dismiss the overlay once boot is complete, enforcing MIN_BOOT_VISIBLE so
  // it is never visible for only a single frame.
  useEffect(() => {
    if (!bootComplete || !showBootOverlay) return;
    const elapsed =
      bootOverlayShownAtRef.current !== null
        ? Date.now() - bootOverlayShownAtRef.current
        : 0;
    const remaining = Math.max(0, MIN_BOOT_VISIBLE - elapsed);
    const timer = setTimeout(() => {
      setShowBootOverlay(false);
      document.body.style.overflow = prevBodyOverflowRef.current;
      isInitialPageLoad = false;
    }, remaining);
    return () => clearTimeout(timer);
  }, [bootComplete, showBootOverlay]);

  // Failsafe: if initialization never completes (network failure, missing
  // canvas context, etc.) dismiss the overlay after 30 s rather than blocking
  // the page permanently.
  useEffect(() => {
    if (!showBootOverlay) return;
    const timer = setTimeout(() => setBootComplete(true), 30_000);
    return () => clearTimeout(timer);
  }, [showBootOverlay]);

  // ── Pre-boot scroll read ──────────────────────────────────────────────────
  // Read the saved scroll position exactly once, before any scroll listener
  // is attached, so GSAP's temporary layout changes cannot overwrite it.
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

  // ── Frame preloader ───────────────────────────────────────────────────────
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
      // Already cached: onload won't fire; handle synchronously.
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

  // ── Scroll position tracking ──────────────────────────────────────────────
  // Gated by isBootingRef so scroll events emitted during GSAP layout
  // initialization do not overwrite the pre-read saved position.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // scrollRestoration = "manual" is already set at module-parse time (above).
    // Do NOT repeat the assignment here and do NOT reset it in the cleanup —
    // the module-level code owns this for the lifetime of the bundle.

    const handleScroll = () => {
      if (isBootingRef.current) return;
      sessionStorage.setItem(
        "restaurantOS:landingScrollY",
        window.scrollY.toString()
      );
    };

    const handlePageHide = () => {
      if (!isBootingRef.current) {
        sessionStorage.setItem(
          "restaurantOS:landingScrollY",
          window.scrollY.toString()
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, []);

  // ── GSAP / ScrollTrigger / Canvas ─────────────────────────────────────────
  useGSAP(
    () => {
      if (!loaded || !canvasRef.current || !containerRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Canvas context unavailable — release the boot overlay so the page
        // is not permanently blocked.
        isBootingRef.current = false;
        setBootComplete(true);
        return;
      }

      const images = imagesRef.current;

      const renderFrame = (index: number) => {
        if (!images[index]) return;
        const img = images[index];

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
        // Shift downward 80px to clear the fixed navbar.
        const offsetY = (canvas.height - renderHeight) / 2 + 80;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
      };

      // Set canvas dimensions FIRST so GSAP measures the correct viewport and
      // renderFrame has valid canvas.width/height before ScrollTrigger.create.
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(renderState.current.frame);
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // sets dims + draws frame 0

      // Pin the hero and drive canvas frame via scroll progress.
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

      // Force-recalculate trigger positions after the pin spacer is inserted.
      ScrollTrigger.refresh();

      // ── Single-owner scroll restoration ──────────────────────────────────
      // Deferred by exactly one requestAnimationFrame so the browser has
      // committed the pin-spacer's 5 000 px layout before scrollTo is called.
      // Without this deferral scrollY is clamped to ~0.
      //
      // Priority (evaluated inside the rAF, when layout is stable):
      //   1. #operations + reload/back + savedY inside section  → exact savedY
      //   2. #operations (any other case)                       → section anchor
      //   3. reload/back + savedY exists                        → exact savedY
      //   4. fresh visit                                        → no manual scroll
      //
      // setBootComplete(true) fires at the very end — the page is stable and
      // the overlay is safe to fade out.
      // ─────────────────────────────────────────────────────────────────────
      if (!hasRestored.current) {
        hasRestored.current = true;

        // Capture metadata synchronously before the rAF tick.
        const hash = window.__restoreHash || window.location.hash;
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        const isReloadOrBack =
          navigation &&
          (navigation.type === "reload" || navigation.type === "back_forward");
        const savedY = initialSavedScrollRef.current;

        requestAnimationFrame(() => {
          const section = document.getElementById("operations");

          if (hash === "#operations") {
            let scrolledToSaved = false;

            if (isReloadOrBack && savedY !== null && section) {
              // savedY is absolute (window.scrollY at save time).
              // getBoundingClientRect() is viewport-relative, so both bounds
              // must be converted to document-absolute coords via + scrollY.
              // A single rect snapshot avoids two separate layout reflows.
              const rect = section.getBoundingClientRect();
              const sectionTop    = rect.top    + window.scrollY;
              const sectionBottom = rect.bottom + window.scrollY;
              const savedIsInSection =
                savedY >= sectionTop && savedY <= sectionBottom;

              if (savedIsInSection) {
                window.scrollTo(0, savedY);
                scrolledToSaved = true;
              }
            }

            if (!scrolledToSaved) {
              // Fresh navigation to #operations or stale savedY outside
              // the section: scroll to the section anchor once.
              if (section) {
                const anchorTarget =
                  section.getBoundingClientRect().top + window.scrollY + 72;
                window.scrollTo(0, anchorTarget);
              }
            }

            // Keep #operations in the URL regardless of which path ran.
            window.history.replaceState(null, "", "#operations");
          } else if (isReloadOrBack && savedY !== null) {
            // Non-hash reload: restore exact saved position.
            window.scrollTo(0, savedY);
          }
          // else: fresh visit — no manual scroll.

          // Restoration complete. Enable scroll-position saving and release
          // the boot overlay.
          isBootingRef.current = false;
          setBootComplete(true);
        });
      }

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [loaded], scope: containerRef }
  );

  // ── Derived rendering values ──────────────────────────────────────────────
  const stageIndex = Math.min(
    Math.floor(scrollProgress * STORY_STAGES.length),
    STORY_STAGES.length - 1
  );
  const activeStage = STORY_STAGES[stageIndex];

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById("operations");
    if (!section) return;
    // CTA uses smooth scrolling (not instant); boot overlay is not involved.
    const targetTop =
      section.getBoundingClientRect().top + window.scrollY + 72;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
    window.history.pushState(null, "", "#operations");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Hero container — always mounted so GSAP can measure layout while
          the boot overlay is covering the page. */}
      <div
        ref={containerRef}
        className="relative h-screen w-full bg-black overflow-hidden flex flex-col justify-center"
      >
        {loaded && (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
            />

            {/* Scroll progress indicator */}
            <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden md:block">
              <ProgressIndicator progress={scrollProgress} />
            </div>

            {/* Narrative storytelling */}
            <div className="absolute inset-0 flex flex-col justify-start px-6 md:px-32 max-w-7xl mx-auto z-10 pointer-events-none md:pl-64 pt-[15vh] md:pt-[22vh] transition-opacity duration-300">
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
                      {activeStage.subtitle.split("\n").map((line, i) => (
                        <TextEffect
                          key={i}
                          per="word"
                          delay={0.4 + i * 0.1}
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
                        <Button
                          size="lg"
                          className="glow-brand group text-base h-14 px-10 text-white shadow-[0_0_40px_rgba(234,179,8,0.3)]"
                        >
                          See RestaurantOS in Action
                          <ArrowRight className="ml-3 size-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Scroll prompt */}
            <motion.div
              animate={{ opacity: scrollProgress > 0.05 ? 0 : 0.9 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
            >
              <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/25 to-white/70" />
              <span className="text-[10px] tracking-[0.4em] text-zinc-300 uppercase mt-2.5 font-medium">
                Scroll
              </span>
            </motion.div>
          </>
        )}
      </div>

      {/* ── Boot overlay ────────────────────────────────────────────────────
          Fixed full-screen; sits above everything (z-[9999]).
          Rendered directly in the initial server HTML (SSR) so the browser
          paints the black overlay on frame 0 before any JS execution, canvas
          preloading, GSAP pin-spacer creation, or scroll restoration.
          Released only after setBootComplete fires inside the final restoration
          requestAnimationFrame.
          ─────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showBootOverlay && (
          <motion.div
            key="boot-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none"
          >
            {/* Ambient brand glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] bg-brand/5 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-10">
              {/* Brand mark */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-brand/20 shadow-[0_0_48px_rgba(234,179,8,0.08)]">
                  <ChefHat className="size-12 text-brand" />
                </div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  Restaurant<span className="text-brand">OS</span>
                </p>
              </div>

              {/* Progress */}
              <div className="flex flex-col items-center gap-3 w-52">
                <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <p className="text-zinc-500 text-[11px] tracking-[0.3em] font-mono uppercase">
                  Initialising&ensp;{loadProgress}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

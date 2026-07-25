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
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const FRAME_COUNT = 269;
const FRAME_START = 1;

function getFrameUrl(index: number) {
  const paddedIndex = index.toString().padStart(3, "0");
  return `/sequence/frames/ezgif-frame-${paddedIndex}.jpg`;
}

const STORY_STAGES = [
  {
    title: "RestaurantOS",
    subtitle: "The operating system for modern restaurants.",
    showCTA: false
  },
  {
    title: "Every table connected.",
    subtitle: "",
    showCTA: false
  },
  {
    title: "Every order synchronized.",
    subtitle: "",
    showCTA: false
  },
  {
    title: "Every decision informed.",
    subtitle: "",
    showCTA: false
  },
  {
    title: "RestaurantOS",
    subtitle: "One intelligent platform.\nFrom reservation to revenue.",
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

  // Calculate active story stage
  const stageProgress = (scrollProgress * STORY_STAGES.length) % 1;
  const stageIndex = Math.min(
    Math.floor(scrollProgress * STORY_STAGES.length),
    STORY_STAGES.length - 1
  );
  const activeStage = STORY_STAGES[stageIndex];
  const isFirstStage = stageIndex === 0;
  const isLastStage = stageIndex === STORY_STAGES.length - 1;

  let containerOpacity = 1;
  let containerTranslateY = 0;
  if (isFirstStage) {
    containerOpacity = Math.max(0, 1 - stageProgress * 1.5);
  } else if (isLastStage) {
    // Fade out and translate down gently over the second half of the final stage
    const fadeProgress = Math.max(0, (stageProgress - 0.5) * 2);
    containerOpacity = 1 - fadeProgress;
    containerTranslateY = fadeProgress * 20; // 20px downward ease
  }

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
            style={{ 
              opacity: containerOpacity,
              transform: `translateY(${containerTranslateY}px)`
            }}
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
                    <Link href="/login">
                      <Button size="lg" className="glow-brand group text-base h-14 px-10 text-white shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                        See RestaurantOS in Action
                        <ArrowRight className="ml-3 size-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Scroll Prompt */}
          <motion.div 
            animate={{ opacity: scrollProgress > 0.05 ? 0 : 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-white/40" />
            <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mt-8">Scroll</span>
          </motion.div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import MuseumShowcase from "./components/MuseumShowcase";
import Epilogue from "./components/Epilogue";

export default function App() {
  const [isDayMode, setIsDayMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight || 800;
      // scrollProgress goes from 0 to 2 over 300vh (which has 2 viewports of scroll)
      const progress = Math.min(Math.max(scrollY / viewportHeight, 0), 2);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-[300vh] bg-black text-white selection:bg-white selection:text-black antialiased">
      {/* Absolute Loading Layer */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader key="app-preloader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Experience Layer */}
      <div 
        className="transition-all duration-1000 ease-out"
        style={{
          opacity: isLoading ? 0 : 1,
          transform: isLoading ? "scale(0.98)" : "scale(1)",
          filter: isLoading ? "blur(10px)" : "blur(0px)"
        }}
      >
        <Navbar isDayMode={isDayMode} setIsDayMode={setIsDayMode} />

        {/* Cinematic Scroll Storytelling Matrix */}
        <div id="experience-viewport" className="relative h-[300vh] w-full bg-black">
          
          {/* Sticky container that keeps the scenes locked in view while scroll morphs them */}
          <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
            
            {/* 1. Hero Section Canvas Layer */}
            <div 
              className="absolute inset-0 w-full h-full transition-all duration-300"
              style={{
                // Hero fades out as scrollProgress goes from 0.0 to 1.0
                opacity: Math.max(1 - scrollProgress * 1.5, 0),
                zIndex: scrollProgress > 0.5 ? 5 : 10,
                pointerEvents: scrollProgress > 0.5 ? "none" : "auto"
              }}
            >
              <Hero isDayMode={isDayMode} scrollProgress={Math.min(scrollProgress, 1)} />
            </div>

            {/* 2. Museum Showcase Section Canvas Layer */}
            <div 
              className="absolute inset-0 w-full h-full transition-all duration-300"
              style={{
                // Museum Showcase reveals from 0 to 1 as progress goes 0 to 1, then exits smoothly past 1.0
                opacity: scrollProgress <= 1.0
                  ? scrollProgress
                  : Math.max(1 - (scrollProgress - 1.0) * 1.5, 0),
                zIndex: (scrollProgress > 0.5 && scrollProgress < 1.5) ? 15 : 6,
                // Block clicks on museum unless it is mostly active
                pointerEvents: (scrollProgress > 0.7 && scrollProgress < 1.4) ? "auto" : "none"
              }}
            >
              <MuseumShowcase isDayMode={isDayMode} scrollProgress={scrollProgress <= 1.0 ? scrollProgress : Math.max(2.0 - scrollProgress, 0)} />
            </div>

            {/* 3. Cinematic Epilogue Section Canvas Layer */}
            <div 
              className="absolute inset-0 w-full h-full transition-all duration-300 bg-black"
              style={{
                // Epilogue rises softly as Showcase exits past 1.0
                opacity: Math.min(Math.max((scrollProgress - 1.0) / 0.8, 0), 1),
                zIndex: scrollProgress > 1.5 ? 18 : 3,
                pointerEvents: scrollProgress > 1.7 ? "auto" : "none"
              }}
            >
              <Epilogue scrollProgress={Math.min(Math.max(scrollProgress - 1.0, 0), 1)} />
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes driftTransitionFog {
          0% { transform: translate(-25%, 0) scale(1.0); }
          50% { transform: translate(-15%, -8px) scale(1.03); }
          100% { transform: translate(-25%, 0) scale(1.0); }
        }
      `}</style>
    </main>
  );
}

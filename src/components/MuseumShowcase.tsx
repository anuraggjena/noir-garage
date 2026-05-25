import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

interface MuseumShowcaseProps {
  isDayMode: boolean;
  scrollProgress: number;
}

interface Vehicle {
  id: string;
  title: string;
  specs: string[];
  hiddenFact: string;
  videoUrl: string;
}

const VEHICLES: Vehicle[] = [
  {
    id: "mazda",
    title: "Mazda RX-7 FD",
    specs: ["1.3L Twin-Rotor", "276 HP"],
    hiddenFact: "Its rotary engine was so compact, it sat entirely behind the front axle for near-perfect balance.",
    videoUrl: "https://cllwa54wrlahioan.public.blob.vercel-storage.com/mazda.realesrgan.webm",
  },
  {
    id: "lambo",
    title: "Lamborghini LM002",
    specs: ["5.2L V12", "444 HP"],
    hiddenFact: "Originally developed from a military prototype, it became one of the world’s first luxury super SUVs.",
    videoUrl: "https://cllwa54wrlahioan.public.blob.vercel-storage.com/lambo.realesrgan.webm",
  },
  {
    id: "jaguar",
    title: "Jaguar XJ220",
    specs: ["3.5L Twin-Turbo V6", "217 MPH"],
    hiddenFact: "For years, it remained the fastest production car ever built in Britain.",
    videoUrl: "https://cllwa54wrlahioan.public.blob.vercel-storage.com/jaguar.realesrgan.webm",
  }
];

export default function MuseumShowcase({ isDayMode, scrollProgress }: MuseumShowcaseProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoBlobUrls, setVideoBlobUrls] = useState<Record<string, string>>({});

  // Calculate detailed cinematic progressive reveal stages based on global scrollProgress
  // 1. Atmos / Spotlights opacity (appears first, between progress 0.15 and 0.60)
  const atmosProgress = Math.min(Math.max((scrollProgress - 0.15) / 0.45, 0), 1);

  // 2. Car show reel videos opacity (appears second, between progress 0.45 and 0.85)
  const carProgress = Math.min(Math.max((scrollProgress - 0.45) / 0.40, 0), 1);

  // 3. Editorial typography and system interfaces (appears last, between progress 0.65 and 0.95)
  const uiProgress = Math.min(Math.max((scrollProgress - 0.65) / 0.30, 0), 1);

  // Keep a reference list for the preloaded videos and ensure they play
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, VEHICLES.length);
  }, []);

  // Preload and cache all video files locally for smooth scrolling and zero buffering
  useEffect(() => {
    VEHICLES.forEach((v) => {
      const url = v.videoUrl;
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load video item");
          return res.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          setVideoBlobUrls((prev) => ({ ...prev, [v.id]: blobUrl }));
        })
        .catch((err) => {
          console.warn(`Video preloading of ${v.title} fell back to live streaming:`, err);
        });
    });

    // Cleanup blob URLs on unmount to prevent resource memory leaks
    return () => {
      (Object.values(videoBlobUrls) as string[]).forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (_) {}
      });
    };
  }, []);

  // Guarantee that all videos start and keep playing, ALWAYS MUTED for seamless display
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      
      // Video is completely muted under all conditions
      video.muted = true;

      // Always try to play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Normal browser autoplay protection - log softly and try again when user interacts
          console.log("Video autoplay deferred till interaction:", error.message);
        });
      }
    });
  }, [currentIdx]);

  // Sync index and playback state (or reset playback if needed on change)
  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % VEHICLES.length);
  };

  const currentVehicle = VEHICLES[currentIdx];
  const nextVehicle = VEHICLES[(currentIdx + 1) % VEHICLES.length];

  return (
    <section
      id="museum-showcase"
      className="relative w-full h-full bg-black text-white select-none overflow-hidden flex items-center"
    >
      {/* 3. Curator Showcase Title in Left Top Corner */}
      <div 
        className="absolute top-8 left-6 sm:left-12 z-20 pointer-events-auto transition-all duration-300"
        style={{ opacity: uiProgress }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.35em] text-white/90 uppercase">
            CURATOR SHOWCASE
          </span>
        </div>
      </div>
      {/* Subtle cinematic cinematic scanner grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-[11] opacity-[0.03] transition-all duration-100"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          opacity: atmosProgress * 0.03
        }}
      />

      {/* FULLSCREEN VIDEO ENGINE: Preload all videos stacked with opacity transition */}
      <div 
        className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black transition-all duration-100"
        style={{ opacity: carProgress }}
      >
        {VEHICLES.map((v, index) => {
          const isActive = index === currentIdx;
          const directStreamUrl = v.videoUrl;
          const cachedSrc = videoBlobUrls[v.id] || directStreamUrl;
          
          return (
            <div
              key={v.id}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center bg-black"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0,
              }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={cachedSrc}
                autoPlay
                loop
                muted={true}
                playsInline
                preload="auto"
                className="w-full h-full object-cover absolute inset-0"
                style={{
                  filter: "none",
                  transform: "none"
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Atmospheric Fog Drift & Fine cinematic dust falling (subtle & elegant) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[12] mix-blend-screen filter blur-[10px] transition-all duration-100"
        style={{ opacity: atmosProgress * 0.08 }}
      >
        <div 
          className="absolute top-1/4 left-[-100%] w-[200%] h-48 bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent" 
          style={{ 
            animation: 'driftCinemaFog 40s linear infinite',
          }}
        />
        <div 
          className="absolute bottom-1/3 left-0 w-[200%] h-64 bg-gradient-to-r from-transparent via-zinc-500/15 to-transparent"
          style={{ 
            animation: 'driftCinemaFogDelayed 50s linear infinite',
          }}
        />
      </div>

      {/* Ambient particles (very rare, fine, luxury particles layer) */}
      <div 
        className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-[12] transition-all duration-100"
        style={{ opacity: atmosProgress * 0.14 }}
      >
        <div className="absolute top-[10%] left-[20%] w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[60%] left-[45%] w-[2px] h-[2px] rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[40%] left-[75%] w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* MAIN TYPOGRAPHY & STORYTELLING INTERFACE */}
      <div 
        className="relative z-20 w-full max-w-none px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 grid grid-cols-1 lg:grid-cols-12 pointer-events-none transition-all duration-200"
        style={{ 
          opacity: uiProgress,
          transform: `translateY(${(1 - uiProgress) * 20}px)`
        }}
      >
        
        {/* Left-side storytelling typography column */}
        <div className="lg:col-span-8 xl:col-span-7 flex flex-col justify-center text-left py-12 select-text pointer-events-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVehicle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl flex flex-col items-start gap-4 sm:gap-6"
            >
              {/* Exhibit Number Stamp (minimal and clean) */}
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 leading-none">
                <span>EXHIBIT 0{currentIdx + 1}</span>
              </div>

              {/* Title Header (Exquisite Serif font) */}
              <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light italic tracking-tight text-white leading-tight drop-shadow-md">
                {currentVehicle.title}
              </h2>

              {/* Specs Stack */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 py-2 border-y border-white/10 w-full max-w-md my-1">
                {currentVehicle.specs.map((spec, sIdx) => (
                  <div key={spec} className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-white/40 tracking-wider">0{sIdx + 1}</span>
                    <span className="font-sans text-xs sm:text-sm font-light text-white/90 tracking-wide">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>

              {/* Long Description / Hidden Fact */}
              <div className="space-y-2 max-w-lg">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 block">
                  Curation Backstory
                </span>
                <p className="font-sans font-light text-sm sm:text-base leading-relaxed text-white/80 max-w-md drop-shadow-sm italic">
                  “{currentVehicle.hiddenFact}”
                </p>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right side space is left clean & empty for composition, letting video details stand out */}
        <div className="lg:col-span-5" />

      </div>

      {/* CONTROLS LAYER */}

      {/* 2. Premium Next exhibit button in the bottom-right corner */}
      <div 
        className="absolute bottom-6 right-6 sm:right-12 z-20 pointer-events-auto flex items-center justify-end transition-all duration-200"
        style={{ opacity: uiProgress }}
      >
        <button
          onClick={handleNext}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300 cursor-pointer"
        >
          {/* Background hover light glow shimmer */}
          <div className="absolute inset-0 rounded-full bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors pointer-events-none" />

          <span className="font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase block leading-none group-hover:text-white transition-colors">
            Next Exhibit
          </span>

          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-white/60 group-hover:text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        </button>
      </div>

      {/* Mini dots indicator (top right side, elegant list index indicator) */}
      <div 
        className="absolute top-24 right-6 sm:right-12 z-20 pointer-events-auto flex flex-col gap-3 transition-all duration-200"
        style={{ opacity: uiProgress }}
      >
        {VEHICLES.map((v, index) => {
          const isActive = index === currentIdx;
          return (
            <button
              key={v.id}
              onClick={() => setCurrentIdx(index)}
              className="group flex items-center justify-end gap-3 cursor-pointer"
            >
              <span className={`font-mono text-[10px] tracking-widest text-right transition-all duration-300 ${isActive ? "text-white opacity-90 scale-105" : "text-white/20 group-hover:text-white/40"}`}>
                {v.id.toUpperCase()}
              </span>
              <div 
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${
                  isActive ? "bg-white scale-125 ring-2 ring-white/20" : "bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Embedded drifting fog keyframes */}
      <style>{`
        @keyframes driftCinemaFog {
          0% { transform: translateX(-35%) scale(1.0); }
          50% { transform: translateX(5%) scale(1.05); }
          100% { transform: translateX(-35%) scale(1.0); }
        }
        @keyframes driftCinemaFogDelayed {
          0% { transform: translateX(5%) scale(1.05); }
          50% { transform: translateX(-35%) scale(1.0); }
          100% { transform: translateX(5%) scale(1.05); }
        }
      `}</style>
    </section>
  );
}

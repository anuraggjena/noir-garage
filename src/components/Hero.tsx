import React, { useState, useEffect, useRef } from "react";
import { Check, AlertCircle, ArrowUpRight, Sparkles, LogOut, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  isDayMode: boolean;
  scrollProgress?: number;
}

export default function Hero({ isDayMode, scrollProgress = 0 }: HeroProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeSubscribers, setActiveSubscribers] = useState<string[]>([]);
  const [showSubscribers, setShowSubscribers] = useState(false);

  // Video refs for play-status orchestration
  const dayVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstMount = useRef(true);

  // Orchestrate dynamic blur transition on active toggle
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setIsTransitioning(true);
    const handler = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [isDayMode]);

  // Initialize subscribers from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("inspired_subscribers");
      if (stored) {
        setActiveSubscribers(JSON.parse(stored));
      }
    } catch {
      // Fail silently for standard local isolation
    }
  }, []);

  // Keep both background videos actively warmed up and decoding in the background
  // to ensure that transitions are instantaneous with zero visual stalls
  useEffect(() => {
    const ignitePlayback = () => {
      if (dayVideoRef.current) {
        dayVideoRef.current.play().catch(() => {});
      }
      if (nightVideoRef.current) {
        nightVideoRef.current.play().catch(() => {});
      }
    };

    // Execute playback synchronization
    ignitePlayback();

    // Recheck play status periodically to override browser sleeping hooks
    const interval = setInterval(ignitePlayback, 2000);
    return () => clearInterval(interval);
  }, [isDayMode]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    setTimeout(() => {
      const updatedSubscribers = [...new Set([email, ...activeSubscribers])];
      setActiveSubscribers(updatedSubscribers);
      try {
        localStorage.setItem("inspired_subscribers", JSON.stringify(updatedSubscribers));
      } catch {
        // Fail silently
      }
      setStatus("success");
      setEmail("");
    }, 900);
  };

  const removeSubscriber = (idxToRemove: number) => {
    const updated = activeSubscribers.filter((_, idx) => idx !== idxToRemove);
    setActiveSubscribers(updated);
    try {
      localStorage.setItem("inspired_subscribers", JSON.stringify(updated));
    } catch {}
  };

  const clearAllSubscribers = () => {
    setActiveSubscribers([]);
    try {
      localStorage.removeItem("inspired_subscribers");
    } catch {}
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black pb-20 select-none">
      {/* Base Grid Underlay to enhance technical luxurious visual look */}
      <div className="absolute inset-0 bg-black opacity-30 mix-blend-overlay pointer-events-none z-[1]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} 
      />

      {/* Day Mode Cinematic Background Video via direct Express proxy router */}
      <video
        ref={dayVideoRef}
        key="day-video"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-1000 ease-in-out contrast-[1.02]"
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        style={{ 
          opacity: isDayMode ? 1 : 0,
          transform: `scale(${1 + scrollProgress * 0.15}) translateY(${scrollProgress * 30}px)`,
          filter: `brightness(0.95) blur(${scrollProgress * 5}px)`
        }}
      >
        <source src="https://cllwa54wrlahioan.public.blob.vercel-storage.com/porsche-day.realesrgan.webm" type="video/webm" />
      </video>

      {/* Night Mode Cinematic Background Video via direct Express proxy router */}
      <video
        ref={nightVideoRef}
        key="night-video"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-1000 ease-in-out contrast-[1.02]"
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        style={{ 
          opacity: isDayMode ? 0 : 1,
          transform: `scale(${1 + scrollProgress * 0.15}) translateY(${scrollProgress * 30}px)`,
          filter: `brightness(0.92) blur(${scrollProgress * 5}px)`
        }}
      >
        <source src="https://cllwa54wrlahioan.public.blob.vercel-storage.com/porsche-night.realesrgan.webm" type="video/webm" />
      </video>

      {/* Dynamic Darkening Overlay for smooth scroll transition */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[1] transition-opacity duration-100 ease-out"
        style={{ opacity: Math.min(scrollProgress * 1.5, 0.96) }}
      />

      {/* Elegant 8% Black Overlay sheet to preserve high text readability while keeping the backing video bright and clear */}
      <div className="absolute inset-0 bg-black/8 z-[1.1] pointer-events-none" />

      {/* Cinematic Blurry transition layer while swapping modes */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/10 backdrop-blur-2xl z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Ambient floating details to establish visual depth */}
      <div className="absolute top-1/4 left-1/12 animate-pulse rounded-full w-1 h-1 bg-white opacity-40 blur-[1px] z-10" />
      <div className="absolute top-1/3 right-1/10 animate-pulse delay-1000 rounded-full w-1.5 h-1.5 bg-white opacity-30 blur-[1.5px] z-10" />
      <div className="absolute bottom-1/4 left-1/8 animate-pulse delay-500 rounded-full w-1 h-1 bg-white opacity-20 z-10" />

      {/* Gradual bottom backdrop dark overlay list */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/15 via-black/5 to-transparent z-[1] pointer-events-none" />

      {/* Floating Mock/Demo db base button for developer preview persistence */}
      {activeSubscribers.length > 0 && (
        <div className="absolute bottom-6 left-6 z-40">
          <button 
            onClick={() => setShowSubscribers(!showSubscribers)}
            className="font-mono text-[9px] uppercase tracking-widest text-white/55 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
          >
            Subscribers ({activeSubscribers.length})
          </button>
        </div>
      )}

      {/* Core CTA & Message Display */}
      <div 
        className="relative z-10 text-center px-6 pt-10 md:pt-24 pb-8 max-w-5xl mx-auto flex flex-col items-center transition-all duration-100 ease-out"
        style={{
          opacity: Math.max(1 - scrollProgress * 1.8, 0),
          transform: `translateY(${-scrollProgress * 65}px)`
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 leading-[1.05] transition-all duration-100"
            style={{
              letterSpacing: `${scrollProgress * 0.12}em`
            }}
          >
            Vintage{" "}
            <span className="font-serif italic font-normal text-white/90 select-text">Souls.</span>{" "}
            Endless{" "}
            <span className="font-serif italic font-normal text-white/90 select-text">Roads.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg max-w-xl mx-auto text-white/80 font-serif font-normal leading-relaxed select-text"
          style={{ color: "hsl(var(--hero-subtitle))" }}
        >
          <em>"Built in another era, remembered in every reflection.
          <br />
          Where timeless machines meet cinematic atmospheres."</em>
        </motion.p>
      </div>

      {/* Subscribers visual debug database logs drawer */}
      <AnimatePresence>
        {showSubscribers && activeSubscribers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 w-80 liquid-glass rounded-2xl border border-white/10 p-4 max-h-72 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/55">DEMO BASE DB</span>
              <button 
                onClick={clearAllSubscribers}
                type="button"
                className="text-[9px] uppercase font-mono tracking-wider text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Clear All
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 space-y-1 scrollbar-thin select-text">
              {activeSubscribers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono text-white/75 bg-white/[0.02] rounded px-2.5 py-1.5 hover:bg-white/[0.05] transition-all">
                  <span className="truncate flex-1 pr-2">{item}</span>
                  <button
                    onClick={() => removeSubscriber(idx)}
                    className="text-white/30 hover:text-white/80 p-0.5 rounded transition-all cursor-pointer"
                    title="Remove subscription entry"
                  >
                    <LogOut className="w-3 h-3 rotate-180" />
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-white/10 text-[8px] font-mono text-white/30 text-center uppercase tracking-widest">
              LOCALSTORAGE SANDBOX ENVIRONMENT
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

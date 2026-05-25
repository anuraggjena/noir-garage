import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, Moon, Sun, Star, Compass, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const easeOutQuint = (t: number) => 1 + --t * t * t * t * t;

const animateScrollTo = (targetY: number, duration = 1800) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuint(progress);

    window.scrollTo(0, startY + difference * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

interface NavbarProps {
  isDayMode: boolean;
  setIsDayMode: (val: boolean) => void;
}

export default function Navbar({ isDayMode, setIsDayMode }: NavbarProps) {
  const [showJourneyModal, setShowJourneyModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[3px]">
        <nav 
          id="navbar"
          className="relative z-10 flex row justify-between items-center px-8 py-6 max-w-7xl mx-auto"
        >
          {/* Logo element */}
          <motion.a
            href="#home"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic text-2xl tracking-tight text-white hover:opacity-95 transition-opacity select-none cursor-pointer flex items-center gap-1"
          >
            Noir Garage<sup className="text-xs font-sans not-italic font-normal text-white/60 ml-0.5">®</sup>
          </motion.a>

          {/* CTA + Premium Toggle Slider Switch controls side-by-side inside navbar */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Custom Interactive compact Mode Toggle Slider */}
            <div 
              onClick={() => setIsDayMode(!isDayMode)}
              className="relative w-16 h-9 rounded-full bg-zinc-950/85 border border-white/10 flex items-center cursor-pointer select-none group shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:border-white/20 transition-all active:scale-98"
            >
              {/* Slider Knob */}
              <div
                className="w-7 h-7 rounded-full z-25 flex items-center justify-center transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{
                  position: "absolute",
                  left: isDayMode ? "4px" : "calc(100% - 32px)"
                }}
              >
                {/* Precision Glass sphere layer */}
                <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-[6px] border border-white/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.25)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-4/5 h-[40%] rounded-full bg-gradient-to-b from-white/25 to-transparent filter blur-[0.2px]" />
                </div>

                <AnimatePresence mode="wait">
                  {isDayMode ? (
                    <motion.div
                      key="navbar-sun"
                      initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="z-30 text-white flex items-center justify-center"
                    >
                      <Sun className="w-3.5 h-3.5 drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="navbar-moon"
                      initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="z-30 text-white flex items-center justify-center"
                    >
                      <Moon className="w-3.5 h-3.5 drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Begin Journey CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                animateScrollTo(window.innerHeight);
              }}
              className="liquid-glass rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm text-white select-none transition-transform duration-200 cursor-pointer font-medium tracking-wide"
            >
              Begin Journey
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Interactive Velvet Experience Modal */}
      <AnimatePresence>
        {showJourneyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJourneyModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl liquid-glass rounded-3xl p-8 sm:p-10 border border-white/15 overflow-hidden z-10"
            >
              <div className="absolute top-0 left-1/4 -translate-y-1/2 w-48 h-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
              
              <button
                onClick={() => setShowJourneyModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-1 rounded-full border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center mb-6">
                  <Compass className="w-5 h-5 text-white/80" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif italic mb-3 text-white leading-tight">
                  Your Creative Genesis
                </h2>
                
                <p className="text-sm text-white/60 max-w-md mx-auto mb-8 font-sans leading-relaxed">
                  Welcome to the Velorah matrix. By embarking on this trek, you gain early access to curate, analyze, and build responsive digital architectures with our team.
                </p>

                {/* Grid of features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Star className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Curated Feed</span>
                    </div>
                    <p className="text-xs text-white/55">Hand-picked breakthroughs in technology, design systems, and digital art direction.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Incubation Studio</span>
                    </div>
                    <p className="text-xs text-white/55">Priority testing of next-generation responsive app layouts and user environments.</p>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => {
                      setShowJourneyModal(false);
                      animateScrollTo(window.innerHeight);
                    }}
                    className="flex-1 bg-white text-black font-semibold tracking-wide text-xs sm:text-sm py-3.5 rounded-full hover:bg-white/90 active:scale-98 transition-all cursor-pointer font-mono"
                  >
                    COMMENCE
                  </button>
                  <button
                    onClick={() => setShowJourneyModal(false)}
                    className="flex-1 font-semibold tracking-wide text-xs sm:text-sm py-3.5 rounded-full border border-white/15 hover:bg-white/5 active:scale-98 transition-all cursor-pointer font-mono text-white/80"
                  >
                    GO BACK
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

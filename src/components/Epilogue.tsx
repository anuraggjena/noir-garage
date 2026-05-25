import React from "react";
import { motion } from "motion/react";

interface EpilogueProps {
  scrollProgress: number; // local progress of this section (0.0 to 1.0)
}

export default function Epilogue({ scrollProgress }: EpilogueProps) {
  // Calculate relative typography animations based on the scroll progress
  const line1Opacity = Math.min(Math.max((scrollProgress - 0.1) / 0.4, 0), 1);
  const line2Opacity = Math.min(Math.max((scrollProgress - 0.45) / 0.4, 0), 1);
  const line3Opacity = Math.min(Math.max((scrollProgress - 0.7) / 0.3, 0), 1);

  // Parallax subtle shifts for lines
  const yShift1 = (1 - line1Opacity) * 15;
  const yShift2 = (1 - line2Opacity) * 15;
  const yShift3 = (1 - line3Opacity) * 15;

  return (
    <div className="relative w-full h-full bg-black select-none flex flex-col justify-center items-center overflow-hidden font-sans text-white">
      {/* 1. Cinematic Background Noise Grain Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Soft Dynamic Moving Ambient Fog Haze */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div 
          className="absolute w-[180%] h-[180%] -top-1/3 -left-1/3 bg-radial-gradient from-zinc-800/5 via-transparent to-transparent opacity-40 blur-[130px]"
          style={{
            animation: "driftFogSlow 35s linear infinite",
            transform: `translate(${scrollProgress * -3}%, ${scrollProgress * -2}%)`
          }}
        />
        <div 
          className="absolute w-[160%] h-[160%] -bottom-1/3 -right-1/3 bg-radial-gradient from-zinc-900/10 via-transparent to-transparent opacity-30 blur-[120px]"
          style={{
            animation: "driftFogSlow2 28s linear infinite",
            transform: `translate(${scrollProgress * 2}%, ${scrollProgress * 3}%)`
          }}
        />
      </div>

      {/* 3. Infinite Floating Low-Opacity Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(12)].map((_, i) => {
          const delay = i * 1.8;
          const leftPosition = `${(i * 11) % 100}%`;
          const size = i % 2 === 0 ? "w-0.5 h-0.5" : "w-[1px] h-[1px]";
          
          return (
            <div
              key={i}
              className={`absolute rounded-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.4)] ${size}`}
              style={{
                left: leftPosition,
                bottom: "-10px",
                animation: `floatUpward ${12 + (i % 5) * 4}s linear infinite`,
                animationDelay: `-${delay}s`,
                opacity: 0.05 + ((i % 4) * 0.04)
              }}
            />
          );
        })}
      </div>

      {/* 4. Editorial Layout Frame */}
      <div 
        className="absolute top-12 left-1/2 font-mono text-[9px] tracking-[0.4em] pl-[0.4em] text-white/20 uppercase"
        style={{ 
          opacity: Math.min(scrollProgress * 1.5, 0.4),
          transform: "translateX(-50%)"
        }}
      >
        EPILOGUE // FIN
      </div>

      {/* 5. Center Slogan Text Presentation (Apple Editorial Luxury Style) */}
      <div className="relative z-20 max-w-4xl px-8 sm:px-16 text-center flex flex-col items-center justify-center gap-8 md:gap-11 select-text mx-auto">
        
        {/* Line 1 */}
        <p 
          className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed transition-all duration-700 ease-out text-center w-full max-w-2xl mx-auto"
          style={{
            opacity: line1Opacity,
            transform: `translateY(${yShift1}px)`,
          }}
        >
          <em>"Built in another era, these machines carried more than speed. They carried silence, atmosphere, and memories that never really faded."</em>
        </p>

        {/* Line 2 */}
        <p 
          className="font-sans text-xs sm:text-sm font-light uppercase tracking-[0.35em] pl-[0.35em] text-zinc-500/90 leading-relaxed mt-4 transition-all duration-700 ease-out text-center w-full"
          style={{
            opacity: line3Opacity,
            transform: `translateY(${yShift3}px)`,
          }}
        >
          Long after the road ends, the feeling still remains.
        </p>

      </div>

      {/* 6. Back to Top Elegant Micro-Affordance */}
      <div 
        className="absolute bottom-12 left-1/2 flex flex-col items-center gap-2 cursor-pointer pointer-events-auto"
        onClick={() => {
          // Scroll back to top smoothly
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        style={{
          opacity: Math.max((scrollProgress - 0.75) / 0.25, 0),
          transform: `translateX(-50%) translateY(${(1 - scrollProgress) * 10}px)`
        }}
      >
        <span className="font-mono text-[9px] tracking-[0.3em] pl-[0.3em] uppercase text-white/30 hover:text-white/60 transition-colors text-center">
          RETURN TO CREATION
        </span>
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-1 h-1 border-t border-l border-white/40 rotate-45"
        />
      </div>

      {/* Styled inline components animations specific to Epilogue scene */}
      <style>{`
        @keyframes driftFogSlow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-4%, 3%) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes driftFogSlow2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(3%, -4%) rotate(-2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes floatUpward {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--tw-opacity, 0.4); }
          90% { opacity: var(--tw-opacity, 0.4); }
          100% { transform: translateY(-110vh) translateX(30px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
  key?: string;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState(false);

  // Track actual resource loading status
  useEffect(() => {
    const controller = new AbortController();
    
    // Warm up the server endpoint and prime response caches with initial range queries
    const warmUp = async (url: string) => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { "Range": "bytes=0-500000" } // Request first 500KB to warm up streams
        });
        if (response.body) {
          const reader = response.body.getReader();
          while (true) {
            const { done } = await reader.read();
            if (done) break;
          }
        }
      } catch (err) {
        // Fallback gracefully on slow network or interruptions
      }
    };

    Promise.all([
      warmUp("https://cllwa54wrlahioan.public.blob.vercel-storage.com/porsche-day.realesrgan.webm"),
      warmUp("https://cllwa54wrlahioan.public.blob.vercel-storage.com/porsche-night.realesrgan.webm")
    ])
      .then(() => {
        setVideosLoaded(true);
      })
      .catch(() => {
        setVideosLoaded(true);
      });

    return () => controller.abort();
  }, []);

  // Luxury cinematic easing curve progress tracker
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();
    const duration = 4000; // 4 seconds targeted smooth curve

    const update = () => {
      const elapsed = Date.now() - startTime;
      let targetProgress = Math.min((elapsed / duration) * 100, 92);

      // Decelerate as it approaches 92% to wait for actual cache warming if needed
      if (videosLoaded) {
        // If caching is confirmed, surge seamlessly to 100%
        targetProgress = Math.min(targetProgress + (elapsed / 1000) * 18, 100);
      } else {
        // Soft crawl over time while warming completes
        targetProgress = Math.min(targetProgress + Math.random() * 0.1, 95);
      }

      setProgress(Math.round(targetProgress));

      if (targetProgress >= 100) {
        // Subtle hold at 100 for premium transition timing before completion
        setTimeout(() => {
          onComplete();
        }, 500);
      } else {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [videosLoaded, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#060608] z-[200] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Background cinematic soft ambient light spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.015] blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />
      
      {/* Precision horizontal coordinate grids */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      {/* Main Column */}
      <div className="w-full max-w-md px-10 flex flex-col items-center">
        
        {/* Top brand header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 text-center"
        >
          <span className="font-serif italic text-2xl tracking-widest text-white/90">
            Noir Garage
          </span>
          <span className="block font-mono text-[8px] uppercase tracking-[0.25em] text-white/35 mt-2">
            Timeless Motion
          </span>
        </motion.div>

        {/* Dynamic Interactive Progress Track Segment */}
        <div className="relative w-full h-[1.5px] bg-white/10 mb-10 mt-16 rounded-full">
          
          {/* Glowing underlying path tracking current progress */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/10 to-white/70 shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />

          {/* Luxury Moving Car Icon Overlay Node */}
          <div 
            className="absolute -top-[38px] transition-all duration-300 ease-out"
            style={{ 
              left: `${progress}%`,
              transform: "translateX(-50%)"
            }}
          >
            {/* The Car Outline Box with headlights reflection glow */}
            <div className="relative flex items-center justify-center">
              
              {/* Dynamic headlight beam cone projecting forward (to the right) */}
              <div 
                className="absolute left-[42px] w-[45px] top-[15px] h-[10px] bg-gradient-to-r from-white/30 to-transparent blur-[3px] pointer-events-none"
                style={{
                  clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)",
                  opacity: progress > 1 ? 0.85 : 0
                }}
              />

              {/* Dynamic soft luxury metallic chassis floor under-glow */}
              <div className="absolute w-[36px] h-[5px] bg-white/20 rounded-full blur-[5px] pointer-events-none top-[33px]" />

              {/* High-fidelity custom premium SVG car asset */}
              <svg
                viewBox="0 0 75 75"
                className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] select-none pointer-events-none"
              >
                <path 
                  d="M0 0 C1.25941406 -0.07089844 2.51882812 -0.14179688 3.81640625 -0.21484375 C13.00538304 -0.39804476 13.00538304 -0.39804476 17.02246094 2.60253906 C19.56374761 5.43186091 21.67347562 8.22195124 23.375 11.625 C26.62922822 12.23772079 29.88676866 12.58548395 33.17578125 12.96484375 C36.53518875 13.65805482 38.13970257 14.02619547 40.375 16.625 C40.87109375 19.875 40.87109375 19.875 40.8125 23.625 C40.81121094 24.8625 40.80992188 26.1 40.80859375 27.375 C40.375 30.625 40.375 30.625 39.015625 32.55078125 C36.75486805 34.03103878 35.01616503 33.83914852 32.375 33.625 C32.189375 34.553125 32.189375 34.553125 32 35.5 C31.375 37.625 31.375 37.625 29.375 39.625 C27.31640625 39.92578125 27.31640625 39.92578125 24.9375 39.9375 C23.76380859 39.96263672 23.76380859 39.96263672 22.56640625 39.98828125 C19.86361203 39.54022445 18.97494393 38.82170758 17.375 36.625 C17.375 35.635 17.375 34.645 17.375 33.625 C9.125 33.625 0.875 33.625 -7.625 33.625 C-8.285 34.945 -8.945 36.265 -9.625 37.625 C-11.625 39.625 -11.625 39.625 -15.5 40 C-18.69448727 39.9303021 -19.45878065 39.74966451 -22.125 37.75 C-23.625 35.625 -23.625 35.625 -23.625 33.625 C-24.553125 33.686875 -25.48125 33.74875 -26.4375 33.8125 C-29.625 33.625 -29.625 33.625 -31.296875 32.58203125 C-33.31560552 29.60737246 -33.09884299 26.59410366 -33.0625 23.125 C-33.08248047 22.44824219 -33.10246094 21.77148438 -33.12304688 21.07421875 C-33.11985876 17.84146616 -33.04407036 16.07831697 -30.80859375 13.66015625 C-28.625 12.625 -28.625 12.625 -25.25 12.5625 C-21.54771286 12.00308272 -21.54771286 12.00308272 -19.91015625 9.37890625 C-18.85975736 7.56831648 -17.85018714 5.73330616 -16.88671875 3.875 C-13.83070882 -1.57472668 -5.50648313 0.13835385 0 0 Z M-14.125 4.25 C-15.81729471 6.92946662 -17.20772072 9.79044144 -18.625 12.625 C-12.685 12.625 -6.745 12.625 -0.625 12.625 C-0.625 9.325 -0.625 6.025 -0.625 2.625 C-7.70392068 1.94537794 -7.70392068 1.94537794 -14.125 4.25 Z M1.375 2.625 C1.375 5.925 1.375 9.225 1.375 12.625 C7.645 12.625 13.915 12.625 20.375 12.625 C19.42625 11.34625 18.4775 10.0675 17.5 8.75 C16.69949219 7.67105469 16.69949219 7.67105469 15.8828125 6.5703125 C14.37626838 4.54247368 14.37626838 4.54247368 12.375 2.625 C9.70550591 2.38184344 9.70550591 2.38184344 6.75 2.5 C5.74710938 2.51804687 4.74421875 2.53609375 3.7109375 2.5546875 C2.55464844 2.58949219 2.55464844 2.58949219 1.375 2.625 Z M-29.625 16.625 C-31.3462728 20.0675456 -31.00015808 23.85332149 -30.625 27.625 C-29.57670604 30.22512138 -29.57670604 30.22512138 -27.625 31.625 C-26.305 31.625 -24.985 31.625 -23.625 31.625 C-22.965 29.645 -22.305 27.665 -21.625 25.625 C-20.02167209 25.54378076 -18.41715974 25.48570866 -16.8125 25.4375 C-15.91917969 25.40269531 -15.02585937 25.36789063 -14.10546875 25.33203125 C-11.625 25.625 -11.625 25.625 -9.86328125 26.94921875 C-8.625 28.625 -8.625 28.625 -7.625 31.625 C0.625 31.625 8.875 31.625 17.375 31.625 C18.035 29.975 18.695 28.325 19.375 26.625 C20.96394072 25.03605928 22.62301424 25.45501589 24.8125 25.4375 C26.01712891 25.41623047 26.01712891 25.41623047 27.24609375 25.39453125 C29.375 25.625 29.375 25.625 31.375 27.625 C32 29.75 32 29.75 32.375 31.625 C34.025 31.295 35.675 30.965 37.375 30.625 C38.2564688 27.98059361 38.53674818 26.34439248 38.5625 23.625 C38.57667969 22.944375 38.59085937 22.26375 38.60546875 21.5625 C38.48440411 19.29885868 38.48440411 19.29885868 36.375 16.625 C29.44325235 14.07782757 21.6966288 14.33126437 14.41796875 14.359375 C13.3119783 14.35746155 12.20598785 14.3555481 11.06648254 14.35357666 C8.74622366 14.35222408 6.42595696 14.35585523 4.10571289 14.36425781 C0.55532961 14.37502174 -2.9945536 14.36430452 -6.54492188 14.3515625 C-8.80729278 14.35288326 -11.06966337 14.35544392 -13.33203125 14.359375 C-14.39041702 14.35532654 -15.4488028 14.35127808 -16.53926086 14.34710693 C-17.52766464 14.35341125 -18.51606842 14.35971558 -19.53442383 14.36621094 C-20.83154045 14.36859772 -20.83154045 14.36859772 -22.15486145 14.37103271 C-24.96890637 14.66035873 -27.09283431 15.37397225 -29.625 16.625 Z M-19.5625 27.625 C-21.21471281 30.73504763 -20.31877357 33.28227278 -19.625 36.625 C-15.56554904 37.73158071 -15.56554904 37.73158071 -11.6875 36.625 C-10.03528719 33.51495237 -10.93122643 30.96772722 -11.625 27.625 C-15.68445096 26.51841929 -15.68445096 26.51841929 -19.5625 27.625 Z M21.125 28.3125 C19.09941423 30.49076328 19.09941423 30.49076328 19.4375 33.25 C20.24155546 35.94789761 20.24155546 35.94789761 23.375 37.625 C25.95833333 37.54166667 25.95833333 37.54166667 28.375 36.625 C30.65638945 33.86801816 30.65638945 33.86801816 30.1875 31.0625 C29.54127558 28.29244883 29.54127558 28.29244883 26.375 26.625 C23.30625 26.325 23.30625 26.325 21.125 28.3125 Z " 
                  fill="currentColor"
                  transform="translate(33.625,17.375)"
                />
              </svg>

            </div>
          </div>

        </div>

        {/* Narrative & Numerical Stats */}
        <div className="w-full flex justify-center text-white/50">
          {/* Minimal Elegant Counter format: e.g. "45%" */}
          <span className="font-mono text-[10px] tracking-widest text-white/70">
            {progress}%
          </span>
        </div>

      </div>
    </div>
  );
}

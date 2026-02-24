import React, { useEffect, useState, useRef } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import WorksIntro from "./sections/WorksIntro";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import CustomCursor from "./components/CustomCursor";
import { useProgress } from "@react-three/drei";

/* ─── Terminal boot lines ─────────────────────────────── */
const BOOT_LINES = [
  { text: "$ initializing runtime environment...", delay: 0,    color: "#606060" },
  { text: "$ loading webgl context          [OK]", delay: 260,  color: "#00ff88" },
  { text: "$ compiling glsl shaders...",           delay: 480,  color: "#606060" },
  { text: "$ mounting react fiber           [OK]", delay: 700,  color: "#00ff88" },
  { text: "$ preloading 3d mesh assets...",        delay: 920,  color: "#606060" },
  { text: "$ gsap timeline registered       [OK]", delay: 1160, color: "#00ff88" },
  { text: "$ lenis smooth scroll active     [OK]", delay: 1380, color: "#00d4ff" },
  { text: "$ all systems operational",             delay: 1650, color: "#00ff88" },
];

/* ─── Grid overlay ────────────────────────────────────── */
const GridOverlay = ({ progress }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ opacity: Math.min(progress / 45, 0.3) }}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="pgrid" width="64" height="64" patternUnits="userSpaceOnUse">
        <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#00ff88" strokeWidth="0.4" />
      </pattern>
      <radialGradient id="pgridFade" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="pgridMask">
        <rect width="100%" height="100%" fill="url(#pgridFade)" />
      </mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#pgrid)" mask="url(#pgridMask)" />
  </svg>
);

/* ─── Corner brackets ─────────────────────────────────── */
const CornerBracket = ({ top, left, bottom, right }) => {
  const path =
    top    !== undefined && left  !== undefined ? "M36 0 L0 0 L0 36" :
    top    !== undefined && right !== undefined ? "M0 0 L36 0 L36 36" :
    bottom !== undefined && left  !== undefined ? "M36 36 L0 36 L0 0" :
                                                  "M0 36 L36 36 L36 0";
  return (
    <svg
      width="36" height="36"
      className="absolute"
      style={{ top, left, bottom, right }}
      viewBox="0 0 36 36"
      fill="none"
    >
      <path d={path} stroke="#00ff88" strokeWidth="1.5" strokeOpacity="0.55" />
    </svg>
  );
};

/* ─── Glitch Name ─────────────────────────────────────── */
const GlitchName = ({ visible }) => {
  const [g, setG] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const ts = [
      setTimeout(() => setG(true), 80),
      setTimeout(() => setG(false), 200),
      setTimeout(() => setG(true), 380),
      setTimeout(() => setG(false), 480),
      setTimeout(() => setG(true), 900),
      setTimeout(() => setG(false), 960),
    ];
    return () => ts.forEach(clearTimeout);
  }, [visible]);

  return (
    <div
      style={{
        transform: visible ? "translateY(0)" : "translateY(50px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease",
      }}
    >
      <h1
        className="font-display font-light tracking-tight text-center select-none"
        style={{ fontSize: "clamp(2.8rem,8.5vw,6.4rem)", lineHeight: 1.0 }}
      >
        <span style={{ color: "#e5e5e5" }}>Anshu</span>
        {" "}
        <span
          className="relative inline-block"
          style={{
            color: "#00ff88",
            textShadow: "0 0 28px rgba(0,255,136,0.55), 0 0 70px rgba(0,255,136,0.18)",
            filter: g ? "blur(1.5px)" : "none",
            transform: g ? "translateX(3px)" : "none",
            transition: "filter 0.04s, transform 0.04s",
          }}
        >
          Raj
          {g && (
            <>
              <span className="absolute inset-0 font-display font-light pointer-events-none"
                style={{ color:"#00d4ff", clipPath:"inset(20% 0 55% 0)", transform:"translateX(-4px)", opacity:0.7 }}>
                Raj
              </span>
              <span className="absolute inset-0 font-display font-light pointer-events-none"
                style={{ color:"#ff2060", clipPath:"inset(60% 0 8% 0)", transform:"translateX(4px)", opacity:0.5 }}>
                Raj
              </span>
            </>
          )}
        </span>
      </h1>

      <p
        className="mt-3 font-mono text-center uppercase tracking-[0.32em]"
        style={{
          fontSize: "clamp(0.55rem, 1.5vw, 0.75rem)",
          color: "#555",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.5s",
        }}
      >
        Full-Stack Developer&nbsp;&nbsp;·&nbsp;&nbsp;3D & Animation Specialist
      </p>
    </div>
  );
};

/* ─── Terminal panel ──────────────────────────────────── */
const Terminal = ({ progress }) => {
  const [shown, setShown] = useState([]);
  const fired = useRef(false);

  useEffect(() => {
    if (progress < 6 || fired.current) return;
    fired.current = true;
    BOOT_LINES.forEach((l, i) => setTimeout(() => setShown(p => [...p, i]), l.delay));
  }, [progress]);

  return (
    <div
      style={{
        opacity: progress > 12 ? 1 : 0,
        transform: progress > 12 ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        background: "rgba(8,8,8,0.88)",
        border: "1px solid rgba(0,255,136,0.14)",
        borderRadius: 8,
        boxShadow: "0 0 50px rgba(0,0,0,0.7), 0 0 30px rgba(0,255,136,0.04)",
        width: "100%",
        maxWidth: 460,
      }}
    >
      {/* Titlebar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(0,255,136,0.08)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
        <span className="ml-3 font-mono tracking-widest uppercase" style={{ fontSize: 10, color: "#333" }}>
          portfolio.boot — zsh
        </span>
      </div>
      {/* Lines */}
      <div className="px-5 py-4" style={{ minHeight: 174 }}>
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className="font-mono"
            style={{
              fontSize: "clamp(10px,1.5vw,12px)",
              color: line.color,
              marginBottom: 6,
              opacity: shown.includes(i) ? 1 : 0,
              transform: shown.includes(i) ? "translateX(0)" : "translateX(-10px)",
              transition: "opacity 0.28s ease, transform 0.28s ease",
              textShadow: line.color === "#00ff88" ? "0 0 6px rgba(0,255,136,0.35)" : "none",
              letterSpacing: "0.03em",
            }}
          >
            {line.text}
            {i === BOOT_LINES.length - 1 && shown.includes(i) && (
              <span
                className="inline-block ml-1 w-1.5 h-3 align-middle"
                style={{ background: "#00d4ff", animation: "blink 1s step-end infinite" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Segmented progress bar ──────────────────────────── */
const SegmentedBar = ({ progress }) => {
  const total = 30;
  const filled = Math.floor((progress / 100) * total);
  const label = progress < 33 ? "Initializing" : progress < 66 ? "Loading Assets" : progress < 100 ? "Almost Ready" : "Ready";

  return (
    <div
      style={{
        width: "100%", maxWidth: 460,
        opacity: progress > 5 ? 1 : 0,
        transition: "opacity 0.5s ease 0.3s",
      }}
    >
      <div className="flex gap-[3px] mb-2.5">
        {Array.from({ length: total }).map((_, i) => {
          const pct = i / total;
          const color = pct < 0.33 ? "#00ff88" : pct < 0.66 ? "#00d4ff" : "#b77bff";
          const isLast = i === filled - 1;
          return (
            <div
              key={i}
              style={{
                flex: 1, height: 5, borderRadius: 2,
                background: i < filled ? color : "rgba(255,255,255,0.05)",
                boxShadow: isLast ? `0 0 8px ${color}` : "none",
                transition: "background 0.2s ease",
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between">
        <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: "#404040" }}>
          {label}
        </span>
        <span
          className="font-mono font-bold tabular-nums"
          style={{
            fontSize: 11,
            color: progress === 100 ? "#00ff88" : "#505050",
            textShadow: progress === 100 ? "0 0 10px rgba(0,255,136,0.55)" : "none",
          }}
        >
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};

/* ─── App ─────────────────────────────────────────────── */
const App = () => {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const t0 = Date.now(), dur = 2200;
      const iv = setInterval(() => {
        const p = Math.min(((Date.now() - t0) / dur) * 100, 100);
        setLoadProgress(p);
        if (p > 10) setShowName(true);
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(() => setFadeOut(true), 700);
          setTimeout(() => setIsReady(true), 1700);
        }
      }, 40);
      return () => clearInterval(iv);
    } else {
      setLoadProgress(progress);
      if (progress > 10) setShowName(true);
      if (progress === 100) {
        setTimeout(() => setFadeOut(true), 700);
        setTimeout(() => setIsReady(true), 1700);
      }
    }
  }, [progress]);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-hidden bg-primary">
      <CustomCursor />
      <style>{`@keyframes blink{from,to{opacity:1}50%{opacity:0}}`}</style>

      {!isReady && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{
            background: "#0a0a0a",
            opacity: fadeOut ? 0 : 1,
            transform: fadeOut ? "scale(1.04)" : "scale(1)",
            transition: "opacity 1s ease, transform 1.2s ease",
            pointerEvents: fadeOut ? "none" : "auto",
          }}
        >
          {/* Grid */}
          <GridOverlay progress={loadProgress} />

          {/* Brackets */}
          <CornerBracket top={24} left={24} />
          <CornerBracket top={24} right={24} />
          <CornerBracket bottom={24} left={24} />
          <CornerBracket bottom={24} right={24} />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div style={{
              height: "100%", width: `${loadProgress}%`,
              background: "linear-gradient(to right, transparent, #00ff88 40%, #00d4ff)",
              boxShadow: "0 0 14px #00ff88",
              transition: "width 0.3s ease",
            }} />
          </div>

          {/* Ambient glow top */}
          <div className="absolute pointer-events-none" style={{
            top: "10%", left: "50%", transform: "translate(-50%,-50%)",
            width: 700, height: 700,
            background: "radial-gradient(circle, rgba(0,255,136,0.045) 0%, transparent 70%)",
            opacity: loadProgress > 25 ? 1 : 0,
            transition: "opacity 2.5s ease",
          }} />

          {/* Content */}
          <div
            className="relative z-10 flex flex-col items-center gap-9 px-6 w-full"
            style={{ maxWidth: 520 }}
          >
            <GlitchName visible={showName} />
            <Terminal progress={loadProgress} />
            <SegmentedBar progress={loadProgress} />
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
            <div style={{
              height: "100%",
              width: `${loadProgress * 0.65}%`,
              marginLeft: "17.5%",
              background: "linear-gradient(to right, transparent, rgba(0,212,255,0.4), transparent)",
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      )}

      <div className={`${isReady ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <WorksIntro />
        <Works />
        <ContactSummary />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;

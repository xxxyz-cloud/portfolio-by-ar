import { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import PortfolioBook from "../components/PortfolioBook";
import { projects } from "../constants";

/* ── Animated counter ─────────────────────────────────────────── */
const Counter = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const dur = 1600, start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.floor(ease * target));
        if (t < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* ── Works section ────────────────────────────────────────────── */
const Works = () => {
  const [lineVisible, setLineVisible] = useState(false);
  const lineRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLineVisible(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    if (lineRef.current) obs.observe(lineRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="work" className="relative overflow-hidden" style={{ background: "#09090b" }}>

      {/* ── Atmospheric background ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Subtle grid */}
        <div className="absolute inset-0" style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.022) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,255,136,0.022) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}/>

        {/* Corner glows */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none" style={{
          background: "radial-gradient(circle at top right, rgba(0,255,136,0.06) 0%, transparent 65%)",
        }}/>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none" style={{
          background: "radial-gradient(circle at bottom left, rgba(0,212,255,0.05) 0%, transparent 65%)",
        }}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none" style={{
          background: "radial-gradient(ellipse, rgba(183,123,255,0.025) 0%, transparent 70%)",
        }}/>

        {/* Top edge rule */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: "linear-gradient(to right, transparent 5%, rgba(0,255,136,0.3) 30%, rgba(0,255,136,0.3) 70%, transparent 95%)",
        }}/>
      </div>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="relative z-10 pt-24 pb-0 px-6 sm:px-12 lg:px-20">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          {/* Left: title block */}
          <div>
            {/* Section index label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: "#00ff88" }}/>
              <span className="font-mono text-[10px] tracking-[0.45em] uppercase"
                style={{ color: "rgba(0,255,136,0.6)" }}>
                02 · Featured Work
              </span>
            </div>

            {/* Big display title */}
            <h2 className="font-display font-bold leading-[0.88] tracking-tight"
              style={{ fontSize: "clamp(3.8rem, 11vw, 9rem)", color: "#ececec" }}>
              SELECTED<br/>
              <span style={{
                color: "#00ff88",
                textShadow: "0 0 60px rgba(0,255,136,0.28), 0 0 120px rgba(0,255,136,0.10)",
              }}>
                WORKS
              </span>
            </h2>
          </div>

          {/* Right: meta block */}
          <div className="flex items-end gap-10 pb-2">

            {/* Project count */}
            <div className="flex flex-col items-end">
              <span className="font-display font-bold tabular-nums"
                style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", lineHeight: 1,
                  color: "rgba(0,255,136,0.12)", letterSpacing:"-0.04em" }}>
                <Counter target={projects.length} suffix=""/>
              </span>
              <span className="font-mono text-[10px] tracking-[0.38em] uppercase mt-1"
                style={{ color: "rgba(255,255,255,0.25)" }}>
                Projects
              </span>
            </div>

            {/* Vertical divider */}
            <div className="hidden sm:block w-px h-16 self-center"
              style={{ background: "rgba(255,255,255,0.08)" }}/>

            {/* Description */}
            <div className="hidden md:block max-w-[260px]">
              <p className="font-mono text-[11px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.04em" }}>
                Real-time apps, 3D experiences &amp; AI integrations — crafted with precision and shipped to production.
              </p>
            </div>
          </div>
        </div>

        {/* Animated ruled line */}
        <div ref={lineRef} className="relative mt-8 h-px overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, #00ff88, rgba(0,212,255,0.8), rgba(183,123,255,0.6), transparent)",
            transform: lineVisible ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
          }}/>
          {/* Glow dot */}
          {lineVisible && (
            <div style={{
              position:"absolute", right: "35%", top:"50%", transform:"translateY(-50%)",
              width:6, height:6, borderRadius:"50%",
              background:"#00d4ff", boxShadow:"0 0 16px #00d4ff",
              animation:"pulse-dot 2s ease-in-out infinite",
            }}/>
          )}
        </div>
      </div>

      {/* ── 3-D Book (hero) ──────────────────────────────────────── */}
      <div className="relative z-10">
        <PortfolioBook />
      </div>

      {/* ── Footer bar ───────────────────────────────────────────── */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-20 pb-20">

        {/* Divider */}
        <div className="mb-10 h-px" style={{
          background: "linear-gradient(to right, transparent, rgba(0,255,136,0.2), transparent)",
        }}/>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Left: copy */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.38em] uppercase mb-1"
              style={{ color: "rgba(255,255,255,0.22)" }}>
              Want to see everything?
            </p>
            <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
              All projects + experiments live on GitHub.
            </p>
          </div>

          {/* Right: CTA */}
          <a
            href="https://github.com/anshu-c8NETed"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 overflow-hidden"
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              border: "1.5px solid rgba(0,255,136,0.45)",
              background: "rgba(0,255,136,0.04)",
              color: "#00ff88",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(0.82rem,1.6vw,1rem)",
              letterSpacing: "0.02em",
              transition: "all 0.35s ease",
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(0,255,136,0.10)";
              e.currentTarget.style.borderColor = "rgba(0,255,136,0.8)";
              e.currentTarget.style.boxShadow = "0 0 36px rgba(0,255,136,0.18)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(0,255,136,0.04)";
              e.currentTarget.style.borderColor = "rgba(0,255,136,0.45)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Icon icon="mdi:github" style={{ fontSize: 20, flexShrink: 0 }}/>
            <span>View All on GitHub</span>
            <Icon icon="lucide:arrow-up-right" style={{ fontSize: 16, flexShrink: 0,
              transition: "transform 0.3s ease" }}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>

      {/* Keyframe for line dot pulse */}
      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:translateY(-50%) scale(1); }
          50%      { opacity:0.4; transform:translateY(-50%) scale(0.6); }
        }
      `}</style>
    </section>
  );
};

export default Works;


import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { achievements, stats } from "../constants";
import { Icon } from "@iconify/react/dist/iconify.js";

gsap.registerPlugin(ScrollTrigger);

/* ─── Tag Pills (skills) ────────────────────────────────── */
const TAGS = [
  { label: "React / Next.js",   color: "#00ff88" },
  { label: "Node.js / Express", color: "#00d4ff" },
  { label: "Three.js",          color: "#b77bff" },
  { label: "GSAP",              color: "#00ff88" },
  { label: "WebGL / Shaders",   color: "#00d4ff" },
  { label: "MongoDB",           color: "#b77bff" },
  { label: "Socket.io",         color: "#00ff88" },
  { label: "TypeScript",        color: "#00d4ff" },
  { label: "Google Gemini AI",  color: "#b77bff" },
];

/* ─── Animated stat counter ────────────────────────────── */
const StatCounter = ({ number, label }) => {
  const [val, setVal] = useState("0");
  const ref = useRef(null);
  const suffix = number.replace(/[0-9]/g, "");
  const target  = parseInt(number, 10);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const dur = 1800, start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(ease * target) + suffix);
        if (t < 1) requestAnimationFrame(tick);
        else setVal(number);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, suffix, number]);

  return (
    <div
      ref={ref}
      className="relative group flex flex-col items-start justify-end p-5 sm:p-8 md:p-10 overflow-hidden transition-colors duration-300"
      style={{ background: "transparent" }}
    >
      {/* Hover fill */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "rgba(0,255,136,0.04)" }}
      />
      <span
        className="font-display font-bold leading-none tabular-nums mb-3"
        style={{
          fontSize: "clamp(3rem,7vw,6rem)",
          color: "#00ff88",
          textShadow: "0 0 40px rgba(0,255,136,0.2)",
        }}
      >
        {val}
      </span>
      <span
        className="font-mono uppercase tracking-[0.28em]"
        style={{ fontSize: 11, color: "rgba(229,229,229,0.45)" }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── About Section ─────────────────────────────────────── */
const About = () => {
  const sectionRef   = useRef(null);
  const dualImgRef   = useRef(null);
  const maskLayerRef = useRef(null);
  const currentSize  = useRef(0);

  /* line + pill refs */
  const pill1 = useRef(null);
  const pill2 = useRef(null);
  const pill3 = useRef(null);
  const pill4 = useRef(null);

  const line1 = useRef(null);
  const line2 = useRef(null);
  const line3 = useRef(null);
  const line4 = useRef(null);
  const line5 = useRef(null);

  const tagsRef      = useRef(null);
  const copyRef      = useRef(null);
  const achieveRef   = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      /* ── Statement: word reveals + pill expansions ── */
      const lineData = [
        { line: line1, pill: pill1 },
        { line: line2, pill: pill2 },
        { line: line3, pill: pill3 },
        { line: line4, pill: null  },
        { line: line5, pill: pill4 },
      ];

      lineData.forEach(({ line, pill }) => {
        const words = line.current?.querySelectorAll(".word");
        if (words?.length) {
          gsap.from(words, {
            yPercent: 70,
            opacity: 0,
            stagger: 0.07,
            scrollTrigger: {
              trigger: line.current,
              start: "top 88%",
              end: "top 52%",
              scrub: 1.2,
            },
          });
        }
        if (pill?.current) {
          const pillWidth = window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 100 : 160;
          if (pillWidth > 0) {
            gsap.to(pill.current, {
              width: pillWidth,
              scrollTrigger: {
                trigger: line.current,
                start: "top 90%",
                end: "top 45%",
                scrub: 1.2,
              },
            });
          }
        }
      });

      /* ── Copy / tag reveal ── */
      if (copyRef.current) {
        const revealItems = copyRef.current.querySelectorAll(".reveal-item");
        gsap.set(revealItems, { yPercent: 20, opacity: 0 });
        gsap.to(revealItems, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: copyRef.current, start: "top 85%", once: true },
        });
      }

      if (tagsRef.current) {
        gsap.from(tagsRef.current.querySelectorAll("span"), {
          scale: 0.75,
          opacity: 0,
          stagger: 0.045,
          duration: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: tagsRef.current, start: "top 88%" },
        });
      }

      /* ── Achievements ── */
      if (achieveRef.current) {
        const items = achieveRef.current.querySelectorAll(".achieve-item");
        // Set explicit starting state so elements are invisible only until trigger fires
        gsap.set(items, { x: -40, opacity: 0 });
        gsap.to(items, {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "x,opacity",
          scrollTrigger: {
            trigger: achieveRef.current,
            start: "top 90%",
            once: true,
            onEnter: () => {},
          },
        });
      }

      /* ── Section scale-out ── */
      gsap.to(sectionRef.current, {
        scale: 0.95,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: true,
        },
        ease: "power1.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Radial mask hover reveal ── */
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const LARGE = isMobile ? 55 : 110;

  const handleImgMouseMove = (e) => {
    const rect = dualImgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (currentSize.current > 0 && maskLayerRef.current) {
      maskLayerRef.current.style.setProperty("--mx", `${x}px`);
      maskLayerRef.current.style.setProperty("--my", `${y}px`);
    }
  };

  const handleImgEnter = () => {
    currentSize.current = LARGE;
    gsap.to(maskLayerRef.current, { "--ms": `${LARGE}px`, duration: 0.55, ease: "back.out(1.7)" });
  };

  const handleImgLeave = () => {
    currentSize.current = 0;
    gsap.to(maskLayerRef.current, { "--ms": "0px", duration: 0.4 });
  };

  /* Touch reveal for mobile */
  const handleImgTouch = (e) => {
    const rect = dualImgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    if (maskLayerRef.current) {
      maskLayerRef.current.style.setProperty("--mx", `${x}px`);
      maskLayerRef.current.style.setProperty("--my", `${y}px`);
      currentSize.current = LARGE;
      gsap.to(maskLayerRef.current, { "--ms": `${LARGE}px`, duration: 0.4, ease: "power2.out" });
    }
  };

  const handleImgTouchEnd = () => {
    currentSize.current = 0;
    gsap.to(maskLayerRef.current, { "--ms": "0px", duration: 0.6 });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-secondary rounded-b-4xl overflow-hidden"
      style={{ transformOrigin: "top center" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,1) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(183,123,255,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════
            01 — Section header
        ════════════════════════════════════════════════════════ */}
        <div className="flex justify-between items-start px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-14 md:pb-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px" style={{ background: "#00ff88" }} />
            <span
              className="font-mono uppercase tracking-[0.38em]"
              style={{ fontSize: 10, color: "rgba(0,255,136,0.65)" }}
            >
              03 · About
            </span>
          </div>
          <span
            className="font-mono"
            style={{ fontSize: 10, color: "rgba(229,229,229,0.3)" }}
          >
            Est. 2023
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════
            02 — Big editorial statement
        ════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 md:px-10 pb-16 sm:pb-20 md:pb-24 max-w-[1400px] mx-auto">

          {/* Line 1: "I build [pill] digital" */}
          <div ref={line1} className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 leading-none mb-1 sm:mb-2 overflow-hidden">
            <span className="word font-display font-bold uppercase text-text"
              style={{ fontSize: "clamp(2rem,8.5vw,8.5rem)", letterSpacing: "-0.02em" }}>
              I build
            </span>
            {/* Image pill — hidden on small mobile to prevent overflow */}
            <span
              ref={pill1}
              className="hidden sm:inline-block overflow-hidden flex-shrink-0 relative"
              style={{
                width: 0,
                height: "clamp(2rem,7.5vw,7.5rem)",
                borderRadius: 6,
                verticalAlign: "middle",
              }}
            >
              <img
                src="/assets/projects/codexspace.jpg"
                alt=""
                className="h-full object-cover object-center absolute left-1/2 -translate-x-1/2"
                style={{ width: 220 }}
              />
            </span>
            <span
              className="word font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem,8.5vw,8.5rem)",
                letterSpacing: "-0.02em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(0,255,136,0.4)",
              }}
            >
              digital
            </span>
          </div>

          {/* Line 2: "experiences [pill] that" */}
          <div ref={line2} className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 leading-none mb-1 sm:mb-2 overflow-hidden">
            <span className="word font-display font-bold uppercase text-text"
              style={{ fontSize: "clamp(2rem,8.5vw,8.5rem)", letterSpacing: "-0.02em" }}>
              experiences
            </span>
            <span
              ref={pill2}
              className="hidden sm:inline-block overflow-hidden flex-shrink-0 relative"
              style={{
                width: 0,
                height: "clamp(2rem,7.5vw,7.5rem)",
                borderRadius: 6,
                verticalAlign: "middle",
              }}
            >
              <img
                src="/assets/projects/gamebit.jpg"
                alt=""
                className="h-full object-cover object-center absolute left-1/2 -translate-x-1/2"
                style={{ width: 220 }}
              />
            </span>
            <span
              className="word font-display font-bold uppercase text-text"
              style={{ fontSize: "clamp(2rem,8.5vw,8.5rem)", letterSpacing: "-0.02em" }}
            >
              that
            </span>
          </div>

          {/* Line 3: "don't [pill] just" */}
          <div ref={line3} className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 leading-none mb-1 sm:mb-2 overflow-hidden">
            <span
              className="word font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem,8.5vw,8.5rem)",
                letterSpacing: "-0.02em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(229,229,229,0.25)",
              }}
            >
              don't
            </span>
            <span className="word font-display font-bold uppercase text-text"
              style={{ fontSize: "clamp(2rem,8.5vw,8.5rem)", letterSpacing: "-0.02em" }}>
              just
            </span>
            <span
              ref={pill3}
              className="hidden sm:inline-block overflow-hidden flex-shrink-0 relative"
              style={{
                width: 0,
                height: "clamp(2rem,7.5vw,7.5rem)",
                borderRadius: 6,
                verticalAlign: "middle",
              }}
            >
              <img
                src="/assets/projects/hyperspace.jpg"
                alt=""
                className="h-full object-cover object-center absolute left-1/2 -translate-x-1/2"
                style={{ width: 220 }}
              />
            </span>
          </div>

          {/* Line 4: "look good —" */}
          <div ref={line4} className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 leading-none mb-1 sm:mb-2 overflow-hidden">
            <span className="word font-display font-bold uppercase text-text"
              style={{ fontSize: "clamp(2rem,8.5vw,8.5rem)", letterSpacing: "-0.02em" }}>
              look
            </span>
            <span
              className="word font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem,8.5vw,8.5rem)",
                letterSpacing: "-0.02em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(229,229,229,0.25)",
              }}
            >
              good —
            </span>
          </div>

          {/* Line 5: "they [pill] move people." */}
          <div ref={line5} className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 leading-none overflow-hidden">
            <span className="word font-display font-bold uppercase text-text"
              style={{ fontSize: "clamp(2rem,8.5vw,8.5rem)", letterSpacing: "-0.02em" }}>
              they
            </span>
            <span
              ref={pill4}
              className="hidden sm:inline-block overflow-hidden flex-shrink-0 relative"
              style={{
                width: 0,
                height: "clamp(2rem,7.5vw,7.5rem)",
                borderRadius: 6,
                verticalAlign: "middle",
              }}
            >
              <img
                src="/assets/projects/api-hub.jpg"
                alt=""
                className="h-full object-cover object-center absolute left-1/2 -translate-x-1/2"
                style={{ width: 220 }}
              />
            </span>
            <span
              className="word font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem,8.5vw,8.5rem)",
                letterSpacing: "-0.02em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(229,229,229,0.25)",
              }}
            >
              move
            </span>
            <span className="word font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem,8.5vw,8.5rem)",
                letterSpacing: "-0.02em",
                color: "#00ff88",
                textShadow: "0 0 60px rgba(0,255,136,0.2)",
              }}>
              people.
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            03 — Profile + Copy (hover reveal)
        ════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-24 md:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center max-w-[1400px] mx-auto">

          {/* ── Profile image with radial mask reveal ── */}
          <div
            ref={dualImgRef}
            className="relative overflow-hidden rounded-sm"
            style={{
              height: "clamp(280px, 55vw, 680px)",
              cursor: "none",
            }}
            onMouseMove={handleImgMouseMove}
            onMouseEnter={handleImgEnter}
            onMouseLeave={handleImgLeave}
            onTouchMove={handleImgTouch}
            onTouchEnd={handleImgTouchEnd}
          >
            {/* Base image — anshu-masked.jpg, always visible */}
            <img
              src="/images/anshu-masked.jpg"
              alt="Anshu Raj"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Reveal layer — anshu-profile.jpg, only visible inside the cursor circle */}
            <div
              ref={maskLayerRef}
              className="absolute inset-0 w-full h-full"
              style={{
                "--ms": "0px",
                "--mx": "50%",
                "--my": "50%",
                maskImage:
                  "radial-gradient(circle var(--ms) at var(--mx) var(--my), white 99%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle var(--ms) at var(--mx) var(--my), white 99%, transparent 100%)",
              }}
            >
              <img
                src="/images/anshu-profile.jpg"
                alt="Anshu Raj — revealed"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Bottom gradient + label */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 45%)",
              }}
            />
            <div
              className="absolute bottom-6 left-6 font-mono uppercase tracking-[0.35em] hidden sm:block"
              style={{ fontSize: 9, color: "rgba(0,255,136,0.65)" }}
            >
              Hover to reveal ✦
            </div>
            <div
              className="absolute bottom-6 left-6 font-mono uppercase tracking-[0.35em] sm:hidden"
              style={{ fontSize: 9, color: "rgba(0,255,136,0.65)" }}
            >
              Tap to reveal ✦
            </div>

            {/* Corner brackets */}
            <svg className="absolute top-0 left-0 w-9 h-9" viewBox="0 0 36 36" fill="none">
              <path d="M36 0 L0 0 L0 36" stroke="#00ff88" strokeWidth="1.5" strokeOpacity="0.45"/>
            </svg>
            <svg className="absolute top-0 right-0 w-9 h-9" viewBox="0 0 36 36" fill="none">
              <path d="M0 0 L36 0 L36 36" stroke="#00ff88" strokeWidth="1.5" strokeOpacity="0.45"/>
            </svg>
            <svg className="absolute bottom-0 left-0 w-9 h-9" viewBox="0 0 36 36" fill="none">
              <path d="M36 36 L0 36 L0 0" stroke="#00ff88" strokeWidth="1.5" strokeOpacity="0.45"/>
            </svg>
            <svg className="absolute bottom-0 right-0 w-9 h-9" viewBox="0 0 36 36" fill="none">
              <path d="M0 36 L36 36 L36 0" stroke="#00ff88" strokeWidth="1.5" strokeOpacity="0.45"/>
            </svg>
          </div>

          {/* ── Copy ── */}
          <div ref={copyRef} className="flex flex-col gap-8">

            {/* Heading */}
            <div className="reveal-item">
              <h2
                className="font-display font-bold uppercase leading-[0.93]"
                style={{
                  fontSize: "clamp(2rem,5.5vw,5.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Designed to
                <br />
                <span
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px #00ff88",
                  }}
                >
                  Disrupt
                </span>
                <br />
                the Ordinary
              </h2>
            </div>

            {/* Bio paragraphs */}
            <div className="reveal-item space-y-4">
              <p
                className="font-mono leading-[1.85]"
                style={{ fontSize: 14, color: "rgba(229,229,229,0.55)", maxWidth: 460 }}
              >
                I'm Anshu Raj — a full-stack developer with a compulsion for
                interfaces that feel alive. Every transition is earned, every
                shader intentional.
              </p>
              <p
                className="font-mono leading-[1.85]"
                style={{ fontSize: 14, color: "rgba(229,229,229,0.55)", maxWidth: 460 }}
              >
                
From WebGL particle systems to real-time Socket.io collaboration, 
I work across both creative front-end experiences and backend architecture. 
I focus on building thoughtful, 
well-executed solutions that balance visual design with technical reliability.
              </p>
            </div>

            {/* Tag pills */}
            <div ref={tagsRef} className="reveal-item flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="font-mono uppercase transition-colors duration-200"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    padding: "6px 14px",
                    border: `1px solid ${tag.color}40`,
                    color: `${tag.color}cc`,
                    borderRadius: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${tag.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="reveal-item flex items-center gap-4 pt-2">
              <a
                href="https://github.com/anshu-c8NETed"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-2 font-mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  color: "#00ff88",
                  textDecoration: "none",
                }}
              >
                <div
                  className="w-8 h-px transition-all duration-300 group-hover:w-14"
                  style={{ background: "#00ff88" }}
                />
                View GitHub
              </a>
              <a
                href="mailto:rajanshu2123@gmail.com"
                className="group relative flex items-center gap-2 font-mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  color: "rgba(229,229,229,0.4)",
                  textDecoration: "none",
                }}
              >
                <div
                  className="w-8 h-px transition-all duration-300 group-hover:w-14"
                  style={{ background: "rgba(229,229,229,0.4)" }}
                />
                Say Hello
              </a>
            </div>
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════
            05 — Achievements & Hobbies
        ════════════════════════════════════════════════════════ */}
        <div ref={achieveRef} className="px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-24 max-w-[1400px] mx-auto">

          {/* ── Achievements ─────────────────────────────── */}
          <div className="flex items-center gap-4 mb-12">
            <span
              className="font-mono uppercase tracking-[0.38em]"
              style={{ fontSize: 10, color: "rgba(0,255,136,0.55)" }}
            >
              04
            </span>
            <div className="w-px h-4" style={{ background: "rgba(0,255,136,0.25)" }} />
            <h3
              className="font-display font-bold uppercase"
              style={{ fontSize: "clamp(1.4rem,3.5vw,2.6rem)", letterSpacing: "-0.02em", color: "#e5e5e5" }}
            >
              Achievements &amp; Certifications
            </h3>
          </div>

          {/* Achievement rows — clean ruled list */}
          <div className="mb-20">
            {achievements.map((ach, i) => {
              const accent   = ["#00ff88","#00d4ff","#b77bff","#ffcc44","#00ff88"][i % 5];
              const iconList = ["lucide:code-2","lucide:award","lucide:brain","lucide:zap","lucide:shield-check"];
              return (
                <div
                  key={i}
                  className="achieve-item group relative flex items-center gap-5 sm:gap-8 py-5 sm:py-6 transition-all duration-300"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {/* Hover fill strip */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${accent}08, transparent 60%)`,
                    }}
                  />

                  {/* Left: index */}
                  <span
                    className="font-mono flex-shrink-0 tabular-nums w-6 text-right"
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon dot */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${accent}12`,
                      border: `1px solid ${accent}25`,
                    }}
                  >
                    <Icon icon={iconList[i % iconList.length]} style={{ color: accent, width: 14, height: 14 }} />
                  </div>

                  {/* Text */}
                  <p
                    className="flex-1 font-mono leading-snug transition-colors duration-300 group-hover:text-text"
                    style={{ fontSize: "clamp(0.75rem,1.5vw,0.88rem)", color: "rgba(229,229,229,0.55)" }}
                  >
                    {ach}
                  </p>

                  {/* Right: accent pip that slides in */}
                  <div
                    className="flex-shrink-0 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Divider ───────────────────────────────────── */}
          <div
            className="mb-16 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)" }}
          />

          {/* ── Hobbies ──────────────────────────────────── */}
          <div className="flex items-center gap-4 mb-12">
            <span
              className="font-mono uppercase tracking-[0.38em]"
              style={{ fontSize: 10, color: "rgba(0,212,255,0.55)" }}
            >
              05
            </span>
            <div className="w-px h-4" style={{ background: "rgba(0,212,255,0.25)" }} />
            <h3
              className="font-display font-bold uppercase"
              style={{ fontSize: "clamp(1.4rem,3.5vw,2.6rem)", letterSpacing: "-0.02em", color: "#e5e5e5" }}
            >
              Beyond the Code
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                label: "Chess",
                icon: "mdi:chess-knight",
                desc: "Tactical thinking & pattern recognition",
                color: "#00ff88",
              },
              {
                label: "Workout",
                icon: "lucide:dumbbell",
                desc: "Discipline that bleeds into the craft",
                color: "#00d4ff",
              },
              {
                label: "Reading",
                icon: "lucide:book-open",
                desc: "Books that sharpen perspective",
                color: "#b77bff",
              },
              {
                label: "Sports",
                icon: "lucide:activity",
                desc: "Team play & competitive edge",
                color: "#ffcc44",
              },
            ].map((hobby) => (
              <div
                key={hobby.label}
                className="achieve-item group relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col gap-4 transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${hobby.color}0a`;
                  e.currentTarget.style.borderColor = `${hobby.color}30`;
                  e.currentTarget.style.transform   = "translateY(-4px)";
                  e.currentTarget.style.boxShadow   = `0 24px 48px ${hobby.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform   = "translateY(0)";
                  e.currentTarget.style.boxShadow   = "none";
                }}
              >
                {/* Top: icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                  style={{ background: `${hobby.color}15`, border: `1px solid ${hobby.color}28` }}
                >
                  <Icon icon={hobby.icon} style={{ color: hobby.color, width: 18, height: 18 }} />
                </div>

                {/* Label */}
                <div>
                  <p
                    className="font-display font-bold uppercase mb-1 transition-colors duration-300"
                    style={{ fontSize: "clamp(0.9rem,1.8vw,1.05rem)", letterSpacing: "-0.01em", color: "#e5e5e5" }}
                  >
                    {hobby.label}
                  </p>
                  <p
                    className="font-mono leading-relaxed"
                    style={{ fontSize: "clamp(0.68rem,1.2vw,0.75rem)", color: "rgba(229,229,229,0.38)" }}
                  >
                    {hobby.desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-600"
                  style={{ background: `linear-gradient(to right, ${hobby.color}80, transparent)` }}
                />

                {/* Subtle corner glow */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${hobby.color}15, transparent 70%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* GSAP CSS var support */}
      <style>{`
        [ref="maskLayerRef"] { transition: none; }
      `}</style>
    </section>
  );
};

export default About;

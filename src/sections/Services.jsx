import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ServicesIntro from "../components/ServicesIntro";

gsap.registerPlugin(ScrollTrigger);

// ── Service Data ──────────────────────────────────────────────────
const SERVICES = [
  {
    id: "01",
    title: "Full-Stack\nEngineering",
    subtitle: "MERN · REST · GraphQL",
    color: "#00ff88",
    desc: "End-to-end architecture from MongoDB schemas to polished React UIs. I design APIs that scale, data models that breathe, and interfaces that respond in milliseconds.",
    tags: ["React", "Node.js", "MongoDB", "Express", "REST APIs"],
    metric: { value: "10+", label: "Shipped Products" },
    image: "/assets/services/fullstack.jpg",
  },
  {
    id: "02",
    title: "3D & Motion\nDesign",
    subtitle: "Three.js · GSAP · WebGL",
    color: "#00d4ff",
    desc: "Scenes that breathe. Interfaces that feel alive. From WebGL shaders to choreographed scroll narratives — motion is the medium, sensation is the goal.",
    tags: ["Three.js", "GSAP", "WebGL", "Framer Motion", "Lenis"],
    metric: { value: "60fps", label: "On Mobile Devices" },
    image: "/assets/services/animation.jpg",
  },
  {
    id: "03",
    title: "AI\nIntegration",
    subtitle: "Gemini · LangChain · Embeddings",
    color: "#b77bff",
    desc: "Weaving intelligence into product surfaces. RAG pipelines, semantic search, generative UI — AI features that feel native, not bolted on.",
    tags: ["Google Gemini", "LangChain", "OpenAI", "Vector DBs", "Streaming"],
    metric: { value: "∞", label: "Possible Contexts" },
    image: "/assets/services/ai.jpg",
  },
  {
    id: "04",
    title: "Real-Time\nSystems",
    subtitle: "Socket.io · WebSockets · CRDTs",
    color: "#00ff88",
    desc: "Building collaboration tools that feel like magic. Sub-50ms event propagation, conflict-free shared state, live cursors and presence — the web feels local.",
    tags: ["Socket.io", "WebSockets", "Redis", "CRDTs", "EventEmitter"],
    metric: { value: "<50ms", label: "Event Latency" },
    image: "/assets/services/performance.jpg",
  },
];

// ── Helpers ───────────────────────────────────────────────────────
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 900 : false
  );
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return isDesktop;
};

// ── Services ──────────────────────────────────────────────────────
const Services = () => {
  const sectionRef     = useRef(null);
  const pinRef         = useRef(null);
  const trackRef       = useRef(null);
  const progressBarRef = useRef(null);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [cursorPos, setCursorPos]   = useState({ x: -200, y: -200 });
  const [showCursor, setShowCursor] = useState(false);
  const isDesktop = useIsDesktop();

  // Desktop: GSAP horizontal scroll
  useGSAP(() => {
    if (!isDesktop || !pinRef.current || !trackRef.current) return;

    const scrollDist = (SERVICES.length - 1) * window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: "top top",
        end: () => `+=${scrollDist}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.round(self.progress * (SERVICES.length - 1)),
            SERVICES.length - 1
          );
          setActiveIdx(idx);
          if (progressBarRef.current)
            gsap.set(progressBarRef.current, { scaleX: self.progress });
        },
      },
    });

    tl.to(trackRef.current, { x: () => -scrollDist, ease: "none" });

    trackRef.current.querySelectorAll(".panel-image").forEach((img, i) => {
      gsap.to(img, {
        x: 50 * i, ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${scrollDist}`,
          scrub: 2,
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [isDesktop]);

  // Mobile: stacked reveal
  useGSAP(() => {
    if (isDesktop) return;
    sectionRef.current?.querySelectorAll(".mobile-card").forEach((card) => {
      gsap.from(card, {
        y: 50, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 90%" },
      });
    });
  }, [isDesktop]);

  const onMouseMove = useCallback((e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{ background: "#0a0a0a", position: "relative" }}
    >
      {/* ── Cinematic video intro ── */}
      <ServicesIntro />

      {/* ── Section heading ── */}
      <ServiceIntro />

      {/* ── DESKTOP: pinned horizontal track ── */}
      {isDesktop ? (
        <div
          ref={pinRef}
          style={{ height: "100vh", overflow: "hidden", position: "relative" }}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setShowCursor(true)}
          onMouseLeave={() => setShowCursor(false)}
        >
          {/* Custom cursor — only on desktop */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              left: cursorPos.x, top: cursorPos.y,
              width: 68, height: 68, borderRadius: "50%",
              border: `1px solid ${SERVICES[activeIdx].color}`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 9999,
              opacity: showCursor ? 1 : 0,
              transition: "opacity 0.25s, border-color 0.4s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8, color: SERVICES[activeIdx].color,
              letterSpacing: "0.2em", textTransform: "uppercase",
            }}>scroll</span>
          </div>

          {/* Progress bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 2, background: "rgba(255,255,255,0.06)", zIndex: 10,
          }}>
            <div
              ref={progressBarRef}
              style={{
                height: "100%",
                background: "linear-gradient(to right, #00ff88, #00d4ff, #b77bff)",
                transformOrigin: "left", transform: "scaleX(0)",
                boxShadow: "0 0 14px rgba(0,255,136,0.5)",
              }}
            />
          </div>

          {/* Index pills */}
          <div style={{
            position: "absolute", bottom: 32, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: 8, zIndex: 10,
          }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{
                width: i === activeIdx ? 28 : 7, height: 4,
                borderRadius: 100,
                background: i === activeIdx ? s.color : "rgba(255,255,255,0.12)",
                boxShadow: i === activeIdx ? `0 0 8px ${s.color}` : "none",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>

          {/* Horizontal track */}
          <div
            ref={trackRef}
            style={{
              display: "flex",
              width: `${SERVICES.length * 100}vw`,
              height: "100%",
              willChange: "transform",
            }}
          >
            {SERVICES.map((service, i) => (
              <ServicePanel
                key={i} service={service} index={i}
                isActive={activeIdx === i}
              />
            ))}
          </div>
        </div>
      ) : (
        /* ── MOBILE: vertical stacked cards ── */
        <div className="mobile-stack">
          {SERVICES.map((service, i) => (
            <MobileCard key={i} service={service} index={i} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .mobile-stack {
          padding: 2rem 1rem 3rem;
        }
        @media (min-width: 480px) {
          .mobile-stack { padding: 2.5rem 1.5rem 4rem; }
        }
        @media (min-width: 640px) {
          .mobile-stack { padding: 3rem 2rem 5rem; }
        }
      `}</style>
    </section>
  );
};

// ── ServicePanel (desktop only) ───────────────────────────────────
const ServicePanel = ({ service, index, isActive }) => {
  return (
    <div
      style={{
        width: "100vw", height: "100%",
        display: "flex", alignItems: "center",
        padding: "0 7vw",
        position: "relative",
        gap: "5vw",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "45%",
        transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${service.color}0c 0%, transparent 65%)`,
        pointerEvents: "none",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.9s ease",
      }} />

      {/* LEFT — text */}
      <div style={{
        flex: "0 0 43%", display: "flex", flexDirection: "column",
        gap: "clamp(1rem, 2.5vh, 2rem)", zIndex: 2,
      }}>
        {/* ID + subtitle row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11, color: service.color,
            letterSpacing: "0.4em", opacity: 0.55,
            flexShrink: 0,
          }}>{service.id}</span>
          <div style={{ flex: 1, height: 1, background: `${service.color}25`, minWidth: 20 }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.2em", flexShrink: 0,
          }}>{service.subtitle}</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(2.4rem, 4.5vw, 5.2rem)",
          color: "#e5e5e5", letterSpacing: "-0.04em",
          lineHeight: 0.95, margin: 0,
        }}>
          {service.title.split("\n").map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {li === 1
                ? <em style={{ color: service.color, fontStyle: "italic", textShadow: `0 0 50px ${service.color}40` }}>{line}</em>
                : line}
            </span>
          ))}
        </h2>

        {/* Desc */}
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 300,
          fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
          color: "#808080", lineHeight: 1.85, margin: 0,
          maxWidth: 400,
        }}>
          {service.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {service.tags.map((tag, ti) => (
            <ServiceTag key={ti} tag={tag} color={service.color} />
          ))}
        </div>

        {/* Metric */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          padding: "12px 20px",
          background: `${service.color}08`,
          border: `1px solid ${service.color}20`,
          borderRadius: "0.75rem",
          alignSelf: "flex-start",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
            color: service.color, letterSpacing: "-0.04em",
            textShadow: `0 0 25px ${service.color}50`,
          }}>{service.metric.value}</span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10, color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            maxWidth: 90, lineHeight: 1.6,
          }}>{service.metric.label}</span>
        </div>
      </div>

      {/* RIGHT — image */}
      <div style={{ flex: "0 0 45%", position: "relative", zIndex: 2 }}>
        <div style={{
          position: "relative", borderRadius: "1.2rem", overflow: "hidden",
          aspectRatio: "16/10",
          border: `1px solid ${service.color}15`,
          boxShadow: isActive
            ? `0 24px 70px rgba(0,0,0,0.55), 0 0 50px ${service.color}0d`
            : "none",
          transition: "box-shadow 0.8s ease",
        }}>
          {/* Gradient fallback */}
          <div
            className="panel-image"
            style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(135deg, #0f0f0f 0%, ${service.color}12 50%, #0a0a0a 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "5.5rem", color: `${service.color}12`,
              letterSpacing: "-0.06em",
            }}>{service.id}</span>
          </div>

          <img
            src={service.image} alt={service.title}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.65,
              filter: "grayscale(25%)",
              transition: "opacity 0.5s, filter 0.5s",
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />

          {/* Color grade */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${service.color}0d 0%, transparent 60%)`,
            mixBlendMode: "screen",
          }} />

          {/* Scan line */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: 2,
              background: `linear-gradient(to right, transparent, ${service.color}60, transparent)`,
              animation: "scan 4s linear infinite",
              opacity: isActive ? 0.35 : 0,
              transition: "opacity 0.5s",
            }} />
          </div>

          {/* Bottom info */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "16px 20px",
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9, color: service.color,
              letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.65,
            }}>{service.subtitle}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M10 5l4 4-4 4" stroke={service.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ServiceTag ────────────────────────────────────────────────────
const ServiceTag = ({ tag, color }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "4px 12px", borderRadius: 100,
        border: `1px solid ${hovered ? color : color + "30"}`,
        fontFamily: "var(--font-mono)",
        fontSize: 10, letterSpacing: "0.07em",
        color: hovered ? color : "rgba(255,255,255,0.45)",
        transition: "all 0.25s ease",
        cursor: "default",
        WebkitTapHighlightColor: "transparent",
      }}
    >{tag}</span>
  );
};

// ── MobileCard ────────────────────────────────────────────────────
const MobileCard = ({ service, index }) => {
  return (
    <div
      className="mobile-card"
      style={{
        position: "relative",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `2px solid ${service.color}50`,
        borderRadius: "1.1rem",
        overflow: "hidden",
        marginBottom: "1rem",
        background: "#0f0f0f",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* ── Image / hero strip ── */}
      <div style={{ position: "relative", aspectRatio: "16/7", overflow: "hidden" }}>
        {/* Gradient background fallback */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, #0c0c0c 0%, ${service.color}15 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(4rem, 18vw, 7rem)",
            color: `${service.color}18`, letterSpacing: "-0.06em",
            userSelect: "none",
          }}>{service.id}</span>
        </div>

        <img
          src={service.image} alt={service.title}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.45,
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* Gradient fade to card bg */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 25%, #0f0f0f 100%)",
        }} />

        {/* Color tint corner */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "45%", height: "45%",
          background: `radial-gradient(circle at top left, ${service.color}22, transparent 80%)`,
        }} />

        {/* ID badge */}
        <div style={{ position: "absolute", top: 12, left: 14 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9, color: service.color,
            letterSpacing: "0.35em", textTransform: "uppercase",
            opacity: 0.7,
          }}>{service.id}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "clamp(1rem, 4vw, 1.4rem)" }}>

        {/* Subtitle */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9, color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.22em", textTransform: "uppercase",
          marginBottom: 8,
        }}>{service.subtitle}</p>

        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.55rem, 6.5vw, 2rem)",
          color: "#e5e5e5", letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginBottom: 10,
        }}>
          {service.title.split("\n").map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {li === 1
                ? <em style={{ color: service.color, fontStyle: "italic" }}>{line}</em>
                : line}
            </span>
          ))}
        </h3>

        {/* Desc */}
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 300,
          fontSize: "clamp(0.85rem, 3.5vw, 0.95rem)",
          color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
          marginBottom: 14,
        }}>
          {service.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {service.tags.map((tag, ti) => (
            <span key={ti} style={{
              padding: "4px 11px", borderRadius: 100,
              border: `1px solid ${service.color}35`,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
              WebkitTapHighlightColor: "transparent",
            }}>{tag}</span>
          ))}
        </div>

        {/* Metric callout */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          padding: "10px 14px",
          background: `${service.color}0a`,
          border: `1px solid ${service.color}22`,
          borderRadius: "0.6rem",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.3rem, 6vw, 1.7rem)",
            color: service.color, letterSpacing: "-0.04em",
            textShadow: `0 0 20px ${service.color}40`,
          }}>{service.metric.value}</span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9, color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.18em", textTransform: "uppercase",
            lineHeight: 1.5,
          }}>{service.metric.label}</span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${service.color}45, transparent)`,
      }} />
    </div>
  );
};

// ── ServiceIntro (section heading) ────────────────────────────────
const ServiceIntro = () => {
  const introRef = useRef(null);
  const lineRef  = useRef(null);

  useGSAP(() => {
    if (!introRef.current) return;
    gsap.from(introRef.current.querySelectorAll(".intro-char"), {
      y: 70, opacity: 0, stagger: 0.025, duration: 0.9,
      ease: "power4.out",
      scrollTrigger: { trigger: introRef.current, start: "top 88%" },
    });
    if (lineRef.current) {
      gsap.from(lineRef.current, {
        scaleX: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: introRef.current, start: "top 83%" },
      });
    }
  }, []);

  const words = ["Services", "&", "Capabilities"];

  return (
    <div ref={introRef} className="service-intro-wrap">
      {/* Noise */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.02,
      }} />

      {/* Index + heading */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(12px, 3vw, 28px)" }}>
        <span className="service-intro-index" style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10, color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.4em", textTransform: "uppercase",
          paddingTop: "0.6em",
        }}>03</span>

        <div>
          {words.map((word, wi) => (
            <div key={wi} style={{ overflow: "hidden" }}>
              <div style={{ display: "flex" }}>
                {word.split("").map((ch, ci) => (
                  <span
                    key={ci} className="intro-char"
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-display)", fontWeight: 800,
                      fontSize: "clamp(2rem, 7vw, 7rem)",
                      color: wi === 2 ? "#00ff88" : "#e5e5e5",
                      letterSpacing: "-0.04em", lineHeight: 1.0,
                      textShadow: wi === 2 ? "0 0 60px rgba(0,255,136,0.22)" : "none",
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Line + subtitle */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(12px, 3vw, 24px)", marginTop: "clamp(1rem, 3vw, 2rem)" }}>
        <div
          ref={lineRef}
          style={{
            height: 1, flexShrink: 0,
            width: "clamp(40px, 8vw, 100px)",
            background: "linear-gradient(to right, #00ff88, #00d4ff)",
            transformOrigin: "left",
            boxShadow: "0 0 8px rgba(0,255,136,0.35)",
            marginTop: 8,
          }}
        />
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 300,
          fontSize: "clamp(0.82rem, 1.3vw, 0.98rem)",
          color: "rgba(255,255,255,0.38)", lineHeight: 1.75, margin: 0,
          maxWidth: 480,
        }}>
          Specialized in building secure, high-performance applications — from real-time
          collaboration to 3D web experiences, merging precision with creative vision.
        </p>
      </div>

      {/* Scroll hint — desktop only */}
      <div className="scroll-hint" style={{
        position: "absolute", right: 40, bottom: 36,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: 0.25,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "#e5e5e5", letterSpacing: "0.4em",
          textTransform: "uppercase", writingMode: "vertical-rl",
        }}>scroll to explore</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #e5e5e5, transparent)" }} />
      </div>

      <style>{`
        .service-intro-wrap {
          position: relative;
          overflow: hidden;
          padding: 4rem 1.25rem 3rem;
        }
        @media (min-width: 480px) {
          .service-intro-wrap { padding: 5rem 1.75rem 3.5rem; }
        }
        @media (min-width: 768px) {
          .service-intro-wrap { padding: 6rem 3rem 4rem; }
        }
        @media (min-width: 1024px) {
          .service-intro-wrap { padding: 7rem 4rem 5rem; }
        }
        @media (max-width: 360px) {
          .service-intro-index { display: none; }
        }
        .scroll-hint { display: none; }
        @media (min-width: 900px) {
          .scroll-hint { display: flex; }
        }
      `}</style>
    </div>
  );
};

export default Services;

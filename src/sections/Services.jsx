import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

// Strip radii: joined filmstrip — only outer edges rounded
const STRIP_RADII = [
  "16px 0 0 16px",
  "0px 0px 0px 0px",
  "0px 0px 0px 0px",
  "0px 16px 16px 0px",
];

// Spread params for desktop flip
const FLIP_PARAMS = [
  { rotateZ: -5,  y:  22, x:  "5vw"  },
  { rotateZ: -2,  y: -18, x:  "1.5vw"},
  { rotateZ:  2,  y: -18, x: "-1.5vw"},
  { rotateZ:  5,  y:  22, x: "-5vw"  },
];

// ── Hook: detect mobile ───────────────────────────────────────────
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

// ── Services ──────────────────────────────────────────────────────
const Services = () => {
  const isMobile = useIsMobile(768);

  return (
    <section
      id="services"
      style={{ background: "#0a0a0a", position: "relative" }}
    >
      {/* Cinematic video intro */}
      <ServicesIntro />

      {/* Section heading */}
      <ServiceIntro />

      {isMobile ? <MobileGrid /> : <DesktopFilmstrip />}

      <style>{`
        @keyframes scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </section>
  );
};

// ── Desktop: original pinned filmstrip + flip ─────────────────────
const DesktopFilmstrip = () => {
  const pinRef   = useRef(null);
  const rowRef   = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(() => {
    const pin = pinRef.current;
    const row = rowRef.current;
    if (!pin || !row) return;

    const cards    = row.querySelectorAll("[data-card-shell]");
    const flippers = row.querySelectorAll("[data-flip-inner]");

    cards.forEach((card, i) => {
      gsap.set(card.querySelectorAll("[data-card-face]"), {
        borderRadius: STRIP_RADII[i],
      });
    });
    flippers.forEach((f) => gsap.set(f, { rotationY: 0 }));
    flippers.forEach((flipper) => {
      gsap.set(flipper.querySelector("[data-card-face='back']"), { visibility: "hidden" });
    });

    const flipTl = gsap.timeline({ paused: true });

    flippers.forEach((flipper, i) => {
      flipTl.to(
        flipper,
        {
          rotationY:  180,
          rotationZ:  FLIP_PARAMS[i].rotateZ,
          y:          FLIP_PARAMS[i].y,
          x:          FLIP_PARAMS[i].x,
          boxShadow:  "0 28px 60px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4)",
          duration:   0.9,
          ease:       "power2.inOut",
          force3D:    true,
        },
        0
      );
    });

    flippers.forEach((flipper) => {
      const front = flipper.querySelector("[data-card-face='front']");
      const back  = flipper.querySelector("[data-card-face='back']");
      flipTl.set(front, { visibility: "hidden"  }, 0.45);
      flipTl.set(back,  { visibility: "visible" }, 0.45);
    });

    let flipped = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start:   "top top",
        end:     "+=450%",
        pin:     true,
        scrub:   0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.5 && !flipped) {
            flipped = true;
            flipTl.play();
          } else if (self.progress <= 0.5 && flipped) {
            flipped = false;
            flipTl.reverse();
          }
          const idx = Math.min(
            Math.floor(self.progress * SERVICES.length),
            SERVICES.length - 1
          );
          setActiveIdx(idx);
        },
      },
    });

    tl.to(row, { scale: 0.78, duration: 1, ease: "none" }, 0);
    tl.to(row, { gap: "clamp(0.6rem, 2.5vw, 4rem)", duration: 1, ease: "none" }, 1);
    cards.forEach((card) => {
      tl.to(
        card.querySelectorAll("[data-card-face]"),
        { borderRadius: "16px", duration: 1, ease: "none" },
        1
      );
    });
    tl.to({}, { duration: 2 }, 2);

    return () => {
      flipTl.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars?.trigger === pin)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={pinRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        padding: "1rem",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        transition: "background 0.7s ease",
        background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${SERVICES[activeIdx].color}07 0%, transparent 70%)`,
      }} />

      {/* Progress dots */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 10,
      }}>
        {SERVICES.map((s, i) => (
          <div key={i} style={{
            height: 4, borderRadius: 100,
            width: i === activeIdx ? 28 : 7,
            background: i === activeIdx ? s.color : "rgba(255,255,255,0.15)",
            boxShadow: i === activeIdx ? `0 0 8px ${s.color}` : "none",
            transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          }} />
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", right: 20, top: "50%",
        transform: "translateY(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 8, opacity: 0.2,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          color: "#e5e5e5", letterSpacing: "0.4em",
          textTransform: "uppercase", writingMode: "vertical-rl",
        }}>scroll to flip</span>
        <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, #e5e5e5, transparent)" }} />
      </div>

      {/* Card row */}
      <div
        ref={rowRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          overflow: "visible",
          willChange: "transform",
        }}
      >
        {SERVICES.map((service, i) => (
          <FlipCardDesktop key={i} service={service} index={i} />
        ))}
      </div>
    </div>
  );
};

// ── Mobile: single-column full-width flip cards ───────────────────
const MobileGrid = () => {
  return (
    <div style={{ padding: "1.5rem 1.1rem 4rem", position: "relative" }}>

      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: "1.75rem",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "rgba(255,255,255,0.22)", letterSpacing: "0.35em",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>tap to reveal</span>
        <div style={{
          flex: 1, height: 1,
          background: "linear-gradient(to right, rgba(255,255,255,0.07), transparent)",
        }} />
      </div>

      {/* Single column stack */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {SERVICES.map((service, i) => (
          <MobileFlipCard key={i} service={service} index={i} />
        ))}
      </div>
    </div>
  );
};

// ── MobileFlipCard: full-width, content-height, tap to flip ──────
const MobileFlipCard = ({ service }) => {
  const [flipped, setFlipped] = useState(false);
  // Fixed height so front/back are same size
  const CARD_H = 220;

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{
        position: "relative",
        width: "100%",
        height: CARD_H,
        perspective: "1000px",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        borderRadius: 16,
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: 16,
          overflow: "hidden",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          border: `1px solid ${service.color}20`,
        }}>
          {/* Bg gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, #111 0%, ${service.color}15 100%)`,
          }} />

          {/* Image */}
          <img
            src={service.image}
            alt={service.title}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.45,
              filter: "grayscale(10%)",
            }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(120deg, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.2) 100%)`,
          }} />

          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, ${service.color}, transparent 70%)`,
          }} />

          {/* Ghost number */}
          <span style={{
            position: "absolute", right: 18, bottom: 10,
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "6rem", color: `${service.color}08`,
            letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none",
          }}>{service.id}</span>

          {/* Content */}
          <div style={{
            position: "absolute", inset: 0,
            padding: "18px 20px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                color: `${service.color}cc`, letterSpacing: "0.35em",
              }}>{service.id}</span>
              {/* Tap chip */}
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "3px 9px", borderRadius: 100,
                border: `1px solid ${service.color}30`,
                background: `${service.color}08`,
              }}>
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke={service.color} strokeWidth="1.2" strokeOpacity="0.7"/>
                  <path d="M5 3v4M3 5l2 2 2-2" stroke={service.color} strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 8,
                  color: `${service.color}99`, letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}>flip</span>
              </div>
            </div>

            {/* Bottom text block */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                color: `${service.color}80`, letterSpacing: "0.2em",
                textTransform: "uppercase", margin: "0 0 6px",
              }}>{service.subtitle}</p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "1.65rem",
                color: "#e8e8e8", letterSpacing: "-0.03em",
                lineHeight: 1.05, margin: "0 0 10px",
              }}>
                {service.title.split("\n").map((line, li) => (
                  <span key={li} style={{ display: "block" }}>
                    {li === 1
                      ? <em style={{ color: service.color, fontStyle: "italic" }}>{line}</em>
                      : line}
                  </span>
                ))}
              </h3>
              {/* Mini tag row preview */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {service.tags.slice(0, 3).map((tag, ti) => (
                  <span key={ti} style={{
                    padding: "2px 8px", borderRadius: 100,
                    border: `1px solid ${service.color}25`,
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: "rgba(255,255,255,0.35)",
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: 16,
          overflow: "hidden",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: `linear-gradient(145deg, ${service.color}12 0%, #0e0e0e 50%, #0a0a0a 100%)`,
          border: `1px solid ${service.color}28`,
        }}>
          {/* Top accent */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, ${service.color}cc, transparent 70%)`,
          }} />

          {/* Scan line */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: 1,
              background: `linear-gradient(to right, transparent, ${service.color}50, transparent)`,
              animation: "scan 4s linear infinite",
            }} />
          </div>

          {/* Ghost watermark */}
          <span style={{
            position: "absolute", right: 12, top: 8,
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "5rem", color: `${service.color}06`,
            letterSpacing: "-0.06em", userSelect: "none",
          }}>{service.id}</span>

          {/* All back content */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "16px 20px",
            height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            {/* Top: title */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                color: `${service.color}80`, letterSpacing: "0.25em",
                textTransform: "uppercase", margin: "0 0 5px",
              }}>{service.subtitle}</p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "1.3rem",
                color: "#e5e5e5", letterSpacing: "-0.03em",
                lineHeight: 1.0, margin: "0 0 8px",
              }}>
                {service.title.split("\n").map((line, li) => (
                  <span key={li} style={{ display: "block" }}>
                    {li === 1
                      ? <em style={{ color: service.color, fontStyle: "italic", textShadow: `0 0 18px ${service.color}45` }}>{line}</em>
                      : line}
                  </span>
                ))}
              </h3>
              <div style={{ height: 1, background: `linear-gradient(to right, ${service.color}40, transparent)`, marginBottom: 8 }} />
              {/* Description — full, no clamp */}
              <p style={{
                fontFamily: "var(--font-body)", fontWeight: 300,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.52)", lineHeight: 1.7, margin: 0,
              }}>{service.desc}</p>
            </div>

            {/* Bottom: tags + metric */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, flex: 1 }}>
                {service.tags.slice(0, 4).map((tag, ti) => (
                  <span key={ti} style={{
                    padding: "3px 9px", borderRadius: 100,
                    border: `1px solid ${service.color}28`,
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: "rgba(255,255,255,0.38)",
                  }}>{tag}</span>
                ))}
              </div>
              {/* Metric badge */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "6px 12px", borderRadius: 10, flexShrink: 0,
                background: `${service.color}0c`,
                border: `1px solid ${service.color}22`,
              }}>
                <span style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "1.4rem",
                  color: service.color, letterSpacing: "-0.04em",
                  textShadow: `0 0 14px ${service.color}55`,
                  lineHeight: 1,
                }}>{service.metric.value}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 8,
                  color: "rgba(255,255,255,0.32)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  textAlign: "center", marginTop: 2, lineHeight: 1.4,
                }}>{service.metric.label}</span>
              </div>
            </div>
          </div>

          {/* Corner bracket */}
          <svg style={{ position: "absolute", bottom: 10, right: 10 }}
            width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M0 14 L14 14 L14 0" stroke={service.color} strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ── FlipCardDesktop (original, unchanged) ─────────────────────────
const FlipCardDesktop = ({ service }) => {
  return (
    <div
      data-card-shell
      style={{
        position: "relative",
        width: "clamp(200px, 28vw, 420px)",
        aspectRatio: "2/3",
        flexShrink: 0,
        background: "transparent",
        perspective: "1200px",
        overflow: "visible",
      }}
    >
      <div
        data-flip-inner
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* ── FRONT ── */}
        <div
          data-card-face="front"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(4px)",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(160deg, #0a0a0a 0%, ${service.color}18 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(4rem, 12vw, 8rem)",
              color: `${service.color}10`, letterSpacing: "-0.06em",
              userSelect: "none",
            }}>{service.id}</span>
          </div>

          <img
            src={service.image}
            alt={service.title}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.6,
              filter: "grayscale(20%)",
            }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />

          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.38) 100%)",
          }} />

          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, ${service.color}, transparent)`,
          }} />

          <span style={{
            position: "absolute", top: 16, left: 16,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: `${service.color}cc`, letterSpacing: "0.35em",
          }}>{service.id}</span>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(14px,2vw,22px)" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(8px,1vw,10px)",
              color: `${service.color}80`, letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 6,
            }}>{service.subtitle}</p>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(1rem,2.2vw,1.5rem)",
              color: "#e5e5e5", letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>{service.title.replace("\n", " ")}</p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          data-card-face="back"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(4px)",
            background: `linear-gradient(160deg, ${service.color}14 0%, #0d0d0d 55%, #0a0a0a 100%)`,
            border: `1px solid ${service.color}22`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(14px,2vw,22px)",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, ${service.color}cc, transparent)`,
          }} />

          <span style={{
            position: "absolute", top: 8, right: 8,
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(3rem,8vw,5.5rem)",
            color: `${service.color}07`, letterSpacing: "-0.06em",
            userSelect: "none",
          }}>{service.id}</span>

          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: 2,
              background: `linear-gradient(to right, transparent, ${service.color}55, transparent)`,
              animation: "scan 4s linear infinite",
            }} />
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "clamp(6px,1.2vh,12px)" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(8px,0.9vw,10px)",
              color: `${service.color}80`, letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>{service.subtitle}</p>

            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(1.1rem,2.5vw,1.75rem)",
              color: "#e5e5e5", letterSpacing: "-0.03em",
              lineHeight: 1.0, margin: 0,
            }}>
              {service.title.split("\n").map((line, li) => (
                <span key={li} style={{ display: "block" }}>
                  {li === 1
                    ? <em style={{ color: service.color, fontStyle: "italic", textShadow: `0 0 25px ${service.color}40` }}>{line}</em>
                    : line}
                </span>
              ))}
            </h3>

            <div style={{ height: 1, background: `linear-gradient(to right, ${service.color}40, transparent)` }} />

            <p style={{
              fontFamily: "var(--font-body)", fontWeight: 300,
              fontSize: "clamp(0.68rem,1.1vw,0.88rem)",
              color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0,
            }}>{service.desc}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {service.tags.slice(0, 4).map((tag, ti) => (
                <span key={ti} style={{
                  padding: "3px 9px", borderRadius: 100,
                  border: `1px solid ${service.color}30`,
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(7px,0.8vw,9px)",
                  color: "rgba(255,255,255,0.45)",
                }}>{tag}</span>
              ))}
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "clamp(6px,1vw,10px) clamp(10px,1.5vw,14px)",
              borderRadius: "0.5rem", alignSelf: "flex-start",
              background: `${service.color}0a`,
              border: `1px solid ${service.color}22`,
            }}>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(1.1rem,2.5vw,1.7rem)",
                color: service.color, letterSpacing: "-0.04em",
                textShadow: `0 0 18px ${service.color}50`,
              }}>{service.metric.value}</span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(7px,0.8vw,9px)",
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.14em", textTransform: "uppercase",
                maxWidth: 80, lineHeight: 1.5,
              }}>{service.metric.label}</span>
            </div>
          </div>

          <svg style={{ position: "absolute", bottom: 10, right: 10 }}
            width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M0 14 L14 14 L14 0" stroke={service.color} strokeWidth="1" strokeOpacity="0.4" />
          </svg>
        </div>
      </div>
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
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.02,
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(12px, 3vw, 28px)" }}>
        <span className="service-intro-index" style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "rgba(255,255,255,0.2)", letterSpacing: "0.4em",
          textTransform: "uppercase", paddingTop: "0.6em",
        }}>03</span>

        <div>
          {words.map((word, wi) => (
            <div key={wi} style={{ overflow: "hidden" }}>
              <div style={{ display: "flex" }}>
                {word.split("").map((ch, ci) => (
                  <span key={ci} className="intro-char" style={{
                    display: "inline-block",
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "clamp(2rem, 7vw, 7rem)",
                    color: wi === 2 ? "#00ff88" : "#e5e5e5",
                    letterSpacing: "-0.04em", lineHeight: 1.0,
                    textShadow: wi === 2 ? "0 0 60px rgba(0,255,136,0.22)" : "none",
                  }}>{ch}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(12px, 3vw, 24px)", marginTop: "clamp(1rem, 3vw, 2rem)" }}>
        <div ref={lineRef} style={{
          height: 1, flexShrink: 0,
          width: "clamp(40px, 8vw, 100px)",
          background: "linear-gradient(to right, #00ff88, #00d4ff)",
          transformOrigin: "left",
          boxShadow: "0 0 8px rgba(0,255,136,0.35)",
          marginTop: 8,
        }} />
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 300,
          fontSize: "clamp(0.82rem, 1.3vw, 0.98rem)",
          color: "rgba(255,255,255,0.38)", lineHeight: 1.75, margin: 0, maxWidth: 480,
        }}>
          Specialized in building secure, high-performance applications — from real-time
          collaboration to 3D web experiences, merging precision with creative vision.
        </p>
      </div>

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
          position: relative; overflow: hidden;
          padding: 4rem 1.25rem 3rem;
        }
        @media (min-width: 480px) { .service-intro-wrap { padding: 5rem 1.75rem 3.5rem; } }
        @media (min-width: 768px) { .service-intro-wrap { padding: 6rem 3rem 4rem; } }
        @media (min-width: 1024px) { .service-intro-wrap { padding: 7rem 4rem 5rem; } }
        @media (max-width: 360px) { .service-intro-index { display: none; } }
        .scroll-hint { display: none; }
        @media (min-width: 900px) { .scroll-hint { display: flex; } }
      `}</style>
    </div>
  );
};

export default Services;

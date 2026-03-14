import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { achievements } from "../constants";
import { Icon } from "@iconify/react/dist/iconify.js";

gsap.registerPlugin(SplitText, ScrollTrigger);

// golden-angle spread used to scatter chars outward
function goldenAnglePos(i, total, rMin, rMax) {
  const phi   = Math.PI * (3 - Math.sqrt(5));
  const angle = i * phi;
  const r     = rMin + (rMax - rMin) * Math.sqrt(i / total);
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.55 };
}

export default function About() {
  const sectionRef = useRef(null);
  const sheryDone  = useRef(false);

  const pill1 = useRef(null); const pill2 = useRef(null);
  const pill3 = useRef(null); const pill4 = useRef(null);
  const line1 = useRef(null); const line2 = useRef(null);
  const line3 = useRef(null); const line4 = useRef(null);
  const line5 = useRef(null);
  const bioRef    = useRef(null);
  const achRef    = useRef(null);
  const bioPara1  = useRef(null); // ← bio paragraph refs
  const bioPara2  = useRef(null);

  /* ── Shery imageEffect ── */
  useGSAP(() => {
    if (sheryDone.current) return;
    const boot = () => {
      if (!window.Shery) { setTimeout(boot, 120); return; }
      const container = document.querySelector(".about-img-div");
      if (!container) return;
      const imgs = [...container.querySelectorAll("img")];
      const pending = imgs.filter(i => !i.complete || !i.naturalWidth);
      const go = () => {
        if (sheryDone.current) return;
        sheryDone.current = true;
        window.Shery.imageEffect(".about-img-div", {
          style: 5, gooey: true,
          config: {
            a: { value: 2, range: [0, 30] },
            b: { value: 0.75, range: [-1, 1] },
            zindex: { value: 1, range: [-9999999, 9999999] },
            aspect: { value: 0.724 },
            gooey: { value: true },
            infiniteGooey: { value: false },
            growSize: { value: 4, range: [1, 15] },
            durationOut: { value: 1, range: [0.1, 5] },
            durationIn: { value: 1.5, range: [0.1, 5] },
            displaceAmount: { value: 0.5 },
            masker: { value: true },
            maskVal: { value: 1.23, range: [1, 5] },
            scrollType: { value: 0 },
            geoVertex: { value: 1, range: [1, 64] },
            noEffectGooey: { value: true },
            onMouse: { value: 1 },
            noise_speed: { value: 0.5, range: [0, 10] },
            metaball: { value: 0.33, range: [0, 2] },
            discard_threshold: { value: 0.5, range: [0, 1] },
            antialias_threshold: { value: 0.01, range: [0, 0.1] },
            noise_height: { value: 0.5, range: [0, 2] },
            noise_scale: { value: 10, range: [0, 100] },
          },
        });
        const patch = () => {
          const canvas = container.querySelector("canvas");
          const wrap   = container.querySelector("._canvas_container") || container;
          if (canvas) {
            canvas.style.position = "absolute"; canvas.style.top = "0";
            canvas.style.left = "0"; canvas.style.width = "100%";
            canvas.style.height = "100%"; canvas.style.zIndex = "1";
          }
          if (wrap && wrap !== container) {
            wrap.style.position = "absolute"; wrap.style.top = "0";
            wrap.style.left = "0"; wrap.style.width = "100%"; wrap.style.height = "100%";
          }
          if (!canvas) requestAnimationFrame(patch);
        };
        requestAnimationFrame(patch);
      };
      if (!pending.length) { go(); return; }
      let n = 0;
      pending.forEach(img => {
        const done = () => { if (++n >= pending.length) go(); };
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    };
    boot();
  }, []);

  /* ── GSAP ── */
  useGSAP(() => {
    const ctx = gsap.context(() => {

      // headline word reveals
      [line1, line2, line3, line4, line5].forEach(line => {
        const words = line.current?.querySelectorAll(".w");
        if (words?.length) {
          gsap.from(words, {
            y: "115%", opacity: 0, stagger: 0.055, duration: 1.0, ease: "power4.out",
            scrollTrigger: { trigger: line.current, start: "top 90%", once: true },
          });
        }
      });

      // pill expand
      [
        { pill: pill1, line: line1 }, { pill: pill2, line: line2 },
        { pill: pill3, line: line3 }, { pill: pill4, line: line5 },
      ].forEach(({ pill, line }) => {
        if (!pill.current) return;
        const w = window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 90 : 150;
        if (!w) return;
        gsap.to(pill.current, {
          width: w, ease: "power3.out",
          scrollTrigger: { trigger: line.current, start: "top 86%", end: "top 40%", scrub: 1.4 },
        });
      });

      // bio items (heading, tags, links — NOT the paragraphs, those get scatter below)
      if (bioRef.current) {
        gsap.from(bioRef.current.querySelectorAll(".bio-item"), {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: bioRef.current, start: "top 84%", once: true },
        });
      }

      // achievement rows
      if (achRef.current) {
        gsap.from(achRef.current.querySelectorAll(".ach-row"), {
          x: -32, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: achRef.current, start: "top 88%", once: true },
        });
      }

      // underlines
      gsap.utils.toArray(".about-underline").forEach(el => {
        gsap.from(el, {
          scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      // section scale-out
      gsap.to(sectionRef.current, {
        scale: 0.96, opacity: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 75%", end: "bottom 15%", scrub: true,
        },
      });

      // ── BIO PARAGRAPH SCATTER → ASSEMBLE ─────────────────────────────────
      // Wait for fonts so SplitText gets correct glyph metrics
      document.fonts.ready.then(() => {
        [bioPara1, bioPara2].forEach((paraRef, pi) => {
          const el = paraRef.current;
          if (!el) return;

          // Make the paragraph a relative container so offsetLeft/Top are local
          el.style.position = "relative";

          const split = new SplitText(el, { type: "chars", charsClass: "bio-char" });
          const total = split.chars.length;

          // Snapshot where each char should land (assembled position)
          const positions = split.chars.map(ch => ({
            left: ch.offsetLeft,
            top:  ch.offsetTop,
          }));

          const elRect  = el.getBoundingClientRect();
          const centerX = elRect.width  * 0.5;
          const centerY = elRect.height * 0.5;
          const rMax    = Math.min(elRect.width, elRect.height * 4) * 0.38;

          // Scatter chars to golden-angle radial positions
          split.chars.forEach((ch, i) => {
            const { x: dx, y: dy } = goldenAnglePos(i, total, 40, rMax);
            gsap.set(ch, {
              position : "absolute",
              left     : centerX + dx,
              top      : centerY + dy,
              opacity  : 0,
              scale    : 0.6 + Math.random() * 0.6,
              rotation : (Math.random() - 0.5) * 40,
              color    : `hsl(152,${20 + Math.random() * 25}%,${40 + Math.random() * 20}%)`,
            });
          });

          // Assemble on scroll — staggered per char with golden-angle ordering
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger : el,
              start   : "top 85%",
              end     : "top 30%",
              scrub   : 1.4,
            },
          });

          split.chars.forEach((ch, i) => {
            const progress = (i / total) * 0.7 + Math.random() * 0.08;
            tl.to(ch, {
              left     : positions[i].left,
              top      : positions[i].top,
              opacity  : 1,
              scale    : 1,
              rotation : 0,
              color    : "rgba(229,229,229,0.55)",
              ease     : "expo.out",
            }, progress);
          });

          // Small stagger delay between the two paragraphs
          if (pi === 1) ScrollTrigger.refresh();
        });
      });
      // ─────────────────────────────────────────────────────────────────────

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const SectionHeader = ({ num, title }) => (
    <div className="flex items-center gap-5 mb-12 sm:mb-16">
      <span className="font-display font-bold leading-none select-none"
        style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "transparent", WebkitTextStroke: "1px rgba(0,255,136,0.22)" }}>
        {num}
      </span>
      <div className="about-underline flex-1 h-px" style={{ background: "rgba(0,255,136,0.18)" }} />
      <span className="font-mono uppercase tracking-[0.38em]"
        style={{ fontSize: 10, color: "rgba(0,255,136,0.5)" }}>
        {title}
      </span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');

        .ab-pill img { transition: transform 0.55s cubic-bezier(0.16,1,0.3,1); }
        .ab-pill:hover img { transform: translateX(-50%) scale(1.07); }

        .bio-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 2px;
          cursor: default;
          transition: background 0.2s ease, border-color 0.2s ease,
                      color 0.2s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1);
        }
        .bio-tag:hover { transform: translateY(-2px); }

        .ach-row  { transition: padding-left 0.3s cubic-bezier(0.16,1,0.3,1); }
        .ach-bg   { transition: opacity 0.25s ease; }
        .ach-icon { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .ach-dot  { transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .cta-line { transition: width 0.35s cubic-bezier(0.16,1,0.3,1); }

        .hobby-card {
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      background 0.25s ease, border-color 0.25s ease, box-shadow 0.35s ease;
        }
        .hob-icon { transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1); }
        .hob-bar  { transition: width 0.4s cubic-bezier(0.16,1,0.3,1); }
        .hob-glow { transition: opacity 0.35s ease; }

        /* bio char — takes absolute positioning from GSAP */
        .bio-char {
          display: inline-block;
          will-change: transform, left, top, opacity;
        }

        @media (max-width: 639px) {
          .ab-pill { display: none !important; }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        className="relative"
        style={{ background: "#111111", transformOrigin: "top center" }}
      >
        {/* grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.04) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(0,255,136,0.04) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
          width: "min(900px,100vw)", height: 500,
          background: "radial-gradient(ellipse,rgba(0,255,136,0.04) 0%,transparent 70%)",
        }} />

        {/* ════════════════════════════════
            01  EDITORIAL HEADLINE
        ════════════════════════════════ */}
        <div className="relative z-10 px-[5.5vw] pt-[17vh] pb-[10vh]">
          <SectionHeader num="03" title="About" />

          {[
            {
              ref: line1, pill: pill1, pillSrc: "/assets/projects/codexspace.jpg",
              left: "I Build", right: "Digital",
              rightStyle: { color: "transparent", WebkitTextStroke: "1.5px rgba(0,255,136,0.4)" },
            },
            {
              ref: line2, pill: pill2, pillSrc: "/assets/projects/gamebit.jpg",
              left: "Experiences", right: "That", rightStyle: {},
            },
            {
              ref: line3, pill: pill3, pillSrc: "/assets/projects/hyperspace.jpg",
              left: "Don't",
              leftStyle: { color: "transparent", WebkitTextStroke: "1.5px rgba(229,229,229,0.2)" },
              right: "Just", rightStyle: {},
            },
            {
              ref: line4, pill: null,
              left: "Look", right: "Good —",
              rightStyle: { color: "transparent", WebkitTextStroke: "1.5px rgba(229,229,229,0.2)" },
            },
            {
              ref: line5, pill: pill4, pillSrc: "/assets/projects/api-hub.jpg",
              left: "They", right: "Move",
              rightStyle: { color: "transparent", WebkitTextStroke: "1.5px rgba(229,229,229,0.2)" },
              extra: "People.",
              extraStyle: { color: "#00ff88", textShadow: "0 0 80px rgba(0,255,136,0.22)" },
            },
          ].map(({ ref, pill, pillSrc, left, leftStyle = {}, right, rightStyle, extra, extraStyle }, i) => (
            <div key={i} ref={ref}
              className="flex flex-wrap items-center leading-none"
              style={{ gap: "clamp(6px,1.5vw,18px)", marginBottom: "clamp(2px,0.4vw,6px)" }}
            >
              <div className="overflow-hidden">
                <span className="w block font-display font-black uppercase text-text"
                  style={{ fontSize: "clamp(2.2rem,7.2vw,7.2rem)", lineHeight: 1, letterSpacing: "-0.02em", ...leftStyle }}>
                  {left}
                </span>
              </div>

              {pill && (
                <span ref={pill}
                  className="ab-pill inline-block overflow-hidden relative flex-shrink-0"
                  style={{ width: 0, height: "clamp(2.2rem,6.4vw,6.4rem)", borderRadius: 4, verticalAlign: "middle" }}>
                  <img src={pillSrc} alt=""
                    className="h-full object-cover object-center absolute left-1/2 -translate-x-1/2"
                    style={{ width: 240 }} />
                </span>
              )}

              <div className="overflow-hidden">
                <span className="w block font-display font-black uppercase text-text"
                  style={{ fontSize: "clamp(2.2rem,7.2vw,7.2rem)", lineHeight: 1, letterSpacing: "-0.02em", ...rightStyle }}>
                  {right}
                </span>
              </div>

              {extra && (
                <div className="overflow-hidden">
                  <span className="w block font-display font-black uppercase"
                    style={{ fontSize: "clamp(2.2rem,7.2vw,7.2rem)", lineHeight: 1, letterSpacing: "-0.02em", ...extraStyle }}>
                    {extra}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ════════════════════════════════
            02  PROFILE + BIO
        ════════════════════════════════ */}
        <div className="relative z-10 px-[5.5vw] pb-[15vh]">
          <div className="about-underline h-px mb-[8vw]" style={{ background: "rgba(255,255,255,0.08)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5vw] items-start">

            {/* photo */}
            <div className="relative rounded-sm overflow-hidden"
              style={{ height: "clamp(340px,60vw,720px)" }}>
              <div className="about-img-div" style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src="/images/anshu-masked.jpg" alt="Anshu Raj"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                <img src="/images/anshu-profile.jpg" alt="Anshu Raj colour"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              </div>

              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top,rgba(17,17,17,0.9) 0%,transparent 38%)", zIndex: 2 }} />

              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex items-end justify-between"
                style={{ zIndex: 3 }}>
                <div>
                  <p className="font-display font-bold uppercase text-text mb-0.5"
                    style={{ fontSize: "clamp(1rem,2.2vw,1.6rem)", letterSpacing: "-0.01em" }}>
                    Anshu Raj
                  </p>
                  <p className="font-mono uppercase tracking-[0.28em]"
                    style={{ fontSize: 9, color: "rgba(0,255,136,0.6)" }}>
                    Full-Stack · Creative Dev
                  </p>
                </div>
                <p className="font-mono uppercase tracking-[0.28em] hidden sm:block"
                  style={{ fontSize: 9, color: "rgba(0,255,136,0.35)" }}>
                  Hover to reveal ✦
                </p>
              </div>

              {[
                { cls: "top-0 left-0",     d: "M36 0 L0 0 L0 36"   },
                { cls: "top-0 right-0",    d: "M0 0 L36 0 L36 36"  },
                { cls: "bottom-0 left-0",  d: "M36 36 L0 36 L0 0"  },
                { cls: "bottom-0 right-0", d: "M0 36 L36 36 L36 0" },
              ].map(({ cls, d }) => (
                <svg key={d} className={`absolute w-9 h-9 ${cls}`} style={{ zIndex: 4 }} viewBox="0 0 36 36" fill="none">
                  <path d={d} stroke="#00ff88" strokeWidth="1.5" strokeOpacity="0.4" />
                </svg>
              ))}

              <div className="absolute top-0 left-0 w-[2px] h-full pointer-events-none"
                style={{ background: "linear-gradient(to bottom,transparent,#00ff8850 35%,#00d4ff40 70%,transparent)", zIndex: 3 }} />
            </div>

            {/* bio */}
            <div ref={bioRef} className="flex flex-col gap-10 pt-2">

              <div className="bio-item">
                <h2 className="font-display font-black uppercase leading-[0.9]"
                  style={{ fontSize: "clamp(2.4rem,5.5vw,5.2rem)", letterSpacing: "-0.03em" }}>
                  Designed<br />to{" "}
                  <span style={{ color: "transparent", WebkitTextStroke: "1.5px #00ff88" }}>Disrupt</span>
                  <br />the Ordinary
                </h2>
              </div>

              <div className="bio-item about-underline h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* ── bio paragraphs — get the scatter/assemble treatment ── */}
              <div className="bio-item" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p
                  ref={bioPara1}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontWeight: 300,
                    fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.85,
                    color: "rgba(229,229,229,0.55)", letterSpacing: "0.01em",
                    maxWidth: 480,
                    // needs a known height so absolute children stay inside
                    minHeight: "4.5em",
                  }}
                >
                  I'm Anshu Raj — a full-stack developer with a compulsion for interfaces
                  that feel alive. Every transition is earned, every shader intentional.
                </p>
                <p
                  ref={bioPara2}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontWeight: 300,
                    fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.85,
                    color: "rgba(229,229,229,0.55)", letterSpacing: "0.01em",
                    maxWidth: 480,
                    minHeight: "4.5em",
                  }}
                >
                  From WebGL particle systems to real-time Socket.io collaboration, I work
                  across creative front-end and backend architecture — balancing visual
                  design with technical reliability.
                </p>
              </div>

              <div className="bio-item" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { label: "React / Next.js",   color: "#00ff88" },
                  { label: "Node.js / Express", color: "#00d4ff" },
                  { label: "Three.js",          color: "#b77bff" },
                  { label: "GSAP",              color: "#00ff88" },
                  { label: "WebGL / Shaders",   color: "#00d4ff" },
                  { label: "MongoDB",           color: "#b77bff" },
                  { label: "Socket.io",         color: "#00ff88" },
                  { label: "TypeScript",        color: "#00d4ff" },
                  { label: "Google Gemini AI",  color: "#b77bff" },
                ].map(tag => (
                  <span key={tag.label} className="bio-tag"
                    style={{ border: `1px solid ${tag.color}30`, color: `${tag.color}aa` }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background  = `${tag.color}12`;
                      e.currentTarget.style.borderColor = `${tag.color}65`;
                      e.currentTarget.style.color       = tag.color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background  = "transparent";
                      e.currentTarget.style.borderColor = `${tag.color}30`;
                      e.currentTarget.style.color       = `${tag.color}aa`;
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              <div className="bio-item" style={{ display: "flex", alignItems: "center", gap: 32 }}>
                {[
                  { label: "View GitHub", href: "https://github.com/anshu-c8NETed", color: "#00ff88" },
                  { label: "Say Hello",   href: "mailto:rajanshu2123@gmail.com",     color: "rgba(229,229,229,0.35)" },
                ].map(({ label, href, color }) => (
                  <a key={label} href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center font-mono uppercase"
                    style={{ gap: 10, fontSize: 11, letterSpacing: "0.28em", color, textDecoration: "none",
                      transition: "color 0.2s ease" }}
                    onMouseEnter={e => {
                      e.currentTarget.querySelector(".cta-line").style.width = "48px";
                      if (color !== "#00ff88") e.currentTarget.style.color = "rgba(229,229,229,0.7)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.querySelector(".cta-line").style.width = "24px";
                      if (color !== "#00ff88") e.currentTarget.style.color = color;
                    }}
                  >
                    <div className="cta-line" style={{ width: 24, height: 1, background: color }} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            03  ACHIEVEMENTS
        ════════════════════════════════ */}
        <div ref={achRef} className="relative z-10 px-[5.5vw] pb-[14vh]">
          <SectionHeader num="04" title="Achievements & Certifications" />

          {achievements.map((ach, i) => {
            const accent   = ["#00ff88","#00d4ff","#b77bff","#ffcc44","#00ff88"][i % 5];
            const iconList = ["lucide:code-2","lucide:award","lucide:brain","lucide:zap","lucide:shield-check"];
            return (
              <div key={i}
                className="ach-row group relative flex items-center"
                style={{
                  gap: "clamp(1rem,2.5vw,2.5rem)",
                  padding: "clamp(1.1rem,2.5vh,1.5rem) 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.paddingLeft = "8px";
                  e.currentTarget.querySelector(".ach-bg").style.opacity     = "1";
                  e.currentTarget.querySelector(".ach-icon").style.transform = "scale(1.15)";
                  e.currentTarget.querySelector(".ach-dot").style.opacity    = "1";
                  e.currentTarget.querySelector(".ach-dot").style.transform  = "scale(1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.paddingLeft = "0";
                  e.currentTarget.querySelector(".ach-bg").style.opacity     = "0";
                  e.currentTarget.querySelector(".ach-icon").style.transform = "scale(1)";
                  e.currentTarget.querySelector(".ach-dot").style.opacity    = "0";
                  e.currentTarget.querySelector(".ach-dot").style.transform  = "scale(0.6)";
                }}
              >
                <div className="ach-bg absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(to right,${accent}07,transparent 55%)`, opacity: 0 }} />
                <span className="font-mono tabular-nums flex-shrink-0 w-7 text-right"
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.14)", letterSpacing: "0.1em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="ach-icon flex-shrink-0 flex items-center justify-center"
                  style={{ width: 34, height: 34, borderRadius: 10,
                    background: `${accent}10`, border: `1px solid ${accent}20` }}>
                  <Icon icon={iconList[i % iconList.length]} style={{ color: accent, width: 14, height: 14 }} />
                </div>
                <p className="flex-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(0.78rem,1.4vw,0.88rem)", lineHeight: 1.6, color: "rgba(229,229,229,0.52)", margin: 0 }}>
                  {ach}
                </p>
                <div className="ach-dot flex-shrink-0"
                  style={{ width: 6, height: 6, borderRadius: "50%",
                    background: accent, boxShadow: `0 0 8px ${accent}`,
                    opacity: 0, transform: "scale(0.6)" }} />
              </div>
            );
          })}
        </div>

        {/* ════════════════════════════════
            04  HOBBIES
        ════════════════════════════════ */}
        <div className="relative z-10 px-[5.5vw] pb-[16vh]">
          <SectionHeader num="05" title="Beyond the Code" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Chess",   icon: "mdi:chess-knight", desc: "Tactical thinking & pattern recognition", color: "#00ff88" },
              { label: "Workout", icon: "lucide:dumbbell",  desc: "Discipline that bleeds into the craft",   color: "#00d4ff" },
              { label: "Reading", icon: "lucide:book-open", desc: "Books that sharpen perspective",          color: "#b77bff" },
              { label: "Sports",  icon: "lucide:activity",  desc: "Team play & competitive edge",            color: "#ffcc44" },
            ].map(h => (
              <div key={h.label}
                className="hobby-card group relative overflow-hidden rounded-2xl flex flex-col"
                style={{
                  padding: "clamp(1.2rem,2.5vw,1.6rem)",
                  gap: "clamp(0.9rem,2vh,1.4rem)",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background  = `${h.color}08`;
                  e.currentTarget.style.borderColor = `${h.color}26`;
                  e.currentTarget.style.transform   = "translateY(-5px)";
                  e.currentTarget.style.boxShadow   = `0 24px 48px ${h.color}0e`;
                  e.currentTarget.querySelector(".hob-bar").style.width      = "100%";
                  e.currentTarget.querySelector(".hob-glow").style.opacity   = "1";
                  e.currentTarget.querySelector(".hob-icon").style.transform = "scale(1.1) rotate(-3deg)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform   = "translateY(0)";
                  e.currentTarget.style.boxShadow   = "none";
                  e.currentTarget.querySelector(".hob-bar").style.width      = "0%";
                  e.currentTarget.querySelector(".hob-glow").style.opacity   = "0";
                  e.currentTarget.querySelector(".hob-icon").style.transform = "scale(1) rotate(0deg)";
                }}
              >
                <div className="hob-icon flex-shrink-0 flex items-center justify-center"
                  style={{ width: 44, height: 44, borderRadius: 12,
                    background: `${h.color}12`, border: `1px solid ${h.color}22` }}>
                  <Icon icon={h.icon} style={{ color: h.color, width: 20, height: 20 }} />
                </div>
                <div>
                  <p className="font-display font-bold uppercase mb-1"
                    style={{ fontSize: "clamp(0.9rem,1.8vw,1.05rem)", color: "#e5e5e5", letterSpacing: "-0.01em" }}>
                    {h.label}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "clamp(0.67rem,1.1vw,0.75rem)", lineHeight: 1.65, color: "rgba(229,229,229,0.38)" }}>
                    {h.desc}
                  </p>
                </div>
                <div className="hob-bar absolute bottom-0 left-0 h-[1.5px]"
                  style={{ width: "0%", background: `linear-gradient(to right,${h.color}65,transparent)` }} />
                <div className="hob-glow absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle,${h.color}16,transparent 70%)`, opacity: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

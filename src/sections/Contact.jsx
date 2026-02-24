import { useEffect, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";
import Marquee from "../components/Marquee";
import { socials } from "../constants";

gsap.registerPlugin(ScrollTrigger);

/* ─── UnicornStudio Scene ────────────────────────────────────── */
const ContactScene = () => {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const load = () => {
      if (typeof window.UnicornStudio === "undefined") { setTimeout(load, 300); return; }
      window.UnicornStudio.addScene({
        elementId: "contact-unicorn-bg",
        fps: 60, scale: 1,
        dpi: Math.min(window.devicePixelRatio, 2),
        lazyLoad: false,
        filePath: "/ContactEffect/effect.json",
        interactivity: { mouse: { disableMobile: true } },
      }).catch((e) => console.warn("UnicornStudio:", e));
    };
    if (!document.getElementById("us-script-contact")) {
      const s = document.createElement("script");
      s.id = "us-script-contact";
      s.src = "https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js";
      s.onload = load;
      document.head.appendChild(s);
    } else { load(); }
  }, []);
  return <div id="contact-unicorn-bg" className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
};

/* ─── Text Scramble ──────────────────────────────────────────── */
const CHARS = "!<>-_\\/[]{}—=+*^?#@$%&0123456789ABCDEFabcdef";
const useScramble = (text, active) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    let frame = 0; const total = 32; let raf;
    const tick = () => {
      const p = frame / total;
      el.textContent = text.split("").map((ch, i) => {
        if (ch === " ") return " ";
        if (i / text.length < p) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      frame++;
      if (frame <= total) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active, text]);
  return ref;
};

/* ─── Magnetic wrapper ───────────────────────────────────────── */
const Magnetic = ({ children, strength = 0.2 }) => {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const dx = (e.clientX - left - width / 2) * strength;
    const dy = (e.clientY - top - height / 2) * strength;
    gsap.to(ref.current, { x: dx, y: dy, duration: 0.5, ease: "power2.out" });
  }, [strength]);
  const onLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)" });
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
};

/* ─── Floating label field ───────────────────────────────────── */
const Field = ({ id, name, label, type = "text", value, onChange, onBlur,
  error, touched, accent = "#00ff88", multiline = false, rows = 5, maxLength }) => {
  const [focused, setFocused] = useState(false);
  const lineRef = useRef(null);
  const labelRef = useRef(null);
  const isUp = focused || value.length > 0;

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, { scaleX: focused ? 1 : 0, duration: 0.4, ease: "power3.out", transformOrigin: "left" });
  }, [focused]);

  useEffect(() => {
    if (!labelRef.current) return;
    gsap.to(labelRef.current, {
      y: isUp ? -22 : 0, scale: isUp ? 0.76 : 1,
      color: isUp ? (error && touched ? "#ef4444" : accent) : "rgba(229,229,229,0.3)",
      duration: 0.3, ease: "power2.out", transformOrigin: "left",
    });
  }, [isUp, accent, error, touched]);

  const shared = {
    id, name, value, maxLength, onChange,
    onBlur: (e) => { setFocused(false); onBlur?.(e); },
    onFocus: () => setFocused(true),
    style: {
      width: "100%", background: "transparent", border: "none",
      borderBottom: `1px solid ${error && touched ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.1)"}`,
      padding: "18px 0 10px", color: "#e5e5e5",
      fontFamily: "var(--font-mono)", fontSize: "clamp(0.85rem,1.4vw,0.95rem)",
      outline: "none", resize: "none", letterSpacing: "0.02em",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      overflowY: multiline ? "auto" : undefined,
    },
  };

  return (
    <div style={{ position: "relative", paddingTop: 14 }}>
      <label ref={labelRef} htmlFor={id} style={{
        position: "absolute", top: 30, left: 0,
        fontFamily: "var(--font-mono)", fontSize: "clamp(0.78rem,1.2vw,0.84rem)",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "rgba(229,229,229,0.3)", pointerEvents: "none", transformOrigin: "left",
      }}>
        {label}
      </label>
      {multiline ? <textarea rows={rows} {...shared} /> : <input type={type} {...shared} />}
      <div ref={lineRef} style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: error && touched ? "rgba(239,68,68,0.7)" : `linear-gradient(to right, ${accent}, ${accent}66)`,
        transform: "scaleX(0)", transformOrigin: "left",
        boxShadow: focused ? `0 0 14px ${accent}55` : "none",
      }} />
      {error && touched && (
        <p style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, color: "#ef4444", letterSpacing: "0.06em" }}>
          — {error}
        </p>
      )}
      {multiline && maxLength && (
        <p style={{
          position: "absolute", bottom: error && touched ? -20 : -18, right: 0,
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em",
          color: value.length > maxLength * 0.8 ? accent : "rgba(255,255,255,0.18)",
        }}>
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

/* ─── Contact ────────────────────────────────────────────────── */
const Contact = () => {
  const sectionRef     = useRef(null);
  const heroRef        = useRef(null);
  const foldRef        = useRef(null);
  const formSectionRef = useRef(null);
  const taglineRef     = useRef(null);
  const pillRef1       = useRef(null);
  const pillRef2       = useRef(null);
  const infoRef        = useRef(null);
  const formElem       = useRef(null);

  const [scramble, setScramble] = useState(false);
  const line1Ref = useScramble("LET'S", scramble);
  const line2Ref = useScramble("TALK.", scramble);

  /* Form state */
  const [fd, setFd]     = useState({ name: "", email: "", message: "" });
  const [fe, setFe]     = useState({});
  const [ft, setFt]     = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus]   = useState(null);

  const validate = (n, v) => {
    if (n === "name")    return !v.trim() ? "Required" : v.trim().length < 2 ? "Min 2 chars" : "";
    if (n === "email")   return !v.trim() ? "Required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid format" : "";
    if (n === "message") return !v.trim() ? "Required" : v.trim().length < 10 ? "Min 10 chars" : "";
    return "";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFd(p => ({ ...p, [name]: value }));
    if (ft[name]) setFe(p => ({ ...p, [name]: validate(name, value) }));
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFt(p => ({ ...p, [name]: true }));
    setFe(p => ({ ...p, [name]: validate(name, value) }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(fd).forEach(k => { const err = validate(k, fd[k]); if (err) errors[k] = err; });
    setFe(errors); setFt({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      gsap.timeline()
        .to(formElem.current, { x: -8, duration: 0.07 })
        .to(formElem.current, { x: 8,  duration: 0.07 })
        .to(formElem.current, { x: -5, duration: 0.07 })
        .to(formElem.current, { x: 0,  duration: 0.07 });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "3cf7a9c6-0d4d-43d9-bb80-42b291901303",
          name: fd.name, email: fd.email, message: fd.message,
          subject: `Portfolio contact from ${fd.name}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("ok"); setFd({ name: "", email: "", message: "" }); setFt({});
        setTimeout(() => setStatus(null), 5000);
      } else throw new Error();
    } catch { setStatus("err"); setTimeout(() => setStatus(null), 5000); }
    finally   { setSending(false); }
  };

  /* ── GSAP animations ── */
  useGSAP(() => {
    const ctx = gsap.context(() => {

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => setScramble(true),
      });

      gsap.from([line1Ref.current, line2Ref.current], {
        yPercent: 120,
        opacity: 0,
        stagger: 0.18,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: { trigger: heroRef.current, start: "top 78%", once: true },
      });

      [pillRef1.current, pillRef2.current].filter(Boolean).forEach((pill) => {
        gsap.to(pill, {
          width: window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 85 : 120,
          ease: "none",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 90%",
            end: "top 35%",
            scrub: 2,
          },
        });
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        endTrigger: formSectionRef.current,
        end: "top top",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: formSectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 2.5,
          invalidateOnRefresh: true,
        },
      }).to(foldRef.current, {
        scale: 0.9,
        rotationX: 28,
        z: -700,
        opacity: 0.08,
        transformOrigin: "center top",
        ease: "power1.inOut",
      });

      gsap.from(formSectionRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formSectionRef.current,
          start: "top 88%",
          once: true,
        },
      });

      if (infoRef.current) {
        gsap.from(Array.from(infoRef.current.children), {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 86%",
            once: true,
          },
        });
      }

    });
    return () => ctx.revert();
  }, []);

  const marqueeItems = Array(5).fill("let's collaborate");

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-secondary"
      style={{ overflow: "hidden", isolation: "isolate", zIndex: 1 }}
    >

      {/* ══ HERO PANEL — pinned, folds back on scroll ══ */}
      <div
        ref={heroRef}
        className="relative w-full h-screen"
        style={{ perspective: "1100px", overflow: "hidden" }}
      >
        {/* UnicornStudio animated background */}
        <div className="absolute inset-0 z-0">
          <ContactScene />
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.78) 100%)" }} />

        {/* Grid */}
        <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,136,1) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(0,255,136,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* 3D-foldable card content */}
        <div
          ref={foldRef}
          className="relative z-10 flex flex-col items-center justify-center h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Section label */}
          <div className="absolute top-8 left-8 sm:top-10 sm:left-10 flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: "#00d4ff" }} />
            <span className="font-mono uppercase tracking-[0.4em]"
              style={{ fontSize: 10, color: "rgba(0,212,255,0.6)" }}>
              05 · Contact
            </span>
          </div>

          {/* Corner markers */}
          {[
            { top: 32, left: 32,    borderTop: "1px solid rgba(255,255,255,0.12)", borderLeft: "1px solid rgba(255,255,255,0.12)" },
            { top: 32, right: 32,   borderTop: "1px solid rgba(255,255,255,0.12)", borderRight: "1px solid rgba(255,255,255,0.12)" },
            { bottom: 32, left: 32, borderBottom: "1px solid rgba(255,255,255,0.12)", borderLeft: "1px solid rgba(255,255,255,0.12)" },
            { bottom: 32, right: 32,borderBottom: "1px solid rgba(255,255,255,0.12)", borderRight: "1px solid rgba(255,255,255,0.12)" },
          ].map((s, i) => (
            <div key={i} className="absolute w-7 h-7" style={s} />
          ))}

          {/* Giant headline */}
          <div className="text-center px-6 select-none">
            <div className="overflow-hidden mb-1">
              <h2 ref={line1Ref} className="font-display font-bold uppercase"
                style={{ fontSize: "clamp(4.5rem,15vw,13rem)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "#e5e5e5" }}>
                LET'S
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 ref={line2Ref} className="font-display font-bold uppercase"
                style={{
                  fontSize: "clamp(4.5rem,15vw,13rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
                  color: "transparent", WebkitTextStroke: "1.5px #00d4ff",
                  textShadow: "0 0 100px rgba(0,212,255,0.15)",
                }}>
                TALK.
              </h2>
            </div>

            {/* Tagline with image pills */}
            <div ref={taglineRef}
              className="flex flex-wrap items-center justify-center gap-3 mt-8 sm:mt-10"
              style={{ maxWidth: 660, margin: "2rem auto 0" }}>
              <span className="font-mono uppercase tracking-[0.2em] text-white/40"
                style={{ fontSize: "clamp(0.65rem,1.3vw,0.85rem)" }}>Let's build</span>

              <span ref={pillRef1} className="hidden sm:inline-block overflow-hidden flex-shrink-0"
                style={{ width: 0, height: "clamp(1.6rem,3vw,2.8rem)", borderRadius: 4, verticalAlign: "middle" }}>
                <img src="/assets/projects/codexspace.jpg" alt=""
                  className="h-full object-cover"
                  style={{ width: 200, position: "relative", left: "50%", transform: "translateX(-50%)" }} />
              </span>

              <span className="font-mono uppercase tracking-[0.2em] text-white/40"
                style={{ fontSize: "clamp(0.65rem,1.3vw,0.85rem)" }}>something</span>

              <span ref={pillRef2} className="hidden sm:inline-block overflow-hidden flex-shrink-0"
                style={{ width: 0, height: "clamp(1.6rem,3vw,2.8rem)", borderRadius: 4, verticalAlign: "middle" }}>
                <img src="/assets/projects/hyperspace.jpg" alt=""
                  className="h-full object-cover"
                  style={{ width: 200, position: "relative", left: "50%", transform: "translateX(-50%)" }} />
              </span>

              <span className="font-mono uppercase tracking-[0.2em]"
                style={{ fontSize: "clamp(0.65rem,1.3vw,0.85rem)", color: "#00d4ff" }}>extraordinary.</span>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35">
            <div className="w-px h-12 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)",
                  animation: "scrollBar 1.8s ease-in-out infinite",
                }} />
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25">Scroll</span>
          </div>
        </div>
      </div>

      {/* ══ FORM SECTION — slides up beneath the fold ══ */}
      <div
        ref={formSectionRef}
        className="relative bg-secondary z-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.025) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(0,255,136,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        {/* Ambient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right,rgba(0,212,255,0.055) 0%,transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left,rgba(0,255,136,0.05) 0%,transparent 65%)" }} />

        <div className="relative z-10 px-6 sm:px-10 md:px-14 pt-20 sm:pt-24 md:pt-28 pb-0 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">

            {/* ── LEFT: Info block ── */}
            <div ref={infoRef} className="flex flex-col gap-8 pb-4">

              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ background: "#00d4ff" }} />
                <span className="font-mono uppercase tracking-[0.38em]"
                  style={{ fontSize: 10, color: "rgba(0,212,255,0.5)" }}>Start a conversation</span>
              </div>

              <h3 className="font-display font-bold uppercase leading-[0.9]"
                style={{ fontSize: "clamp(2rem,5vw,4.5rem)", letterSpacing: "-0.02em", color: "#e5e5e5" }}>
                Got a<br />
                <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(0,255,136,0.65)" }}>
                  Project?
                </span>
              </h3>

              <p className="font-mono leading-[1.85] max-w-xs"
                style={{ fontSize: 13, color: "rgba(229,229,229,0.38)", letterSpacing: "0.04em" }}>
                I'm always open to discussing new opportunities and building
                something extraordinary together. Let's make it happen.
              </p>

              <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Email */}
              <div>
                <p className="font-mono uppercase tracking-[0.3em] mb-2"
                  style={{ fontSize: 10, color: "rgba(0,255,136,0.5)" }}>Email</p>
                <a href="mailto:rajanshu2123@gmail.com" className="font-mono transition-colors duration-300"
                  style={{ fontSize: "clamp(0.85rem,1.4vw,0.98rem)", color: "rgba(229,229,229,0.5)", letterSpacing: "0.04em", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00ff88")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(229,229,229,0.5)")}>
                  rajanshu2123@gmail.com
                </a>
              </div>

              {/* Location */}
              <div>
                <p className="font-mono uppercase tracking-[0.3em] mb-2"
                  style={{ fontSize: 10, color: "rgba(0,212,255,0.5)" }}>Location</p>
                <p className="font-mono"
                  style={{ fontSize: "clamp(0.85rem,1.4vw,0.98rem)", color: "rgba(229,229,229,0.5)", letterSpacing: "0.04em" }}>
                  Bokaro Steel City, Jharkhand, India
                </p>
              </div>

              {/* Socials */}
              <div>
                <p className="font-mono uppercase tracking-[0.3em] mb-3"
                  style={{ fontSize: 10, color: "rgba(183,123,255,0.5)" }}>Connect</p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono uppercase"
                      style={{
                        fontSize: 10, letterSpacing: "0.2em", padding: "7px 14px",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2,
                        color: "rgba(229,229,229,0.42)", textDecoration: "none", transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#e5e5e5"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(229,229,229,0.42)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                      {s.name}
                      <Icon icon="lucide:arrow-up-right" style={{ width: 10 }} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Resume */}
              <Magnetic strength={0.1}>
                <a href="/resume/anshu-raj-resume.pdf" download
                  className="group inline-flex items-center gap-3 font-mono uppercase"
                  style={{
                    fontSize: 11, letterSpacing: "0.2em", padding: "12px 22px",
                    border: "1px solid rgba(0,255,136,0.28)", borderRadius: 2,
                    color: "#00ff88", textDecoration: "none",
                    background: "rgba(0,255,136,0.04)", transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,136,0.09)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.55)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,136,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,255,136,0.04)"; e.currentTarget.style.borderColor = "rgba(0,255,136,0.28)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <Icon icon="lucide:file-text" style={{ width: 13 }} />
                  Download Resume
                  <Icon icon="lucide:download" className="group-hover:translate-y-0.5 transition-transform duration-300" style={{ width: 12 }} />
                </a>
              </Magnetic>
            </div>

            {/* ── RIGHT: Form ── */}
            <div>
              <form ref={formElem} onSubmit={handleSubmit} className="flex flex-col gap-9">

                <div className="pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="font-mono uppercase tracking-[0.38em]"
                    style={{ fontSize: 10, color: "rgba(229,229,229,0.22)" }}>Send a message</p>
                </div>

                <Magnetic strength={0.05}>
                  <Field id="name" name="name" label="Your Name"
                    value={fd.name} onChange={handleChange} onBlur={handleBlur}
                    error={fe.name} touched={ft.name} accent="#00ff88" />
                </Magnetic>

                <Magnetic strength={0.05}>
                  <Field id="email" name="email" label="Email Address" type="email"
                    value={fd.email} onChange={handleChange} onBlur={handleBlur}
                    error={fe.email} touched={ft.email} accent="#00d4ff" />
                </Magnetic>

                <Magnetic strength={0.03}>
                  <Field id="message" name="message" label="Your Message"
                    value={fd.message} onChange={handleChange} onBlur={handleBlur}
                    error={fe.message} touched={ft.message}
                    accent="#b77bff" multiline rows={5} maxLength={500} />
                </Magnetic>

                <div className="pt-2">
                  <Magnetic strength={0.18}>
                    <button type="submit" disabled={sending || status === "ok"}
                      className="group relative w-full overflow-hidden font-display font-bold uppercase"
                      style={{
                        padding: "18px 0", border: "none", borderRadius: 2,
                        letterSpacing: "0.22em", fontSize: "clamp(0.82rem,1.4vw,0.95rem)",
                        outline: `1.5px solid ${status === "err" ? "rgba(239,68,68,0.4)" : "rgba(0,255,136,0.3)"}`,
                        background: status === "err" ? "rgba(239,68,68,0.08)" : "rgba(0,255,136,0.05)",
                        color: status === "err" ? "#ef4444" : status === "ok" ? "#00ff88" : "#e5e5e5",
                        cursor: sending ? "wait" : "pointer", transition: "all 0.35s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (status) return;
                        e.currentTarget.style.background = "rgba(0,255,136,0.11)";
                        e.currentTarget.style.outlineColor = "rgba(0,255,136,0.62)";
                        e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,136,0.1),inset 0 0 30px rgba(0,255,136,0.04)";
                        e.currentTarget.style.color = "#00ff88";
                      }}
                      onMouseLeave={(e) => {
                        if (status) return;
                        e.currentTarget.style.background = "rgba(0,255,136,0.05)";
                        e.currentTarget.style.outlineColor = "rgba(0,255,136,0.3)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.color = "#e5e5e5";
                      }}>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {sending ? (
                          <><Icon icon="lucide:loader-2" className="animate-spin" style={{ width: 15 }} />Sending</>
                        ) : status === "ok" ? (
                          <><Icon icon="lucide:check" style={{ width: 15 }} />Message Sent!</>
                        ) : status === "err" ? (
                          <><Icon icon="lucide:x" style={{ width: 15 }} />Failed — Try Again</>
                        ) : (
                          <>Send Message
                            <Icon icon="lucide:send"
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                              style={{ width: 14 }} />
                          </>
                        )}
                      </span>
                    </button>
                  </Magnetic>
                  <p className="mt-4 font-mono text-center"
                    style={{ fontSize: 10, color: "rgba(229,229,229,0.17)", letterSpacing: "0.12em" }}>
                    I reply within 24 hours · No spam, ever
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-20">
          <Marquee items={marqueeItems}
            className="text-text bg-transparent border-y-2 border-accent/20"
            icon="material-symbols:code" iconClassName="text-accent" />
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 sm:px-10 md:px-14 py-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 max-w-[1400px] mx-auto">
            <p className="font-mono" style={{ fontSize: 11, color: "rgba(229,229,229,0.2)", letterSpacing: "0.08em" }}>
              © 2025 Anshu Raj
            </p>
            <p className="font-mono" style={{ fontSize: 11, color: "rgba(229,229,229,0.2)", letterSpacing: "0.08em" }}>
              Built with React · Three.js · GSAP · Tailwind
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollBar { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }
        textarea::-webkit-scrollbar { display: none; }
        textarea { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </section>
  );
};

export default Contact;

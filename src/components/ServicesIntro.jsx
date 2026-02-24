/**
 * ServicesIntro.jsx — v2 (DiMACC-inspired entrance)
 * Entrance: Loading text spreads apart → small rotated video expands full screen
 * Exit: Circle clip-path closes on scroll
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServicesIntro = () => {
  const sectionRef      = useRef(null);
  const loadingRef      = useRef(null);
  const wordWhatRef     = useRef(null);
  const wordIRef        = useRef(null);
  const wordDoRef       = useRef(null);
  const videoBoxRef     = useRef(null);
  const videoInnerRef   = useRef(null);
  const gradientRef     = useRef(null);
  const overlayRef      = useRef(null);
  const titleLineARef   = useRef(null);
  const titleLineBRef   = useRef(null);
  const rulerRef        = useRef(null);
  const subtitleRef     = useRef(null);
  const tagRowRef       = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      /* ── Initial states ─────────────────────────────── */
      gsap.set(loadingRef.current,  { opacity: 0 });
      gsap.set(videoBoxRef.current, { rotation: 8, scale: 0 });
      gsap.set(videoInnerRef.current, { scale: 1.6 });
      gsap.set(gradientRef.current, { opacity: 0 });
      gsap.set(overlayRef.current,  { opacity: 0 });
      gsap.set([titleLineARef.current, titleLineBRef.current], { yPercent: 110, opacity: 0 });
      gsap.set(rulerRef.current,    { scaleX: 0, transformOrigin: "left center" });
      gsap.set(subtitleRef.current, { y: 18, opacity: 0 });
      gsap.set(tagRowRef.current,   { opacity: 0 });

      /* ── Entrance timeline (auto-plays) ─────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.2 });

      tl
        // Loading text appears
        .to(loadingRef.current, { opacity: 1, duration: 0.55 })

        // Words spread outward as video prepares
        .to(wordWhatRef.current, { x: "-22vw", duration: 0.75, ease: "power3.inOut" }, "spread")
        .to(wordIRef.current,    { y: "8vh",   duration: 0.75, ease: "power3.inOut" }, "spread")
        .to(wordDoRef.current,   { x: "22vw",  duration: 0.75, ease: "power3.inOut" }, "spread")

        // Video box appears small + rotated in the gap
        .to(videoBoxRef.current, {
          rotation: 0, scale: 1, duration: 0.65, ease: "back.out(1.2)"
        }, "spread+=0.3")

        // Video box expands to full screen
        .to(videoBoxRef.current, {
          width: "100vw", height: "100vh",
          borderRadius: 0,
          duration: 1.3, ease: "power2.inOut"
        }, "expand")
        .to(videoInnerRef.current, { scale: 1, duration: 1.3, ease: "power2.inOut" }, "expand")

        // Gradient overlay fades in over video
        .to(gradientRef.current, { opacity: 1, duration: 0.6 }, "expand+=0.5")

        // Loading text fades as video covers it
        .to(loadingRef.current, { opacity: 0, duration: 0.4 }, "expand+=0.4")

        // Overlay content appears
        .to(overlayRef.current, { opacity: 1, duration: 0 }, "expand+=1.05")
        .to([titleLineARef.current, titleLineBRef.current], {
          yPercent: 0, opacity: 1,
          stagger: 0.12, duration: 0.7, ease: "power3.out"
        }, "expand+=1.05")
        .to(rulerRef.current, { scaleX: 1, duration: 0.55 }, "expand+=1.5")
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.5 }, "expand+=1.6")
        .to(tagRowRef.current, { opacity: 1, duration: 0.5 }, "expand+=1.75");

      /* ── Scroll exit — circle closes ────────────────── */
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      }).to(videoBoxRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1,
        ease: "power2.inOut",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-secondary flex items-center justify-center"
    >
      {/* ── Ambient orbs (always visible) ── */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-blue/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-4 pointer-events-none">
        <div className="grid-bg w-full h-full" />
      </div>

      {/* ── Loading text — behind video, spreads apart ── */}
      <div
        ref={loadingRef}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none"
      >
        <div className="flex items-baseline gap-4 sm:gap-6 md:gap-8">
          <span
            ref={wordWhatRef}
            className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white/80 tracking-tight"
          >
            WHAT
          </span>
          <span
            ref={wordIRef}
            className="font-display font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-accent"
            style={{ textShadow: "0 0 40px rgba(0,255,136,0.5)" }}
          >
            I
          </span>
          <span
            ref={wordDoRef}
            className="font-display font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight"
          >
            DO
          </span>
        </div>
      </div>

      {/* ── Video box — starts tiny/rotated, expands ── */}
      <div
        ref={videoBoxRef}
        className="absolute z-20 overflow-hidden"
        style={{
          width: "clamp(80px, 10vw, 140px)",
          height: "clamp(120px, 15vw, 200px)",
          borderRadius: "1rem",
          clipPath: "circle(100% at 50% 50%)",
          willChange: "transform, width, height",
        }}
      >
        <video
          ref={videoInnerRef}
          autoPlay loop muted playsInline preload="auto"
          className="w-full h-full object-cover"
          style={{ willChange: "transform" }}
        >
          <source src="/assets/services-code-flow.mp4" type="video/mp4" />
          {/* Fallback gradient if video missing */}
        </video>

        {/* Brightness reduction */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Gradient overlay (fades in after expansion) */}
        <div
          ref={gradientRef}
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)"
          }}
        />

        {/* ── Overlay content — appears after expansion ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10"
        >
          {/* Title */}
          <div className="text-center mb-5 sm:mb-7">
            <div className="overflow-hidden mb-1">
              <h1
                ref={titleLineARef}
                className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white/90 leading-none tracking-tight"
              >
                WHAT I
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1
                ref={titleLineBRef}
                className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight"
                style={{ color: "#00ff88", textShadow: "0 0 30px rgba(0,255,136,0.45)" }}
              >
                DO
              </h1>
            </div>
          </div>

          {/* Ruler */}
          <div
            ref={rulerRef}
            className="mb-5 sm:mb-6"
            style={{
              width: "clamp(4rem, 8vw, 8rem)",
              height: "1px",
              background: "linear-gradient(to right, transparent, #00ff88, transparent)"
            }}
          />

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/50 mb-6 sm:mb-8"
          >
            Expertise & Capabilities
          </p>

          {/* Service tags row */}
          <div ref={tagRowRef} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-lg">
            {["Full-Stack", "Animation & 3D", "AI Integration", "Performance"].map((tag, i) => (
              <span
                key={tag}
                className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase px-3 py-1 border rounded-full"
                style={{
                  borderColor: ["#00ff88","#00d4ff","#b77bff","#ffcc44"][i] + "55",
                  color:        ["#00ff88","#00d4ff","#b77bff","#ffcc44"][i] + "cc",
                  background:   ["#00ff88","#00d4ff","#b77bff","#ffcc44"][i] + "10",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_0.5s_ease_4.5s_forwards]">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-8 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)",
              animation: "scrollBar 1.8s ease-in-out infinite"
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes scrollBar {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
};

export default ServicesIntro;

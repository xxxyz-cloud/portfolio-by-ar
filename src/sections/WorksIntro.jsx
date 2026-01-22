import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const WorksIntro = () => {
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const infoRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 1.8,
        anticipatePin: 1,
      },
    });

    tl
      // Video container reveal
      .from(videoContainerRef.current, {
        scale: 1.3,
        borderRadius: "0px",
        ease: "power1.inOut",
      }, 0)
      
      // Title reveal
      .from(titleRef.current.children, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.05,
        ease: "power2.out",
      }, 0.3)
      
      // Line expansion
      .from(lineRef.current, {
        scaleX: 0,
        ease: "power2.inOut",
      }, 0.5)
      
      // Info fade in
      .from(infoRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "power2.out",
      }, 0.6);
  }, []);

  return (
    <section
      ref={containerRef}
      className="works-intro w-full h-screen relative overflow-hidden bg-primary flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Centered Video Container - Fully Responsive */}
      <div
        ref={videoContainerRef}
        className="relative w-full sm:w-[95vw] md:w-[92vw] lg:w-[90vw] h-[80vh] sm:h-[82vh] md:h-[84vh] lg:h-[85vh] rounded-2xl sm:rounded-3xl overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[0.5]"
        >
          <source src="/assets/projects-montage.mp4" type="video/mp4" />
        </video>
        
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Content overlay - Fully Responsive */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16">
          {/* Main title - Responsive Typography */}
          <div ref={titleRef} className="text-center mb-6 sm:mb-7 md:mb-8">
            <div className="overflow-hidden">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white tracking-tight leading-none">
                TOP
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-none">
                <span className="text-accent">WORKS</span>
              </h1>
            </div>
          </div>

          {/* Decorative line - Responsive Width */}
          <div
            ref={lineRef}
            className="w-24 sm:w-28 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent mb-6 sm:mb-7 md:mb-8"
          />

          {/* Info grid - Responsive Layout */}
          <div ref={infoRef} className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-24">
            <div className="text-center">
              <p className="font-mono text-[10px] sm:text-xs tracking-widest text-text-dim/60 uppercase mb-1.5 sm:mb-2">
                Projects
              </p>
              <p className="font-display text-xl sm:text-2xl md:text-3xl text-white font-light">
                20+
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] sm:text-xs tracking-widest text-text-dim/60 uppercase mb-1.5 sm:mb-2">
                Year
              </p>
              <p className="font-display text-xl sm:text-2xl md:text-3xl text-white font-light">
                2025-2026
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] sm:text-xs tracking-widest text-text-dim/60 uppercase mb-1.5 sm:mb-2">
                Stack
              </p>
              <p className="font-display text-xl sm:text-2xl md:text-3xl text-accent font-light">
                MERN/Next.Js
              </p>
            </div>
          </div>
        </div>

        {/* Corner markers - Responsive Sizes */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-white/10" />
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-white/10" />
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-white/10" />
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-white/10" />
      </div>

      {/* Scroll progress indicator - Responsive */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-transparent via-accent to-transparent" />
        <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-text-dim">SCROLL</span>
      </div>
    </section>
  );
};

export default WorksIntro;

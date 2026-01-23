import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServicesIntro = () => {
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Initial state - video fills screen
      gsap.set(videoContainerRef.current, {
        clipPath: "circle(100% at 50% 50%)",
      });

      // Fade in title early
      tl.from(titleRef.current.children, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      }, 0)
      
      // Fade in subtitle
      .from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.out",
      }, 0.2)
      
      // Line expansion
      .from(lineRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: "power2.inOut",
      }, 0.3)
      
      // Video shrinks smoothly to reveal content below
      .to(videoContainerRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1,
        ease: "power2.inOut",
      }, 0.6);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="services-intro relative w-full h-screen overflow-hidden bg-secondary flex items-center justify-center"
    >
      {/* Video layer - shrinks to reveal content */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 z-10 w-full h-full will-change-transform"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover brightness-[0.4]"
        >
          <source src="/assets/services-code-flow.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* Content overlay - visible while video is showing */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
          {/* Main title */}
          <div ref={titleRef} className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="overflow-hidden">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white tracking-tight leading-none">
                WHAT I
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none">
                <span className="text-accent neon-text">DO</span>
              </h1>
            </div>
          </div>

          {/* Decorative line */}
          <div
            ref={lineRef}
            className="w-20 sm:w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent mb-4 sm:mb-6"
          />

          {/* Subtitle */}
          <div ref={subtitleRef} className="text-center max-w-2xl px-4">
            <p className="font-mono text-xs sm:text-sm md:text-base tracking-widest text-text-dim uppercase">
              Expertise & Capabilities
            </p>
          </div>
        </div>
      </div>

      {/* Background pattern - visible as video shrinks */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-bg w-full h-full" />
      </div>

      {/* Ambient glows */}
      <div className="absolute top-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-accent-blue/10 rounded-full blur-3xl" />
    </section>
  );
};

export default ServicesIntro;
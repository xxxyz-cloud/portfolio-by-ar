import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  useGSAP(() => {
    // Use scrollTrigger with trigger (not target) — fixes the undefined prop warning too
    gsap.to("#title-service-1", {
      xPercent: 15,
      scrollTrigger: { trigger: "#title-service-1", scrub: true },
    });
    gsap.to("#title-service-2", {
      xPercent: -20,
      scrollTrigger: { trigger: "#title-service-2", scrub: true },
    });
    gsap.to("#title-service-3", {
      xPercent: 18,
      scrollTrigger: { trigger: "#title-service-3", scrub: true },
    });
    gsap.to("#title-service-4", {
      xPercent: -18,
      scrollTrigger: { trigger: "#title-service-4", scrub: true },
    });
  });

  return (
    <section className="relative mt-10 sm:mt-16 md:mt-20 overflow-hidden font-light leading-tight text-center mb-16 sm:mb-24 md:mb-32">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid-bg w-full h-full" />
      </div>

      <div className="relative z-10 px-2 sm:px-4">
        {/* Line 1: Full-Stack */}
        <div id="title-service-1" className="overflow-hidden">
          <p className="font-display font-bold text-[clamp(2.4rem,9vw,9rem)] leading-none">
            <span className="text-accent">Full-Stack</span>
          </p>
        </div>

        {/* Line 2: Real-Time Apps + 3D Graphics */}
        <div
          id="title-service-2"
          className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 overflow-hidden"
          /* Small safe offset that won't overflow on mobile */
          style={{ transform: "translateX(clamp(0px, 4vw, 60px))" }}
        >
          <p className="font-display font-normal text-[clamp(1.6rem,6vw,6.5rem)] leading-none whitespace-nowrap">
            Real-Time Apps
          </p>
          <div className="hidden sm:block w-8 md:w-16 lg:w-24 h-0.5 bg-accent-blue flex-shrink-0" />
          <p className="font-display text-[clamp(1.6rem,6vw,6.5rem)] leading-none whitespace-nowrap">
            <span className="text-accent-blue">3D Graphics</span>
          </p>
        </div>

        {/* Line 3: APIs + Animation + AI Integration */}
        <div
          id="title-service-3"
          className="flex items-center justify-center gap-2 sm:gap-3 md:gap-5 overflow-hidden flex-wrap"
          style={{ transform: "translateX(clamp(-40px, -4vw, 0px))" }}
        >
          <p className="font-display text-[clamp(1.5rem,5.5vw,6rem)] leading-none">
            APIs
          </p>
          <div className="hidden sm:block w-6 md:w-12 lg:w-20 h-0.5 bg-accent flex-shrink-0" />
          <p className="italic font-display text-[clamp(1.5rem,5.5vw,6rem)] leading-none">
            <span className="text-accent">Animation</span>
          </p>
          <div className="hidden sm:block w-6 md:w-12 lg:w-20 h-0.5 bg-accent-purple flex-shrink-0" />
          <p className="font-display text-[clamp(1.5rem,5.5vw,6rem)] leading-none whitespace-nowrap">
            AI Integration
          </p>
        </div>

        {/* Line 4: Performance */}
        <div
          id="title-service-4"
          className="overflow-hidden"
          style={{ transform: "translateX(clamp(0px, 4vw, 60px))" }}
        >
          <p className="font-display font-bold text-[clamp(2.4rem,9vw,9rem)] leading-none">
            <span className="text-accent-purple">Performance</span>
          </p>
        </div>

        {/* Divider */}
        <div className="relative mt-8 sm:mt-10 md:mt-12">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />
        </div>

        {/* Tagline */}
        <div className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-xl font-mono text-text-dim px-4">
          <p>
            {"{"} Building digital experiences that{" "}
            <span className="text-accent">captivate</span>{" "}
            {"}"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceSummary;

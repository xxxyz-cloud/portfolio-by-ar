import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  useGSAP(() => {
    gsap.to("#title-service-1", {
      xPercent: 20,
      scrollTrigger: {
        target: "#title-service-1",
        scrub: true,
      },
    });
    gsap.to("#title-service-2", {
      xPercent: -30,
      scrollTrigger: {
        target: "#title-service-2",
        scrub: true,
      },
    });
    gsap.to("#title-service-3", {
      xPercent: 100,
      scrollTrigger: {
        target: "#title-service-3",
        scrub: true,
      },
    });
    gsap.to("#title-service-4", {
      xPercent: -100,
      scrollTrigger: {
        target: "#title-service-4",
        scrub: true,
      },
    });
  });

  return (
    <section className="relative mt-10 sm:mt-16 md:mt-20 overflow-hidden font-light leading-tight text-center mb-20 sm:mb-32 md:mb-42">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid-bg w-full h-full" />
      </div>

      <div className="relative z-10 px-4">
        <div id="title-service-1">
          <p className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl">
            <span className="text-accent">Full-Stack</span>
          </p>
        </div>
        
        <div
          id="title-service-2"
          className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6 translate-x-8 sm:translate-x-16"
        >
          <p className="font-normal font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">Real-Time Apps</p>
          <div className="w-6 sm:w-10 md:w-16 lg:w-32 h-0.5 sm:h-1 bg-accent-blue" />
          <p className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-accent-blue">3D Graphics</span>
          </p>
        </div>
        
        <div
          id="title-service-3"
          className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6 -translate-x-24 sm:-translate-x-32 md:-translate-x-48 flex-wrap"
        >
          <p className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">APIs</p>
          <div className="w-6 sm:w-10 md:w-16 lg:w-32 h-0.5 sm:h-1 bg-accent" />
          <p className="italic font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-accent">Animation</span>
          </p>
          <div className="w-6 sm:w-10 md:w-16 lg:w-32 h-0.5 sm:h-1 bg-accent-purple" />
          <p className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">AI Integration</p>
        </div>
        
        <div id="title-service-4" className="translate-x-24 sm:translate-x-32 md:translate-x-48">
          <p className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl">
            <span className="text-accent-purple">Performance</span>
          </p>
        </div>

        <div className="relative mt-8 sm:mt-10 md:mt-12">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <div className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-2xl font-mono text-text-dim px-4">
          <p>
            {"{"} Building digital experiences that <span className="text-accent">captivate</span> {"}"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceSummary;
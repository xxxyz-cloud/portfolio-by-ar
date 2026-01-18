import { useRef } from "react";
import Marquee from "../components/Marquee";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ContactSummary = () => {
  const containerRef = useRef(null);
  
  const items = [
    "Innovation",
    "Creativity",
    "Performance",
    "Precision",
    "Excellence",
  ];
  
  const items2 = [
    "let's collaborate",
    "let's collaborate",
    "let's collaborate",
    "let's collaborate",
    "let's collaborate",
  ];

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-screen gap-12 overflow-hidden bg-primary"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid-bg w-full h-full" />
      </div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 w-full">
        <Marquee 
          items={items} 
          className="text-text bg-transparent border-y-2 border-accent/30"
          icon="lucide:sparkles"
          iconClassName="text-accent"
        />
        
        <div className="overflow-hidden font-light text-center contact-text-responsive px-10 py-16">
          <p className="font-display">
            " Let's build a <br />
            <span className="font-bold text-accent neon-text">memorable</span> &{" "}
            <span className="italic text-accent-blue">inspiring</span> <br />
            web experience <span className="font-bold text-accent-purple">together</span> "
          </p>
        </div>
        
        <Marquee
          items={items2}
          reverse={true}
          className="text-text bg-transparent border-y-2 border-accent-blue/30"
          iconClassName="text-accent-blue"
          icon="material-symbols:code"
        />
      </div>
    </section>
  );
};

export default ContactSummary;
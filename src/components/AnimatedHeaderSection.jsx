import React from "react";
import { useRef } from "react";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeaderSection = ({
  subTitle,
  title,
  text,
  textColor,
  withScrollTrigger = false,
}) => {
  const contextRef = useRef(null);
  const headerRef = useRef(null);
  const subtitleRef = useRef(null);
  
  const shouldSplitTitle = title.includes(" ");
  const titleParts = shouldSplitTitle ? title.split(" ") : [title];
  
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: withScrollTrigger
          ? {
              trigger: contextRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            }
          : undefined,
      });
      
      tl.from(contextRef.current, {
        y: "50vh",
        duration: 1,
        ease: "circ.out",
      });
      
      tl.from(
        subtitleRef.current,
        {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: "power2.out",
        },
        "<+0.2"
      );
      
      tl.from(
        headerRef.current,
        {
          opacity: 0,
          y: 200,
          duration: 1,
          ease: "circ.out",
        },
        "<+0.2"
      );
    }, contextRef);

    return () => ctx.revert(); // Cleanup
  }, [withScrollTrigger]);
  
  return (
    <div ref={contextRef}>
      <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <div
          ref={headerRef}
          className="flex flex-col justify-center gap-12 pt-16 sm:gap-16"
        >
          {/* Subtitle with accent line */}
          <div className="px-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-accent" />
              <p
                ref={subtitleRef}
                className={`text-xs md:text-sm font-mono tracking-[0.3rem] uppercase ${textColor} text-accent`}
              >
                {subTitle}
              </p>
              <div className="flex-1 h-px bg-gradient-to-r from-accent to-transparent" />
            </div>
          </div>
          
          {/* Main Title */}
          <div className="px-10">
            <h1
              className={`flex flex-col gap-12 uppercase banner-text-responsive sm:gap-16 md:block ${textColor} font-display font-bold`}
            >
              {titleParts.map((part, index) => (
                <span 
                  key={index}
                  className="relative inline-block group"
                >
                  <span className="relative z-10">{part} </span>
                  <span className="absolute bottom-0 left-0 w-0 h-2 md:h-4 bg-accent/30 group-hover:w-full transition-all duration-500 -z-10" />
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Description Text */}
      <div className={`relative px-10 ${textColor}`}>
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="py-12 sm:py-16 text-end">
          <AnimatedTextLines
            text={text}
            className={`font-light uppercase value-text-responsive ${textColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeaderSection;
import { useRef, useState, useEffect } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import ServicesIntro from "../components/ServicesIntro";
import { servicesData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";

gsap.registerPlugin(ScrollTrigger);

const serviceIcons = [
  "lucide:code-2",
  "lucide:sparkles",
  "lucide:brain",
  "lucide:zap",
];

const serviceImages = [
  "/assets/services/fullstack.jpg",
  "/assets/services/animation.jpg",
  "/assets/services/ai.jpg",
  "/assets/services/performance.jpg",
];

const Services = () => {
  const text = `Specialized in building secure, high-performance applications
    From real-time collaboration to 3D web experiences
    Merging technical precision with creative vision`;
    
  const firstServiceRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const imageRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isDesktop = useMediaQuery({ minWidth: "48rem" });

  const handleMouseEnter = (index) => {
    if (!isDesktop) return;
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Horizontal scroll setup
  useGSAP(() => {
    if (!horizontalSectionRef.current || !horizontalContainerRef.current) return;
    
    // Only apply GSAP horizontal scroll on desktop
    if (!isDesktop) return;

    const horizontalServices = servicesData.slice(1); // Services 2, 3, 4
    const cards = horizontalContainerRef.current.querySelectorAll('.horizontal-service-card');
    
    if (cards.length === 0) return;

    // Calculate total scroll width
    const totalWidth = cards.length * window.innerWidth * 0.85;
    const scrollDistance = totalWidth - window.innerWidth;

    // Horizontal scroll animation - Desktop only
    const horizontalScroll = gsap.to(horizontalContainerRef.current, {
      x: () => -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: horizontalSectionRef.current,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    // Parallax effects for cards - Desktop only
    cards.forEach((card, index) => {
      const image = card.querySelector('.service-card-image');
      
      if (image) {
        gsap.to(image, {
          x: () => index * 50,
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 2,
          },
        });
      }

      // Stagger fade in for cards
      gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: horizontalSectionRef.current,
          start: "top center",
          end: "top top",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === horizontalSectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, [isDesktop]);

  // First service animation
  useGSAP(() => {
    if (!firstServiceRef.current) return;

    gsap.from(firstServiceRef.current, {
      y: 200,
      opacity: 0,
      scrollTrigger: {
        trigger: firstServiceRef.current,
        start: "top 80%",
      },
      duration: 1,
      ease: "circ.out",
    });

    const handleMouseEnterFirst = () => {
      gsap.to(firstServiceRef.current, {
        scale: 1.01,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeaveFirst = () => {
      gsap.to(firstServiceRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    firstServiceRef.current.addEventListener("mouseenter", handleMouseEnterFirst);
    firstServiceRef.current.addEventListener("mouseleave", handleMouseLeaveFirst);

    return () => {
      if (firstServiceRef.current) {
        firstServiceRef.current.removeEventListener("mouseenter", handleMouseEnterFirst);
        firstServiceRef.current.removeEventListener("mouseleave", handleMouseLeaveFirst);
      }
    };
  }, []);

  const firstService = servicesData[0];
  const horizontalServices = servicesData.slice(1);

  return (
    <>
      {/* Video Intro Section */}
      <ServicesIntro />
      
      {/* Main Services Content */}
      <section id="services" className="min-h-screen bg-secondary rounded-t-4xl relative overflow-hidden">
        {/* Refined SVG Filters */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="subtle-wave" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008"
                numOctaves="2"
                result="turbulence"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="20s"
                  values="0.008;0.012;0.008"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in2="turbulence"
                in="SourceGraphic"
                scale="8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <filter id="gentle-morph" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.01"
                numOctaves="1"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="15s"
                  values="0.01;0.015;0.01"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>
          </defs>
        </svg>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="grid-bg w-full h-full" />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-40 right-20 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-20 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <AnimatedHeaderSection
            subTitle={"Expertise & Capabilities"}
            title={"Services"}
            text={text}
            textColor={"text-text"}
            withScrollTrigger={true}
          />

          {/* First Service - Vertical Scroll */}
          <div
            ref={firstServiceRef}
            className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-10 sm:pb-12 text-text bg-secondary border-t-2 border-border/50 group hover:border-accent/50 transition-all duration-500"
          >
            <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl bg-primary/50 border border-border group-hover:border-accent transition-all duration-500 overflow-hidden">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 font-light">
                {/* Image Section */}
                <div className="w-full lg:w-[50%] relative flex-shrink-0">
                  <div 
                    ref={(el) => (imageRefs.current[0] = el)}
                    className="image-container relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border group-hover:border-accent transition-all duration-500"
                    onMouseEnter={() => handleMouseEnter(0)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="image-wrapper">
                      <img
                        src={serviceImages[0]}
                        alt={firstService.title}
                        className={`service-image w-full h-full object-cover transition-all duration-1000 ease-out ${
                          activeIndex === 0 ? 'image-active' : ''
                        }`}
                        loading="eager"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                    <div className="shimmer-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                      <div className="shimmer-beam" />
                    </div>

                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,255,136,0.15)]" />
                    </div>

                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 backdrop-blur-md rounded-full flex items-center justify-center border border-accent/30 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                      <Icon icon={serviceIcons[0]} className="text-accent text-lg sm:text-xl md:text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 min-w-0 lg:max-w-[55%]">
                  <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                    <div className="w-6 sm:w-8 md:w-12 h-px bg-accent" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-accent tracking-widest">
                      SERVICE 01
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold group-hover:text-accent transition-colors duration-500">
                    {firstService.title}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed text-text-dim">
                    {firstService.description}
                  </p>

                  <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                    {firstService.items.map((item, itemIndex) => (
                      <div 
                        key={`item-0-${itemIndex}`}
                        className="relative group/item"
                      >
                        <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg bg-primary/30 border border-border/50 group-hover/item:border-accent-blue transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10">
                          <span className="flex-shrink-0 text-[10px] sm:text-xs md:text-sm font-mono text-accent mt-0.5 sm:mt-1">
                            0{itemIndex + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-display mb-0.5 sm:mb-1 group-hover/item:text-accent-blue transition-colors duration-300">
                              {item.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-text-dim font-mono break-words">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {itemIndex < firstService.items.length - 1 && (
                          <div className="w-full h-px my-1.5 sm:my-2 bg-gradient-to-r from-transparent via-border to-transparent" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 border-b-2 border-r-2 border-accent-blue/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Horizontal Scroll Section - Services 2, 3, 4 */}
          <div 
            ref={horizontalSectionRef}
            className="horizontal-scroll-wrapper relative w-full overflow-hidden mt-8 sm:mt-12 md:mt-16"
          >
            {/* Scroll Progress Indicator - Hidden on mobile */}
            <div className="hidden md:flex fixed top-1/2 right-4 sm:right-6 md:right-8 lg:right-12 -translate-y-1/2 z-50 flex-col items-center gap-2 sm:gap-3 md:gap-4 opacity-60">
              <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                      scrollProgress >= i * 0.33 && scrollProgress < (i + 1) * 0.33
                        ? 'bg-accent scale-125'
                        : 'bg-text-dim/30'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-text-dim tracking-widest rotate-90 origin-center whitespace-nowrap">
                SCROLL
              </div>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="md:hidden text-center pb-4 px-4">
              <p className="text-xs font-mono text-text-dim/60 flex items-center justify-center gap-2">
                <Icon icon="lucide:chevrons-right" className="text-accent" />
                Swipe to explore more services
                <Icon icon="lucide:chevrons-right" className="text-accent" />
              </p>
            </div>

            {/* Horizontal Container */}
            <div 
              ref={horizontalContainerRef}
              className="horizontal-container flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 will-change-transform px-4 sm:px-6 md:px-10 md:overflow-visible overflow-x-auto snap-x snap-mandatory scrollbar-hide -webkit-overflow-scrolling-touch"
            >
              {horizontalServices.map((service, index) => {
                const actualIndex = index + 1; // Since this starts from service 2
                return (
                  <div
                    key={`horizontal-${actualIndex}`}
                    ref={(el) => (serviceCardsRef.current[index] = el)}
                    className={`horizontal-service-card flex-shrink-0 w-[90vw] sm:w-[85vw] md:w-[82vw] snap-start snap-always ${actualIndex === 3 ? 'lg:w-[92vw]' : 'lg:w-[80vw]'}`}
                  >
                    <div className={`relative p-4 sm:p-6 md:p-8 rounded-2xl bg-primary/50 border border-border hover:border-accent transition-all duration-500 overflow-hidden group h-full min-h-[600px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[700px] ${actualIndex === 3 ? 'lg:pl-0' : ''}`}>
                      {/* Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 lg:gap-12 font-light h-full">
                        {/* Image Section */}
                        <div className={`service-card-image w-full lg:w-[48%] relative flex-shrink-0 ${actualIndex === 3 ? 'lg:max-w-[500px]' : ''}`}>
                          <div 
                            className="image-container relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border group-hover:border-accent transition-all duration-500"
                            onMouseEnter={() => handleMouseEnter(actualIndex)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="image-wrapper">
                              <img
                                src={serviceImages[actualIndex]}
                                alt={service.title}
                                className={`service-image w-full h-full object-cover transition-all duration-1000 ease-out ${
                                  activeIndex === actualIndex ? 'image-active' : ''
                                }`}
                                loading="lazy"
                              />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                            <div className="shimmer-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                              <div className="shimmer-beam" />
                            </div>

                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                              <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,255,136,0.15)]" />
                            </div>

                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 backdrop-blur-md rounded-full flex items-center justify-center border border-accent/30 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                              <Icon icon={serviceIcons[actualIndex]} className="text-accent text-lg sm:text-xl md:text-2xl" />
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className={`service-card-content flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 min-w-0 lg:min-w-[45%] ${actualIndex === 3 ? 'lg:ml-auto lg:mr-8 lg:max-w-[600px]' : ''}`}>
                          <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                            <div className="w-6 sm:w-8 md:w-12 h-px bg-accent" />
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-accent tracking-widest">
                              SERVICE {String(actualIndex + 1).padStart(2, '0')}
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold group-hover:text-accent transition-colors duration-500">
                            {service.title}
                          </h2>

                          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed text-text-dim">
                            {service.description}
                          </p>

                          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                            {service.items.map((item, itemIndex) => (
                              <div 
                                key={`item-${actualIndex}-${itemIndex}`}
                                className="relative group/item"
                              >
                                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg bg-primary/30 border border-border/50 group-hover/item:border-accent-blue transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10">
                                  <span className="flex-shrink-0 text-[10px] sm:text-xs md:text-sm font-mono text-accent mt-0.5 sm:mt-1">
                                    0{itemIndex + 1}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-display mb-0.5 sm:mb-1 group-hover/item:text-accent-blue transition-colors duration-300">
                                      {item.title}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-text-dim font-mono break-words">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                                {itemIndex < service.items.length - 1 && (
                                  <div className="w-full h-px my-1.5 sm:my-2 bg-gradient-to-r from-transparent via-border to-transparent" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Corner Decorations */}
                      <div className="absolute top-0 left-0 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 border-b-2 border-r-2 border-accent-blue/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-4 sm:px-6 md:px-10 py-10 sm:py-12 md:py-16 text-center relative mt-10 sm:mt-12 md:mt-16">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid-bg w-full h-full" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 md:mb-6 text-accent px-4">
                Ready to bring your idea to life?
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-dim mb-5 sm:mb-6 md:mb-8 max-w-2xl mx-auto font-light px-4">
                Whether it's a real-time app, 3D experience, or AI integration—let's build something extraordinary together.
              </p>
              <a
                href="#contact"
                className="inline-block px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-accent text-primary font-display font-bold text-sm sm:text-base md:text-lg rounded-full hover:bg-accent-blue transition-all duration-300 shadow-lg hover:shadow-accent/50 hover:scale-105"
              >
                Let's Talk
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Clean Container Base */
          .image-container {
            position: relative;
            overflow: hidden;
            isolation: isolate;
          }

          .image-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
          }

          /* Refined Image Effects - Smooth & Subtle */
          .service-image {
            will-change: transform, filter;
            transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
                        filter 1s ease;
            transform-origin: center center;
          }

          /* Gentle Hover Scale */
          .image-container:hover .service-image {
            transform: scale(1.05);
          }

          /* Active State with Minimal Distortion */
          .service-image.image-active {
            filter: url(#subtle-wave);
          }

          /* Smooth Shimmer Beam */
          .shimmer-overlay {
            z-index: 1;
          }

          .shimmer-beam {
            position: absolute;
            top: -50%;
            left: -100%;
            width: 50%;
            height: 200%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 255, 136, 0.15) 50%,
              transparent 100%
            );
            transform: skewX(-20deg);
            animation: shimmer-sweep 3s ease-in-out infinite;
          }

          @keyframes shimmer-sweep {
            0% {
              left: -100%;
            }
            50%, 100% {
              left: 150%;
            }
          }

          /* Subtle Pulse on Hover */
          .image-container:hover .image-wrapper::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at center,
              transparent 30%,
              rgba(0, 255, 136, 0.08) 60%,
              transparent 100%
            );
            animation: gentle-pulse 3s ease-in-out infinite;
            pointer-events: none;
            z-index: 2;
          }

          @keyframes gentle-pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.02);
            }
          }

          /* Minimal Morph Effect on Extended Hover */
          .image-container:hover .service-image.image-active {
            animation: subtle-morph 8s ease-in-out infinite;
          }

          @keyframes subtle-morph {
            0%, 100% {
              filter: url(#subtle-wave);
            }
            50% {
              filter: url(#gentle-morph);
            }
          }

          /* Horizontal Scroll Specific */
          .horizontal-scroll-wrapper {
            position: relative;
          }

          .horizontal-container {
            position: relative;
            will-change: transform;
          }

          .horizontal-service-card {
            will-change: opacity, transform;
          }

          /* Prevent image overlap */
          .service-card-image {
            flex-shrink: 0;
          }

          .service-card-content {
            flex-shrink: 1;
            min-width: 0;
            overflow: hidden;
          }
          
            /* Mobile horizontal scroll */
          @media (max-width: 767px) {
            .horizontal-scroll-wrapper {
              overflow-x: auto;
              overflow-y: hidden;
            }
            
            .horizontal-container {
              overflow-x: auto;
              overflow-y: hidden;
              scroll-snap-type: x mandatory;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              -ms-overflow-style: none;
              padding-right: 5vw;
            }
            
            .horizontal-container::-webkit-scrollbar {
              display: none;
            }
            
            .horizontal-service-card {
              scroll-snap-align: start;
              scroll-snap-stop: always;
            }
            
            /* Last card extra spacing on mobile */
            .horizontal-service-card:last-child {
              margin-right: 5vw;
            }
          }

          /* Clean Fade Transitions */
          .service-image,
          .shimmer-overlay,
          .image-wrapper::before {
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Disable effects on mobile for performance */
          @media (max-width: 767px) {
            .service-image.image-active {
              filter: none;
              animation: none;
            }

            .image-container:hover .service-image {
              transform: scale(1.03);
            }

            .shimmer-beam {
              display: none;
            }

            .image-wrapper::before {
              display: none;
            }

            .horizontal-service-card {
              width: 90vw;
            }
            
            /* Mobile: Full width images */
            .service-card-image,
            .image-container {
              width: 100% !important;
              max-width: 100% !important;
            }
            
            /* Better spacing on mobile */
            .horizontal-service-card > div {
              padding: 1rem !important;
            }
          }

          /* Desktop optimizations */
          @media (min-width: 1024px) {
            /* Ensure proper flex layout on large screens */
            .horizontal-service-card .relative.flex {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
            }
            
            /* Service 4 specific - wider with more space between */
            .horizontal-service-card:nth-child(3) {
              width: 92vw !important;
            }
            
            .horizontal-service-card:nth-child(3) .relative.flex {
              justify-content: space-between;
              gap: 4rem;
            }
            
            /* Prevent image from growing */
            .service-card-image {
              flex-shrink: 0;
              flex-grow: 0;
            }
            
            /* Allow content to take remaining space */
            .service-card-content {
              flex-shrink: 1;
              flex-grow: 1;
            }
          }
          
          /* Extra large screens */
          @media (min-width: 1280px) {
            .horizontal-service-card {
              width: 75vw;
            }
          }

          /* Smooth Hardware Acceleration */
          .service-image,
          .shimmer-beam,
          .image-wrapper::before,
          .horizontal-container {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
          }
        `}</style>
      </section>
    </>
  );
};

export default Services;

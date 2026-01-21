import { useRef, useState } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
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
    
  const serviceRefs = useRef([]);
  const imageRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const isDesktop = useMediaQuery({ minWidth: "48rem" });

  const handleMouseEnter = (index) => {
    if (!isDesktop) return;
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  useGSAP(() => {
    serviceRefs.current.forEach((el, index) => {
      if (!el) return;

      gsap.from(el, {
        y: 200,
        opacity: 0,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
        duration: 1,
        ease: "circ.out",
      });

      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          scale: 1.01,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }, []);

  return (
    <section id="services" className="min-h-screen bg-secondary rounded-t-4xl relative overflow-hidden">
      {/* Refined SVG Filters - Much Subtler */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Subtle Wave Distortion */}
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

          {/* Gentle Morph Effect */}
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
      <div className="absolute inset-0 opacity-5">
        <div className="grid-bg w-full h-full" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <AnimatedHeaderSection
          subTitle={"Expertise & Capabilities"}
          title={"Services"}
          text={text}
          textColor={"text-text"}
          withScrollTrigger={true}
        />

        {servicesData.map((service, index) => (
          <div
            ref={(el) => (serviceRefs.current[index] = el)}
            key={index}
            className="sticky px-10 pt-8 pb-12 text-text bg-secondary border-t-2 border-border/50 group hover:border-accent/50 transition-all duration-500"
            style={
              isDesktop
                ? {
                    top: `calc(10vh + ${index * 5}em)`,
                    marginBottom: `${(servicesData.length - index - 1) * 5}rem`,
                  }
                : { top: 0 }
            }
          >
            <div className="relative p-8 rounded-2xl bg-primary/50 border border-border group-hover:border-accent transition-all duration-500 overflow-hidden">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col lg:flex-row items-start justify-between gap-8 font-light">
                {/* Refined Image Section with Smooth Effects */}
                <div className="w-full lg:w-2/5 relative">
                  <div 
                    ref={(el) => (imageRefs.current[index] = el)}
                    className="image-container relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border group-hover:border-accent transition-all duration-500"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Main Image with Refined Distortion */}
                    <div className="image-wrapper">
                      <img
                        src={serviceImages[index]}
                        alt={service.title}
                        className={`service-image w-full h-full object-cover transition-all duration-1000 ease-out ${
                          activeIndex === index ? 'image-active' : ''
                        }`}
                        loading="eager"
                      />
                    </div>

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                    {/* Gentle Shimmer Effect */}
                    <div className="shimmer-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                      <div className="shimmer-beam" />
                    </div>

                    {/* Accent Glow Border */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,255,136,0.15)]" />
                    </div>

                    {/* Service Icon Overlay */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-accent/20 backdrop-blur-md rounded-full flex items-center justify-center border border-accent/30 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                      <Icon icon={serviceIcons[index]} className="text-accent text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-px bg-accent" />
                    <span className="text-xs font-mono text-accent tracking-widest">
                      SERVICE {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold group-hover:text-accent transition-colors duration-500">
                    {service.title}
                  </h2>

                  <p className="text-base md:text-lg lg:text-xl leading-relaxed text-text-dim">
                    {service.description}
                  </p>

                  <div className="flex flex-col gap-4 text-xl md:text-2xl lg:text-3xl">
                    {service.items.map((item, itemIndex) => (
                      <div 
                        key={`item-${index}-${itemIndex}`}
                        className="relative group/item"
                      >
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/30 border border-border/50 group-hover/item:border-accent-blue transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10">
                          <span className="flex-shrink-0 text-sm font-mono text-accent mt-1">
                            0{itemIndex + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-display mb-1 group-hover/item:text-accent-blue transition-colors duration-300">
                              {item.title}
                            </h3>
                            <p className="text-sm md:text-base text-text-dim font-mono">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {itemIndex < service.items.length - 1 && (
                          <div className="w-full h-px my-2 bg-gradient-to-r from-transparent via-border to-transparent" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent-blue/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="px-10 py-16 text-center relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid-bg w-full h-full" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-accent">
              Ready to bring your idea to life?
            </h3>
            <p className="text-xl text-text-dim mb-8 max-w-2xl mx-auto font-light">
              Whether it's a real-time app, 3D experience, or AI integration—let's build something extraordinary together.
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-accent text-primary font-display font-bold text-lg rounded-full hover:bg-accent-blue transition-all duration-300 shadow-lg hover:shadow-accent/50 hover:scale-105"
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
        }

        /* Smooth Hardware Acceleration */
        .service-image,
        .shimmer-beam,
        .image-wrapper::before {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
      `}</style>
    </section>
  );
};

export default Services;

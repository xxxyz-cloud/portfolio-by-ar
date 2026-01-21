import { useRef, useState } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { servicesData } from "../constants";
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
    
  const horizontalRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const serviceRefs = useRef([]);
  const imageRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  useGSAP(() => {
    // Desktop: Horizontal scroll animation
    if (window.innerWidth >= 768) {
      const sections = gsap.utils.toArray('.service-card');
      const totalWidth = sections.reduce((acc, section) => acc + section.offsetWidth, 0);
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => `+=${totalWidth}`,
        }
      });

      // Individual service card animations for desktop
      serviceRefs.current.forEach((el, index) => {
        if (!el) return;

        gsap.to(imageRefs.current[index], {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            scrub: 1,
            containerAnimation: ScrollTrigger.getById('horizontal-scroll'),
          }
        });

        gsap.fromTo(el, 
          { scale: 0.9, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "left 80%",
              end: "left 20%",
              scrub: 1,
              containerAnimation: ScrollTrigger.getById('horizontal-scroll'),
            }
          }
        );
      });
    } else {
      // Mobile: Horizontal scroll container animation
      const mobileContainer = mobileScrollRef.current;
      if (!mobileContainer) return;

      const scrollWidth = mobileContainer.scrollWidth;
      const containerWidth = mobileContainer.offsetWidth;

      gsap.to(mobileContainer, {
        x: -(scrollWidth - containerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: mobileContainer,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollWidth - containerWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }
  }, []);

  return (
    <section id="services" className="min-h-screen bg-secondary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-bg w-full h-full" />
      </div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        <AnimatedHeaderSection
          subTitle={"Expertise & Capabilities"}
          title={"Services"}
          text={text}
          textColor={"text-text"}
          withScrollTrigger={true}
        />

        {/* Desktop: Horizontal Scroll Container */}
        <div 
          ref={horizontalRef}
          className="hidden md:block overflow-hidden"
        >
          <div className="flex w-fit">
            {servicesData.map((service, index) => (
              <div
                key={index}
                ref={(el) => (serviceRefs.current[index] = el)}
                className="service-card w-screen h-screen flex items-center justify-center px-20 flex-shrink-0"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative w-full max-w-7xl h-[85vh] group">
                  <div className="absolute inset-0 grid grid-cols-12 gap-8 p-12 bg-primary/50 rounded-3xl border border-border overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="absolute top-8 right-8 text-[200px] font-display font-bold text-accent/5 leading-none pointer-events-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Image Section */}
                    <div className="col-span-7 relative z-10 flex items-center">
                      <div 
                        ref={(el) => (imageRefs.current[index] = el)}
                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group/img"
                      >
                        <img
                          src={serviceImages[index]}
                          alt={service.title}
                          className="w-full h-full object-cover transition-all duration-1000 group-hover/img:scale-110"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity duration-700" />
                        
                        <div className="absolute top-6 right-6 w-16 h-16 bg-accent/90 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-primary opacity-0 group-hover/img:opacity-100 transition-all duration-500 transform scale-0 group-hover/img:scale-100">
                          <Icon icon={serviceIcons[index]} className="text-primary text-3xl" />
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent h-32 animate-scan" />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="col-span-5 relative z-10 flex flex-col justify-between py-8">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-px bg-accent" />
                          <span className="text-xs font-mono text-accent tracking-widest uppercase">
                            Service {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <h2 className="text-5xl xl:text-6xl font-display font-bold mb-6 leading-tight group-hover:text-accent transition-colors duration-500">
                          {service.title}
                        </h2>

                        <p className="text-xl leading-relaxed text-text-dim mb-8">
                          {service.description}
                        </p>
                      </div>

                      {/* Service Items */}
                      <div className="space-y-4">
                        {service.items.map((item, itemIndex) => (
                          <div 
                            key={`item-${index}-${itemIndex}`}
                            className="group/item relative"
                          >
                            <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/40 border border-border/50 hover:border-accent-blue transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10 cursor-pointer">
                              <span className="flex-shrink-0 text-sm font-mono text-accent">
                                0{itemIndex + 1}
                              </span>
                              <div className="flex-1">
                                <h3 className="text-xl font-display mb-1 group-hover/item:text-accent-blue transition-colors duration-300">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-text-dim font-mono leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <Icon 
                                icon="lucide:arrow-up-right" 
                                className="flex-shrink-0 text-text-dim opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-accent/30 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-accent-blue/30 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Horizontal Scroll Container */}
        <div className="md:hidden relative overflow-hidden">
          <div 
            ref={mobileScrollRef}
            className="flex w-fit"
          >
            {servicesData.map((service, index) => (
              <div
                key={index}
                className="w-screen h-screen flex items-center justify-center px-6 flex-shrink-0"
              >
                <div className="relative w-full h-[85vh] max-w-lg">
                  <div className="relative h-full p-6 rounded-2xl bg-primary/50 border border-border overflow-y-auto">
                    {/* Mobile Image */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6">
                      <img
                        src={serviceImages[index]}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 w-12 h-12 bg-accent/90 rounded-full flex items-center justify-center">
                        <Icon icon={serviceIcons[index]} className="text-primary text-xl" />
                      </div>
                    </div>

                    {/* Mobile Content */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-px bg-accent" />
                      <span className="text-xs font-mono text-accent tracking-widest">
                        SERVICE {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="text-3xl font-display font-bold mb-4">
                      {service.title}
                    </h2>

                    <p className="text-base leading-relaxed text-text-dim mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <div 
                          key={`item-${index}-${itemIndex}`}
                          className="flex items-start gap-3 p-4 rounded-lg bg-primary/30 border border-border/50"
                        >
                          <span className="flex-shrink-0 text-xs font-mono text-accent">
                            0{itemIndex + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-display mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-text-dim font-mono">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator for mobile */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/80 backdrop-blur-sm border border-accent/30">
            <Icon icon="lucide:swipe-right" className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-xs font-mono text-accent uppercase tracking-wider">
              Swipe to explore
            </span>
          </div>
        </div>

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
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400%);
          }
        }

        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }

        .animate-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Services;

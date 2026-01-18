import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { servicesData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Icon } from "@iconify/react/dist/iconify.js";

const serviceIcons = [
  "lucide:code-2",
  "lucide:sparkles",
  "lucide:brain",
  "lucide:zap",
];

const Services = () => {
  const text = `Specialized in building secure, high-performance applications
    From real-time collaboration to 3D web experiences
    Merging technical precision with creative vision`;
    
  const serviceRefs = useRef([]);
  const isDesktop = useMediaQuery({ minWidth: "48rem" });

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

      // Glow effect on hover
      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          scale: 1.02,
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
            {/* Service Card */}
            <div className="relative p-8 rounded-2xl bg-primary/50 border border-border group-hover:border-accent transition-all duration-500 overflow-hidden">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-start justify-between gap-6 font-light">
                <div className="flex-1 flex flex-col gap-6">
                  {/* Service Header */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
                      <Icon 
                        icon={serviceIcons[index]} 
                        className="w-8 h-8 text-accent"
                      />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-lg md:text-xl lg:text-2xl leading-relaxed tracking-wide text-text-dim">
                    {service.description}
                  </p>

                  {/* Service Items */}
                  <div className="flex flex-col gap-4 text-xl md:text-2xl lg:text-3xl">
                    {service.items.map((item, itemIndex) => (
                      <div 
                        key={`item-${index}-${itemIndex}`}
                        className="relative group/item"
                      >
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/30 border border-border/50 group-hover/item:border-accent-blue transition-all duration-300">
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

                {/* Service Number */}
                <div className="hidden lg:block text-9xl font-display font-bold text-accent/10 group-hover:text-accent/20 transition-colors duration-500">
                  0{index + 1}
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent-blue/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="px-10 py-16 text-center">
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
    </section>
  );
};

export default Services;
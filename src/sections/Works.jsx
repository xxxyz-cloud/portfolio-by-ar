import { Icon } from "@iconify/react/dist/iconify.js";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projects } from "../constants";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Works = () => {
  const overlayRefs = useRef([]);
  const previewRef = useRef(null);
  const projectRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  
  const text = `Featured projects meticulously crafted with passion
    Real-time applications, 3D experiences, AI integration
    Building what others think is impossible`;

  const mouse = useRef({ x: 0, y: 0 });
  const moveX = useRef(null);
  const moveY = useRef(null);

  useGSAP(() => {
    moveX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 1.5,
      ease: "power3.out",
    });
    moveY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 2,
      ease: "power3.out",
    });

    gsap.from(projectRefs.current, {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.2,
      ease: "back.out",
      scrollTrigger: {
        trigger: projectRefs.current[0],
        start: "top 80%",
      },
    });
  }, []);

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(index);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.15, ease: "power2.out" }
    );

    gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(null);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", duration: 0.2, ease: "power2.in" });
    gsap.to(previewRef.current, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    mouse.current.x = e.clientX + 20;
    mouse.current.y = e.clientY - 125;
    moveX.current(mouse.current.x);
    moveY.current(mouse.current.y);
  };

  return (
    <section id="work" className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <AnimatedHeaderSection
          subTitle={"Logic meets Aesthetics, Seamlessly"}
          title={"Featured Works"}
          text={text}
          textColor={"text-text"}
          withScrollTrigger={true}
        />

        <div className="relative flex flex-col font-light" onMouseMove={handleMouseMove}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (projectRefs.current[index] = el)}
              className="relative flex flex-col gap-1 py-6 cursor-pointer group border-b border-border last:border-b-0"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div
                ref={(el) => { overlayRefs.current[index] = el; }}
                className="absolute inset-0 hidden md:block duration-200 bg-gradient-to-r from-secondary via-secondary to-primary -z-10 clip-path"
              />

              <div className="flex justify-between items-start px-6 sm:px-10 text-text transition-all duration-500 md:group-hover:px-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl lg:text-[32px] leading-none font-display font-bold group-hover:text-accent transition-colors duration-300">
                      {project.name}
                    </h2>
                    {project.featured && (
                      <span className="px-3 py-1 text-xs font-mono bg-accent/20 text-accent border border-accent rounded-full">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-text-dim max-w-2xl mb-4">
                    {project.description}
                  </p>
                </div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 sm:p-3 rounded-full border border-border hover:border-accent hover:bg-accent/10 transition-all duration-300 group/icon"
                >
                  <Icon 
                    icon="lucide:arrow-up-right" 
                    className="size-4 sm:size-5 md:size-6 text-text group-hover/icon:text-accent transition-colors duration-300" 
                  />
                </a>
              </div>

              <div className="flex flex-wrap px-6 sm:px-10 text-xs leading-loose uppercase transition-all duration-500 md:text-sm gap-x-3 sm:gap-x-4 gap-y-2 md:group-hover:px-12">
                {project.frameworks.map((framework) => (
                  <span
                    key={framework.id}
                    className="px-2 sm:px-3 py-1 rounded bg-primary/50 border border-border text-text-dim group-hover:border-accent-blue group-hover:text-accent-blue transition-all duration-300 font-mono"
                  >
                    {framework.name}
                  </span>
                ))}
              </div>

              <div className="relative flex items-center justify-center px-6 sm:px-10 md:hidden h-[300px] sm:h-[400px] mt-4 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent-blue/20 to-accent-purple/20 blur-2xl z-10" />
                <img
                  src={project.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.25] blur-md scale-110"
                  loading="lazy"
                />
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  className="relative z-20 max-w-[85%] sm:max-w-[90%] max-h-[80%] sm:max-h-[90%] object-contain rounded-lg shadow-2xl border-2 border-accent"
                  loading="lazy"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}

          <div
            ref={previewRef}
            className="fixed top-0 left-0 z-50 overflow-hidden pointer-events-none w-[400px] h-[250px] md:block hidden opacity-0 rounded-xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-accent-blue/30 to-accent-purple/30 blur-xl" />
            {currentIndex !== null && (
              <img
                src={projects[currentIndex].image}
                alt="preview"
                className="relative object-cover w-full h-full border-4 border-accent rounded-xl"
              />
            )}
          </div>
        </div>

        <div className="flex justify-center px-6 sm:px-10 py-12 sm:py-16">
          <a
            href="https://github.com/anshu-c8NETed"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-full border-2 border-accent text-accent font-display font-bold text-base sm:text-lg transition-all duration-300 hover:text-primary"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline">View All Projects on GitHub</span>
              <span className="sm:hidden">View on GitHub</span>
              <Icon icon="lucide:arrow-right" className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Works;
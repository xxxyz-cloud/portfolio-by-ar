import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { achievements, stats } from "../constants";

const About = () => {
  const text = `Specialized in animation-rich interfaces & real-time apps
    MERN stack architect with AI integration expertise
    Where performance meets aesthetics`;
    
  const aboutText = `I don't just write code—I craft digital experiences that make users go "How did they do that?"

From pixel-perfect React UIs to bulletproof Node.js backends, every project is a blend of technical precision and creative vision. Whether it's real-time collaboration with Socket.io, 3D web graphics with Three.js, or AI-powered features with Google Gemini, I build what others think is impossible.

Current Focus:
⚡ Real-time collaborative applications
🎮 Interactive 3D web experiences 
🤖 AI integration that actually adds value
📊 Solving complex algorithmic challenges 

When I'm not shipping features:
🎯 Grinding LeetCode problems at 3 AM
🎨 Experimenting with GSAP and shader effects  
📚 Learning the latest in web technology
🎵 Debugging to Music`;

  const imgRef = useRef(null);
  const statsRef = useRef(null);
  const achievementRefs = useRef([]);
  const achievementContainerRef = useRef(null);

  useGSAP(() => {
    // Section scale animation
    const scaleTween = gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
      },
      ease: "power1.inOut",
    });

    // Image reveal animation
    if (imgRef.current) {
      gsap.set(imgRef.current, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      const imgTween = gsap.to(imgRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 2,
        ease: "power4.out",
        scrollTrigger: { 
          trigger: imgRef.current,
          start: "top 80%",
        },
      });
    }

    // Stats counter animation
    if (statsRef.current) {
      const statsTween = gsap.from(statsRef.current.children, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });
    }

    // Achievements animation - Fixed to ensure visibility
    if (achievementRefs.current.length > 0) {
      gsap.set(achievementRefs.current, { opacity: 1, y: 0 }); // Ensure initial visibility
      
      const achievementsTween = gsap.from(achievementRefs.current, {
        scrollTrigger: {
          trigger: achievementContainerRef.current,
          start: "top 85%",
        },
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <section id="about" className="min-h-screen bg-secondary rounded-b-4xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-bg w-full h-full" />
      </div>

      <div className="relative z-10">
        <AnimatedHeaderSection
          subTitle={"Code with purpose, Built to scale"}
          title={"About"}
          text={text}
          textColor={"text-text"}
          withScrollTrigger={true}
        />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-between gap-16 px-10 pb-16 lg:flex-row">
          {/* Profile Image with Cyber Frame */}
          <div className="relative group w-full lg:w-auto flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-blue to-accent-purple opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative">
              <img
                ref={imgRef}
                src="/images/anshu-profile.jpg"
                alt="Anshu Raj - Full Stack Developer"
                className="relative w-full max-w-md rounded-2xl border-2 border-accent shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full max-w-md h-96 rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/20 to-accent-blue/20 flex items-center justify-center text-accent text-6xl font-display">AR</div>';
                }}
              />
              {/* Cyber Corner Decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent-blue" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent-blue" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent" />
            </div>
          </div>

          {/* About Text */}
          <div className="w-full lg:w-1/2">
            <AnimatedTextLines 
              text={aboutText} 
              className="text-lg md:text-xl lg:text-2xl font-light tracking-wide text-text-dim leading-relaxed"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 px-10 pb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl bg-primary/50 border border-border hover:border-accent transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold neon-text font-display mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-mono text-text-dim">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div ref={achievementContainerRef} className="px-10 pb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-accent font-display">
            Achievements & Certifications
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) achievementRefs.current[index] = el;
                }}
                className="flex items-start gap-4 p-4 rounded-lg bg-primary/30 border border-border hover:border-accent-blue transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-accent group-hover:shadow-lg group-hover:shadow-accent/50 transition-all duration-300" />
                <p className="text-base md:text-lg font-light text-text">
                  {achievement}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div className="px-10 pb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-accent-blue font-display">
            Tech Arsenal
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "React", "Next.js", "Node.js", "Express", "MongoDB",
              "Socket.io", "Three.js", "GSAP", "TypeScript", "Tailwind",
              "Python", "C++", "REST APIs", "WebGL", "Framer Motion"
            ].map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-primary/50 border border-accent/30 text-accent font-mono text-sm hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
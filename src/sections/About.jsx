import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { achievements, stats } from "../constants";
import { Icon } from "@iconify/react/dist/iconify.js";

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
  const techTagRefs = useRef([]);

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

    // Achievements animation
    if (achievementRefs.current.length > 0) {
      gsap.set(achievementRefs.current, { opacity: 1, y: 0 });
      
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

    // Tech tags animation
    if (techTagRefs.current.length > 0) {
      gsap.from(techTagRefs.current, {
        scrollTrigger: {
          trigger: techTagRefs.current[0],
          start: "top 90%",
        },
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }
  }, []);

  const techCategories = {
    "Frontend": ["React", "Next.js", "TypeScript", "Tailwind"],
    "Backend": ["Node.js", "Express", "MongoDB", "REST APIs"],
    "Animation": ["Three.js", "GSAP", "WebGL", "Framer Motion"],
    "Languages": ["JavaScript", "Python", "C++"],
    "Real-Time": ["Socket.io", "WebSockets"]
  };

  return (
    <section id="about" className="min-h-screen bg-secondary rounded-b-4xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-bg w-full h-full" />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float" />

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
          {/* Profile Image with Enhanced Cyber Frame */}
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
              {/* Enhanced Corner Decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent transition-all duration-300 group-hover:w-12 group-hover:h-12" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent-blue transition-all duration-300 group-hover:w-12 group-hover:h-12" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent-blue transition-all duration-300 group-hover:w-12 group-hover:h-12" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent transition-all duration-300 group-hover:w-12 group-hover:h-12" />
              
              {/* Scan Line Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-100%] group-hover:translate-y-[100%]" style={{ transition: 'transform 2s linear, opacity 0.5s' }} />
            </div>
          </div>

          {/* Enhanced About Text with Visual Elements */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Decorative Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
              <span className="text-xs font-mono text-accent uppercase tracking-widest">About Me</span>
              <div className="flex-1 h-px bg-gradient-to-r from-accent to-transparent" />
            </div>

            {/* Text Content with Enhanced Styling */}
            <div className="relative p-6 rounded-xl bg-primary/30 border border-border/50 backdrop-blur-sm">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-blue/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
              
              <div className="relative">
                <AnimatedTextLines 
                  text={aboutText} 
                  className="text-base md:text-lg lg:text-xl font-light tracking-wide text-text-dim leading-relaxed"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-accent rounded-full" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-accent-blue rounded-full" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-accent-purple rounded-full" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-accent rounded-full" />
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: "lucide:code-2", label: "500+ DSA", color: "accent" },
                { icon: "lucide:rocket", label: "20+ Projects", color: "accent-blue" },
                { icon: "lucide:award", label: "5+ Certs", color: "accent-purple" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <Icon icon={item.icon} className={`w-5 h-5 text-${item.color}`} />
                  <span className="text-xs font-mono text-text-dim">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 px-10 pb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl bg-primary/50 border border-border hover:border-accent transition-all duration-300 group overflow-hidden"
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Particle Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-accent rounded-full animate-ping" />
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent-blue rounded-full animate-ping" style={{ animationDelay: "0.2s" }} />
                <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-accent-purple rounded-full animate-ping" style={{ animationDelay: "0.4s" }} />
              </div>

              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold neon-text font-display mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-mono text-text-dim group-hover:text-text transition-colors duration-300">
                  {stat.label}
                </div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Achievements Section */}
        <div ref={achievementContainerRef} className="px-10 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <Icon icon="lucide:trophy" className="w-8 h-8 text-accent" />
            <h3 className="text-2xl md:text-3xl font-bold text-accent font-display">
              Achievements & Certifications
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-accent to-transparent" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) achievementRefs.current[index] = el;
                }}
                className="group relative flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/50 to-primary/30 border border-border hover:border-accent-blue transition-all duration-300 overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="lucide:check-circle" className="w-5 h-5 text-accent" />
                </div>
                
                {/* Content */}
                <div className="relative flex-1">
                  <p className="text-base md:text-lg font-light text-text group-hover:text-accent-blue transition-colors duration-300">
                    {achievement}
                  </p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Tech Arsenal Section */}
        <div className="px-10 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <Icon icon="lucide:layers" className="w-8 h-8 text-accent-blue" />
            <h3 className="text-2xl md:text-3xl font-bold text-accent-blue font-display">
              Tech Arsenal
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-accent-blue to-transparent" />
          </div>

          <div className="space-y-8">
            {Object.entries(techCategories).map(([category, technologies], categoryIndex) => (
              <div key={category} className="group">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 rounded-full bg-accent group-hover:bg-accent-blue transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-blue/50" />
                  <h4 className="text-xl font-display font-bold text-text group-hover:text-accent-blue transition-colors duration-300">
                    {category}
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent group-hover:from-accent-blue/50 transition-all duration-300" />
                  <span className="text-xs font-mono text-text-dim">{technologies.length}</span>
                </div>

                {/* Technology Tags Grid */}
                <div className="flex flex-wrap gap-4">
                  {technologies.map((tech, techIndex) => {
                    const globalIndex = categoryIndex * 10 + techIndex;
                    return (
                      <div
                        key={tech}
                        ref={(el) => {
                          if (el) techTagRefs.current[globalIndex] = el;
                        }}
                        className="group/tag relative cursor-pointer"
                      >
                        {/* Main Tag Container */}
                        <div className="relative px-6 py-3 rounded-xl bg-secondary/90 border-2 border-accent/50 overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/40 hover:scale-105 hover:-translate-y-1">
                          {/* Animated Hover Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent-blue/20 to-accent-purple/20 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-500" />
                          
                          {/* Scan Line Effect */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/40 to-transparent h-full translate-y-[-100%] group-hover/tag:translate-y-[100%] transition-transform duration-700" />
                          
                          {/* Text - Made more visible */}
                          <span className="relative z-10 font-mono text-base font-semibold text-accent group-hover/tag:text-white transition-colors duration-300 drop-shadow-lg whitespace-nowrap">
                            {tech}
                          </span>

                          {/* Corner Accents */}
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-blue opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300" />

                          {/* Glow Effect */}
                          <div className="absolute -inset-1 bg-accent/20 rounded-xl blur-md opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        {/* Floating Particles on Hover */}
                        <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover/tag:opacity-100 group-hover/tag:animate-ping" />
                        <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-accent-blue rounded-full opacity-0 group-hover/tag:opacity-100 group-hover/tag:animate-ping" style={{ animationDelay: "0.15s" }} />
                        <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-accent-purple rounded-full opacity-0 group-hover/tag:opacity-100 group-hover/tag:animate-ping" style={{ animationDelay: "0.3s" }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Tech Stack Visualization */}
          <div className="mt-16 relative">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-accent" />
              <span className="text-sm font-mono text-accent uppercase tracking-widest">Core Technologies</span>
              <div className="flex-1 h-px bg-gradient-to-r from-accent to-transparent" />
            </div>

            {/* Technology Cards */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/50 to-secondary/50 border-2 border-border/50 backdrop-blur-sm overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid-bg w-full h-full" />
              </div>

              {/* Animated Gradient Orb */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {[
                  { icon: "logos:react", label: "React", color: "#61DAFB" },
                  { icon: "logos:nodejs-icon", label: "Node.js", color: "#339933" },
                  { icon: "logos:mongodb-icon", label: "MongoDB", color: "#47A248" },
                  { icon: "logos:threejs", label: "Three.js", color: "#000000" },
                  { icon: "logos:socket-io", label: "Socket.io", color: "#010101" },
                ].map((item, index) => (
                  <div key={index} className="group relative flex flex-col items-center gap-4 cursor-pointer">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon Container */}
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-primary border-2 border-border flex items-center justify-center group-hover:border-accent group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                      {/* Scan Line */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000" />
                      
                      <Icon icon={item.icon} className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Label */}
                    <div className="relative text-center">
                      <span className="text-sm font-mono text-text-dim group-hover:text-accent transition-colors duration-300 font-medium">
                        {item.label}
                      </span>
                      {/* Underline */}
                      <div className="h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-1" />
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-accent-blue rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: "0.2s" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

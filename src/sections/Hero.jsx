import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

// Tech Stack Marquee Component
const TechStackMarquee = () => {
  const techStack = [
    { name: "React", icon: "logos:react", color: "#61DAFB" },
    { name: "Next.js", icon: "logos:nextjs-icon", color: "#000000" },
    { name: "TypeScript", icon: "logos:typescript-icon", color: "#3178C6" },
    { name: "JavaScript", icon: "logos:javascript", color: "#F7DF1E" },
    { name: "Node.js", icon: "logos:nodejs-icon", color: "#339933" },
    { name: "Express", icon: "skill-icons:expressjs-light", color: "#000000" },
    { name: "MongoDB", icon: "logos:mongodb-icon", color: "#47A248" },
    { name: "Three.js", icon: "logos:threejs", color: "#000000" },
    { name: "GSAP", icon: "logos:greensock-icon", color: "#88CE02" },
    { name: "Tailwind", icon: "logos:tailwindcss-icon", color: "#06B6D4" },
    { name: "Python", icon: "logos:python", color: "#3776AB" },
    { name: "C++", icon: "logos:c-plusplus", color: "#00599C" },
    { name: "Socket.io", icon: "logos:socket-io", color: "#010101" },
    { name: "Git", icon: "logos:git-icon", color: "#F05032" },
    { name: "Framer", icon: "logos:framer", color: "#0055FF" },
  ];

  const duplicatedTech = [...techStack, ...techStack, ...techStack];
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marqueeContent = marqueeRef.current;
    const marqueeWidth = marqueeContent.scrollWidth / 3;

    gsap.to(marqueeContent, {
      x: -marqueeWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-6 md:py-8 bg-gradient-to-r from-secondary/80 via-secondary/60 to-secondary/80 backdrop-blur-md border-y border-border/30">
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-secondary/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-secondary/90 to-transparent z-10 pointer-events-none" />
      
      <div className="absolute top-2 left-6 md:left-10 z-20">
        <span className="text-xs font-mono text-accent uppercase tracking-widest">Tech Stack</span>
      </div>

      <div ref={marqueeRef} className="flex gap-8 md:gap-12 items-center will-change-transform">
        {duplicatedTech.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="group flex flex-col items-center gap-2 flex-shrink-0 transition-transform duration-300 hover:scale-110"
          >
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-primary/50 border border-border group-hover:border-accent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/20">
                <Icon 
                  icon={tech.icon} 
                  className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12" 
                />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-accent-blue/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <span className="text-xs font-mono text-text-dim group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Canvas Particles for Mobile
const MobileParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.speed = Math.random() * 2 + 1;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00ff88' : '#00d4ff';
      }
      
      update() {
        this.y += this.speed;
        if (this.y > canvas.height + 10) {
          this.reset();
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-40 pointer-events-none"
    />
  );
};

// Code Rain Effect
const CodeRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20 pointer-events-none"
    />
  );
};

// Glitch Text Effect Component
const GlitchText = ({ children }) => {
  return (
    <div className="relative inline-block">
      {children}
      <div className="absolute inset-0 opacity-70 animate-glitch-1" style={{ color: '#00ff88', mixBlendMode: 'screen' }}>
        {children}
      </div>
      <div className="absolute inset-0 opacity-70 animate-glitch-2" style={{ color: '#00d4ff', mixBlendMode: 'screen' }}>
        {children}
      </div>
    </div>
  );
};

// Enhanced 3D Helmet Scene - Smaller and positioned right
const ThreeScene = ({ canvasRef }) => {
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || window.innerWidth < 768) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    sceneRef.current = scene;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x00ff88, 1.5);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x00d4ff, 1.2);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xb77bff, 2, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Load helmet model
    const loader = new GLTFLoader();
    loader.load(
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        
        // Position helmet to the right side and slightly up
        model.position.set(3.5, 0.5, 0);
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.metalness = 0.9;
            child.material.roughness = 0.3;
            child.material.envMapIntensity = 1.5;
          }
        });
        
        scene.add(model);
        modelRef.current = model;
      },
      undefined,
      (error) => console.error('Model loading error:', error)
    );

    camera.position.set(0, 0, 8);

    // Mouse interaction
    const onMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Calculate target rotation based on mouse position
      targetRotationRef.current.y = mouseRef.current.x * 0.5;
      targetRotationRef.current.x = mouseRef.current.y * 0.3;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Auto-rotation with smooth mouse follow
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        // Smooth rotation towards target
        modelRef.current.rotation.y += (targetRotationRef.current.y - modelRef.current.rotation.y) * 0.05;
        modelRef.current.rotation.x += (targetRotationRef.current.x - modelRef.current.rotation.x) * 0.05;
        
        // Add subtle continuous rotation
        modelRef.current.rotation.y += 0.003;
        
        // Gentle floating animation
        modelRef.current.position.y = 0.5 + Math.sin(Date.now() * 0.001) * 0.15;
      }

      // Gentle camera sway
      camera.position.x = Math.sin(Date.now() * 0.0003) * 0.2;
      camera.position.y = Math.cos(Date.now() * 0.0005) * 0.1;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, [canvasRef]);

  return null;
};

// Quick Links Component - New addition for better space utilization
const QuickLinks = () => {
  const links = [
    { label: "GitHub", icon: "mdi:github", href: "https://github.com/anshu-c8NETed" },
    { label: "LinkedIn", icon: "mdi:linkedin", href: "https://www.linkedin.com/in/anshu-raj-tech" },
    { label: "LeetCode", icon: "simple-icons:leetcode", href: "https://leetcode.com/u/anshxu" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Connect</p>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50 border border-border hover:border-accent transition-all duration-300 hover:translate-x-2"
        >
          <Icon icon={link.icon} className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm font-mono text-text-dim group-hover:text-text transition-colors duration-300">
            {link.label}
          </span>
          <Icon icon="lucide:arrow-right" className="w-4 h-4 text-accent ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </a>
      ))}
    </div>
  );
};

const Hero = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "> initializing portfolio.exe...";

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out",
      });

      gsap.from(".hero-desc-line", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 1.5,
        ease: "power2.out",
      });

      gsap.from(".hero-cta", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 2,
        ease: "back.out(1.7)",
      });

      gsap.from(".hero-stat", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 2.3,
        ease: "power2.out",
      });

      gsap.from(".tech-stack-marquee", {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 2.5,
        ease: "power2.out",
      });

      gsap.from(".quick-links", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: 2.2,
        ease: "power2.out",
      });

      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        opacity: 0.3,
        scale: 0.92,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-primary"
    >
      {/* Desktop 3D Scene */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-60 pointer-events-none hidden md:block"
      />
      <ThreeScene canvasRef={canvasRef} />

      {/* Mobile Visual Effects */}
      {isMobile && (
        <>
          <MobileParticles />
          <CodeRain />
        </>
      )}

      {/* Background Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 grid-bg" />
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-accent-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/15 rounded-full blur-3xl animate-float" />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-accent/30 rotate-45 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-accent-blue/30 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-40 w-40 h-40 border-2 border-accent-purple/30 -rotate-12 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 right-40 w-20 h-20 border-2 border-accent/30 animate-pulse" style={{ animationDelay: "2s" }} />
        
        {isMobile && (
          <>
            <div className="absolute top-1/4 right-10 w-16 h-16 border-2 border-accent-purple/40 rotate-12 animate-float" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-1/3 left-10 w-20 h-20 border-2 border-accent-blue/40 -rotate-45 animate-pulse" />
          </>
        )}
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-8">
            {/* Typing Effect */}
            <div className="mb-6 md:mb-8">
              <p className="font-mono text-xs md:text-sm text-accent flex items-center gap-2">
                {displayedText}
                <span className="inline-block w-1.5 h-4 bg-accent animate-pulse" />
              </p>
            </div>

            {/* Main Title with Glitch Effect */}
            <div ref={titleRef} className="mb-8 md:mb-10 overflow-hidden">
              <div className="hero-line">
                <GlitchText>
                  <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none text-text mb-2 md:mb-3">
                    ANSHU
                  </h1>
                </GlitchText>
              </div>
              <div className="hero-line">
                <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none bg-gradient-to-r from-accent via-accent-blue to-accent-purple bg-clip-text text-transparent animate-gradient">
                  RAJ
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <div className="hero-subtitle mb-8 md:mb-10">
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-dim flex flex-wrap items-center gap-2 md:gap-3">
                Full-Stack Developer
                <span className="text-accent text-2xl md:text-3xl animate-pulse">×</span>
                Creative Coder
              </h2>
            </div>

            {/* Description */}
            <div className="mb-10 md:mb-12 space-y-2 max-w-2xl">
              <p className="hero-desc-line text-base md:text-lg lg:text-xl text-text-dim font-light">
                Building <span className="text-accent font-medium neon-text">animation-rich</span> web experiences that merge
              </p>
              <p className="hero-desc-line text-base md:text-lg lg:text-xl text-text-dim font-light">
                <span className="text-accent-blue font-medium neon-text-blue">technical precision</span> with{" "}
                <span className="text-accent-purple font-medium">creative vision</span>
              </p>
              <p className="hero-desc-line text-base md:text-lg lg:text-xl text-text font-light mt-4 md:mt-6">
                <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse mr-2" />
                500+ problems solved • 20+ projects deployed
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-12 md:mb-16">
              <a
                href="#work"
                className="hero-cta group relative px-8 py-4 bg-accent text-primary font-display font-bold text-base md:text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View My Work
                  <Icon icon="lucide:arrow-down" className="group-hover:translate-y-1 transition-transform duration-300" />
                </span>
              </a>
              <a
                href="#contact"
                className="hero-cta group relative px-8 py-4 border-2 border-accent text-accent font-display font-bold text-base md:text-lg rounded-full overflow-hidden transition-all duration-300 hover:text-primary text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Let's Connect
                  <Icon icon="lucide:sparkles" className="group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {[
                { number: "500+", label: "DSA Solved", icon: "lucide:code", color: "accent" },
                { number: "20+", label: "Projects", icon: "lucide:rocket", color: "accent-blue" },
                { number: "50+", label: "Users", icon: "lucide:users", color: "accent-purple" },
                { number: "60fps", label: "Performance", icon: "lucide:zap", color: "accent" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="hero-stat group relative p-5 md:p-6 rounded-xl bg-secondary/80 border border-border backdrop-blur-sm hover:border-accent transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent h-full translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-linear" />
                  
                  <div className="relative">
                    <Icon icon={stat.icon} className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color} mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300`} />
                    <div className={`text-2xl md:text-3xl font-bold text-${stat.color} font-display mb-1 group-hover:neon-text transition-all duration-300`}>
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm font-mono text-text-dim">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links - Right Side (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4 quick-links">
            <QuickLinks />
          </div>
        </div>
      </div>

      {/* Tech Stack Marquee - Positioned at Bottom */}
      <div className="tech-stack-marquee relative z-10 mt-auto">
        <TechStackMarquee />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-mono text-text-dim uppercase tracking-widest">Scroll</span>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 border-t-4 border-l-4 border-accent/30" />
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 border-t-4 border-r-4 border-accent-blue/30" />
      <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 border-b-4 border-l-4 border-accent-purple/30" />
      <div className="absolute bottom-0 right-0 w-24 md:w-32 h-24 md:h-32 border-b-4 border-r-4 border-accent/30" />
    </section>
  );
};

export default Hero;

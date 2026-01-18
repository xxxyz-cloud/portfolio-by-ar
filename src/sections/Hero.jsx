import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

const MagneticButton = ({ children, href, variant = "primary" }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.3;
      const y = (e.clientY - top - height / 2) * 0.3;

      gsap.to(button, {
        x,
        y,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const baseClasses = "group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-display font-bold text-sm sm:text-base md:text-lg rounded-full overflow-hidden transition-all duration-500 w-full sm:w-auto";
  
  const variantClasses = {
    primary: "bg-accent text-primary hover:shadow-2xl hover:shadow-accent/50",
    secondary: "border-2 border-accent text-accent hover:text-primary"
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {variant === "secondary" && (
        <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </a>
  );
};

const NumberCounter = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);
            
            if (progress < 1) {
              setCount(Math.floor(end * progress));
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const TechStackCarousel = () => {
  const techStack = [
    { name: "React", icon: "logos:react" },
    { name: "Next.js", icon: "logos:nextjs-icon" },
    { name: "TypeScript", icon: "logos:typescript-icon" },
    { name: "Node.js", icon: "logos:nodejs-icon" },
    { name: "MongoDB", icon: "logos:mongodb-icon" },
    { name: "Three.js", icon: "logos:threejs" },
    { name: "GSAP", icon: "logos:greensock-icon" },
    { name: "Tailwind", icon: "logos:tailwindcss-icon" },
    { name: "Socket.io", icon: "logos:socket-io" },
    { name: "Python", icon: "logos:python" },
  ];

  const carouselRef = useRef(null);

  useEffect(() => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const items = carousel.children;
    const itemWidth = items[0]?.offsetWidth || 100;
    const gap = 24;
    const totalWidth = (itemWidth + gap) * items.length;

    gsap.to(carousel, {
      x: -totalWidth / 2,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (totalWidth / 2))
      }
    });
  }, []);

  const duplicatedTech = [...techStack, ...techStack];

  return (
    <div className="relative w-full overflow-hidden py-3 sm:py-4 md:py-5 lg:py-6 border-y border-border/20 bg-secondary/30 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 lg:w-32 bg-gradient-to-r from-secondary via-secondary/90 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 lg:w-32 bg-gradient-to-l from-secondary via-secondary/90 to-transparent z-10" />
      
      <div ref={carouselRef} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-center">
        {duplicatedTech.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="group flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0 cursor-pointer"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-16 lg:h-16">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-primary/60 border border-border/60 group-hover:border-accent transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-accent-blue/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon 
                icon={tech.icon} 
                className="absolute inset-0 m-auto w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:rotate-12" 
              />
            </div>
            <span className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-mono text-text-dim group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

    const loader = new GLTFLoader();
    loader.load(
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.8, 1.8, 1.8);
        model.position.set(3, 0, 0);
        
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

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const onMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      targetRotationRef.current.y = mouseRef.current.x * 0.8;
      targetRotationRef.current.x = mouseRef.current.y * 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        modelRef.current.rotation.y += (targetRotationRef.current.y - modelRef.current.rotation.y) * 0.08;
        modelRef.current.rotation.x += (targetRotationRef.current.x - modelRef.current.rotation.x) * 0.08;
        modelRef.current.rotation.y += 0.002;
        modelRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.15;
      }

      if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0003;
      }

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

const StatCard = ({ number, suffix, label, icon, delay = 0 }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 60,
      opacity: 0,
      delay: delay,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 90%",
      }
    });
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="group relative p-6 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border/30 backdrop-blur-sm hover:border-accent/50 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-linear" />
      
      <div className="relative z-10">
        <Icon 
          icon={icon} 
          className="w-6 h-6 text-accent mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" 
        />
        <div className="text-3xl md:text-4xl font-bold font-display mb-1 bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
          <NumberCounter end={parseInt(number)} suffix={suffix} />
        </div>
        <div className="text-sm font-mono text-text-dim uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", { y: -50, opacity: 0, duration: 0.6 });
      tl.from(".hero-title-line", { y: 120, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out" }, "-=0.3");
      tl.from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5");
      tl.from(".hero-description", { y: 40, opacity: 0, duration: 0.6 }, "-=0.4");
      tl.from(".hero-cta", { scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
      tl.from(".hero-stat", { y: 60, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.4");
      tl.from(".tech-carousel", { y: 40, opacity: 0, duration: 0.8 }, "-=0.5");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="home" className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-primary">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70 pointer-events-none hidden md:block" />
      <ThreeScene canvasRef={canvasRef} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20"><div className="grid-bg w-full h-full" /></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-accent-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[250px] md:w-[300px] lg:w-[400px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-accent-purple/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 left-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 border-t-2 border-l-2 border-accent/30" />
        <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 border-t-2 border-r-2 border-accent-blue/30" />
        <div className="absolute bottom-0 left-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 border-b-2 border-l-2 border-accent-purple/30" />
        <div className="absolute bottom-0 right-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 border-b-2 border-r-2 border-accent/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20">
        <div className="hero-badge mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs md:text-sm font-mono text-accent uppercase tracking-wider">Available for Work</span>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="overflow-hidden">
            <h1 className="hero-title-line font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none text-text">ANSHU</h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-title-line font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none bg-gradient-to-r from-accent via-accent-blue to-accent-purple bg-clip-text text-transparent animate-gradient">RAJ</h1>
          </div>
        </div>

        <div className="hero-subtitle mb-8 md:mb-10 max-w-3xl">
          <h2 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-dim">
            Full-Stack Developer <span className="text-accent">×</span> Creative Technologist
          </h2>
        </div>

        <div className="hero-description mb-10 md:mb-12 max-w-2xl">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text font-light leading-relaxed">
            Crafting <span className="text-accent font-medium neon-text">pixel-perfect</span> experiences at the intersection of <span className="text-accent-blue font-medium neon-text-blue">engineering</span> and <span className="text-accent-purple font-medium">artistry</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-16 md:mb-20">
          <div className="hero-cta">
            <MagneticButton href="#work" variant="primary">
              View Projects
              <Icon icon="lucide:arrow-right" className="group-hover:translate-x-1 transition-transform duration-300" />
            </MagneticButton>
          </div>
          <div className="hero-cta">
            <MagneticButton href="#contact" variant="secondary">
              Get In Touch
              <Icon icon="lucide:sparkles" className="group-hover:rotate-12 transition-transform duration-300" />
            </MagneticButton>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <div className="hero-stat"><StatCard number="500" suffix="+" label="Problems Solved" icon="lucide:code-2" delay={0} /></div>
          <div className="hero-stat"><StatCard number="20" suffix="+" label="Live Projects" icon="lucide:rocket" delay={0.1} /></div>
          <div className="hero-stat"><StatCard number="50" suffix="+" label="Concurrent Users" icon="lucide:users" delay={0.2} /></div>
          <div className="hero-stat"><StatCard number="60" suffix="fps" label="Performance" icon="lucide:zap" delay={0.3} /></div>
        </div>
      </div>

      <div className="tech-carousel relative z-10 mt-auto">
        <TechStackCarousel />
      </div>

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 animate-bounce z-20">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-accent rounded-full flex justify-center p-1">
          <div className="w-1 h-2 sm:h-3 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] sm:text-xs font-mono text-text-dim uppercase tracking-widest">Explore</span>
      </div>
    </section>
  );
};

export default Hero;

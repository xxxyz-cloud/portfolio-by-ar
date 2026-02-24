import { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   CODE GREETING ENTRANCE  (helloLanguage port)
───────────────────────────────────────────── */
const codeGreetings = [
  { dot: ">_", text: "console.log('hello')" },
  { dot: "//", text: "const dev = 'Anshu Raj'" },
  { dot: "=>", text: "skills.push('Three.js', 'GSAP')" },
  { dot: "~$", text: "npm run build-something-cool" },
  { dot: "∞",  text: "while(true) { ship() }" },
  { dot: "✦",  text: "// portfolio loading..." },
];

const CodeEntrance = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  const curveRef = useRef(null);
  const roundRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    const texts = textRefs.current;

    // Sequence each greeting
    texts.forEach((el, i) => {
      const isFirst = i === 0;
      const isLast = i === texts.length - 1;
      const hold = isFirst ? 0.5 : isLast ? 0.7 : 0.1;

      if (isFirst) {
        tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.3 });
      } else {
        tl.set(el, { opacity: 1, y: 0 });
      }
      if (!isLast) tl.set(el, { opacity: 0 }, `+=${hold}`);
    });

    // Animate progress bar
    tl.to(progressRef.current, { scaleX: 1, duration: tl.duration() * 0.9, ease: "none" }, 0);

    // Slide out
    tl.to(containerRef.current, { y: "-100%", duration: 0.9, ease: "expo.inOut" }, "+=0.3")
      .to(roundRef.current, { height: 0, ease: "expo.inOut" }, "-=0.6")
      .call(() => onComplete?.(), [], "-=0.1");

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-primary"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden bg-border/20">
        <div
          ref={progressRef}
          className="h-full bg-accent origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Greeting text stack */}
      <div className="relative flex items-center justify-center">
        {codeGreetings.map((g, i) => (
          <div
            key={i}
            ref={(el) => (textRefs.current[i] = el)}
            className="absolute flex items-center gap-4 opacity-0"
            style={{ transform: "translateY(20px)" }}
          >
            <span className="font-mono text-accent text-sm tracking-widest opacity-60">
              {g.dot}
            </span>
            <span className="font-mono text-text text-lg sm:text-2xl md:text-3xl tracking-wide whitespace-nowrap">
              {g.text}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom curve wipe */}
      <div className="absolute top-full left-0 right-0 h-[20vh] overflow-hidden" ref={roundRef}>
        <div className="absolute w-[150%] h-[200%] bg-primary rounded-[50%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-full" />
      </div>

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-accent/30" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-accent-blue/30" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-accent-purple/30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-accent/30" />
    </div>
  );
};

/* ─────────────────────────────────────────────
   WATER EFFECT  (UnicornStudio)
───────────────────────────────────────────── */
const WaterEffect = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const init = () => {
      if (typeof window.UnicornStudio === "undefined") { setTimeout(init, 300); return; }
      window.UnicornStudio.addScene({
        elementId: "hero-water-effect",
        fps: 60, scale: 1,
        dpi: Math.min(window.devicePixelRatio, 2),
        lazyLoad: false,
        filePath: "/WaterEffect/effect.json",
        interactivity: { mouse: { disableMobile: true } },
      }).catch((err) => console.warn("UnicornStudio:", err));
    };
    init();
  }, []);
  return <div id="hero-water-effect" className="w-full h-full" style={{ pointerEvents: "none" }} />;
};

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
const MagneticButton = ({ children, href, variant = "primary" }) => {
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.35;
      const y = (e.clientY - top - height / 2) * 0.35;
      gsap.to(button, { x, y, duration: 0.5, ease: "power3.out" });
      gsap.to(textRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power3.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
      gsap.to(textRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const base = "group relative inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3 sm:py-4 font-display font-bold text-sm sm:text-base rounded-full overflow-hidden transition-all duration-500 will-change-transform";
  const variants = {
    primary: "bg-accent text-primary hover:shadow-2xl hover:shadow-accent/40",
    secondary: "border-2 border-accent/60 text-accent hover:text-primary hover:border-accent",
  };

  return (
    <a ref={buttonRef} href={href} className={`${base} ${variants[variant]}`}>
      <span ref={textRef} className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "secondary" && (
        <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────
   NUMBER COUNTER
───────────────────────────────────────────── */
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
            if (progress < 1) { setCount(Math.floor(end * progress)); requestAnimationFrame(animate); }
            else { setCount(end); }
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

/* ─────────────────────────────────────────────
   TECH STACK CAROUSEL
───────────────────────────────────────────── */
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
    const items = [...carousel.children];
    if (!items[0]) return;
    const totalWidth = items.reduce((acc, el) => acc + el.offsetWidth + 24, 0);
    gsap.to(carousel, {
      x: -totalWidth / 2,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % (totalWidth / 2)) },
    });
  }, []);

  const duplicatedTech = [...techStack, ...techStack];

  return (
    <div className="relative w-full overflow-hidden py-5 border-y border-border/20 bg-secondary/20 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-primary to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-primary to-transparent z-10" />
      <div ref={carouselRef} className="flex gap-6 items-center">
        {duplicatedTech.map((tech, index) => (
          <div key={`${tech.name}-${index}`} className="group flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative w-11 h-11 md:w-13 md:h-13">
              <div className="absolute inset-0 rounded-xl bg-primary/60 border border-border/60 group-hover:border-accent group-hover:scale-110 transition-all duration-300" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-accent-blue/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon icon={tech.icon} className="absolute inset-0 m-auto w-5 h-5 md:w-7 md:h-7 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-[10px] font-mono text-text-dim group-hover:text-accent transition-colors duration-300 whitespace-nowrap">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   THREE.JS SCENE
───────────────────────────────────────────── */
const ThreeScene = ({ canvasRef }) => {
  const modelRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || window.innerWidth < 768) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dl1 = new THREE.DirectionalLight(0x00ff88, 1.5); dl1.position.set(5, 5, 5); scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(0x00d4ff, 1.2); dl2.position.set(-5, 3, -5); scene.add(dl2);
    const pl = new THREE.PointLight(0xb77bff, 2, 100); pl.position.set(0, 0, 10); scene.add(pl);

    const loader = new GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.traverse((child) => {
          if (child.isMesh) { child.material.metalness = 0.9; child.material.roughness = 0.3; }
        });
        scene.add(model);
        modelRef.current = model;
      },
      undefined,
      (err) => console.error("Model error:", err)
    );

    const pgeo = new THREE.BufferGeometry();
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 20;
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0x00ff88, size: 0.025, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
    scene.add(particles);

    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationRef.current.y = mouseRef.current.x * 0.8;
      targetRotationRef.current.x = mouseRef.current.y * 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (modelRef.current) {
        modelRef.current.rotation.y += (targetRotationRef.current.y - modelRef.current.rotation.y) * 0.06;
        modelRef.current.rotation.x += (targetRotationRef.current.x - modelRef.current.rotation.x) * 0.06;
        modelRef.current.rotation.y += 0.002;
        modelRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.15;
      }
      particles.rotation.y += 0.0004;
      particles.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [canvasRef]);
  return null;
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ number, suffix, label, icon, delay = 0 }) => {
  const cardRef = useRef(null);
  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 60, opacity: 0, delay, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: cardRef.current, start: "top 90%" },
    });
  }, [delay]);

  return (
    <div ref={cardRef} className="group relative p-4 md:p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border/30 backdrop-blur-sm hover:border-accent/60 transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <Icon icon={icon} className="w-5 h-5 text-accent mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
        <div className="text-2xl md:text-3xl font-bold font-display mb-1 bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
          <NumberCounter end={parseInt(number)} suffix={suffix} />
        </div>
        <div className="text-xs font-mono text-text-dim uppercase tracking-wider">{label}</div>
      </div>
      {/* Hover scan line */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HERO — Main Component
───────────────────────────────────────────── */
const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const mainContentRef = useRef(null);
  const [entranceDone, setEntranceDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Entrance complete → animate main content in
  const handleEntranceComplete = useCallback(() => {
    setEntranceDone(true);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.set(mainContentRef.current, { visibility: "visible" })
      .from(".hero-badge", { y: -40, opacity: 0, duration: 0.6 })
      .from(".hero-name-line", { y: 120, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power4.out" }, "-=0.3")
      .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".hero-description", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hero-cta", { scale: 0.85, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.3")
      .from(".hero-stat", { y: 50, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.3")
      .from(".hero-right", { x: 80, opacity: 0, duration: 1.2, ease: "power2.out" }, 0.4)
      .from(".tech-carousel", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4");
  }, []);

  return (
    <section ref={heroRef} id="home" className="relative flex flex-col min-h-screen overflow-hidden bg-primary">
      {/* Code entrance overlay */}
      {!entranceDone && <CodeEntrance onComplete={handleEntranceComplete} />}

      {/* Ambient decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20"><div className="grid-bg w-full h-full" /></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-blue/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-accent/30" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-accent-blue/30" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-accent-purple/30" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-accent/30" />
      </div>

      {/* Water effect layer */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ mixBlendMode: "screen", opacity: 0.55 }}>
        <WaterEffect />
      </div>

      {/* Main content — invisible until entrance done */}
      <div ref={mainContentRef} className="relative z-10 flex flex-col flex-1" style={{ visibility: "hidden" }}>
        <div className="flex flex-col md:flex-row flex-1 w-full">

          {/* LEFT: Name + Info */}
          <div className="relative flex flex-col justify-center w-full md:w-1/2 px-6 sm:px-10 md:px-14 lg:px-20 pt-20 md:pt-0 pb-8 md:pb-0 min-h-[70vh] md:min-h-screen">

            <div className="hero-badge mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono text-accent uppercase tracking-wider">Available for Work</span>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <div className="overflow-hidden">
                <h1 className="hero-name-line font-display font-bold text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl leading-none text-text tracking-tight">
                  ANSHU
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-name-line font-display font-bold text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-tight"
                  style={{ background: "linear-gradient(90deg, #00ff88, #00d4ff, #b77bff)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradient 4s ease infinite" }}>
                  RAJ
                </h1>
              </div>
              <div className="mt-4 w-32 h-px bg-gradient-to-r from-accent to-transparent" />
            </div>

            <div className="hero-subtitle mb-5 md:mb-6">
              <h2 className="font-display text-base sm:text-xl md:text-xl lg:text-2xl text-text-dim">
                Full-Stack Developer <span className="text-accent">×</span> Creative Technologist
              </h2>
            </div>

            <div className="hero-description mb-8 md:mb-10 max-w-lg">
              <p className="text-sm sm:text-base lg:text-lg text-text font-light leading-relaxed">
                Crafting{" "}<span className="text-accent font-medium neon-text">pixel-perfect</span>{" "}
                experiences at the intersection of{" "}<span className="text-accent-blue font-medium neon-text-blue">engineering</span>{" "}
                and{" "}<span className="text-accent-purple font-medium">artistry</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12">
              <div className="hero-cta">
                <MagneticButton href="#work" variant="primary">
                  View Projects <Icon icon="lucide:arrow-right" className="group-hover:translate-x-1 transition-transform duration-300" />
                </MagneticButton>
              </div>
              <div className="hero-cta">
                <MagneticButton href="#contact" variant="secondary">
                  Get In Touch <Icon icon="lucide:sparkles" className="group-hover:rotate-12 transition-transform duration-300" />
                </MagneticButton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-lg">
              <div className="hero-stat"><StatCard number="500" suffix="+" label="Problems Solved" icon="lucide:code-2" delay={0} /></div>
              <div className="hero-stat"><StatCard number="20" suffix="+" label="Live Projects" icon="lucide:rocket" delay={0.1} /></div>
            </div>
          </div>

          {/* RIGHT: 3D Helmet Canvas */}
          <div className="hero-right relative hidden md:flex items-center justify-center w-full md:w-1/2 min-h-screen">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] rounded-full border border-accent/10 animate-spin" style={{ animationDuration: "25s" }} />
              <div className="absolute w-[340px] h-[340px] rounded-full border border-accent-blue/10 animate-spin" style={{ animationDuration: "18s", animationDirection: "reverse" }} />
              <div className="absolute w-[200px] h-[200px] rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute w-[300px] h-[300px] rounded-full bg-accent-blue/8 blur-3xl" />
            </div>
            <canvas ref={canvasRef} className="w-full h-full opacity-90" />
            <ThreeScene canvasRef={canvasRef} />
          </div>
        </div>

        {/* Tech carousel */}
        <div className="tech-carousel relative z-10"><TechStackCarousel /></div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20 pointer-events-none">
        <div className="w-5 h-9 border-2 border-accent rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Explore</span>
      </div>
    </section>
  );
};

export default Hero;

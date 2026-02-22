import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   Unicorn Studio Water Effect — full-hero background layer
   effect.json background must be pure black (vec3(0,0,0)) so that
   mix-blend-mode: screen renders it fully transparent.
   Only the shimmering water caustic highlights will be visible.

   Requires UnicornStudio loaded in index.html:
   <script src="https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js"></script>
   effect.json at /WaterEffect/effect.json
───────────────────────────────────────────────────────────────── */
const WaterEffect = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const init = () => {
      if (typeof window.UnicornStudio === "undefined") {
        setTimeout(init, 300);
        return;
      }
      window.UnicornStudio.addScene({
        elementId: "hero-water-effect",
        fps: 60,
        scale: 1,
        dpi: Math.min(window.devicePixelRatio, 2),
        lazyLoad: false,
        filePath: "/WaterEffect/effect.json",
        interactivity: {
          mouse: { disableMobile: true },
        },
      }).catch((err) => console.warn("UnicornStudio:", err));
    };
    init();
  }, []);

  return (
    <div
      id="hero-water-effect"
      className="w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────
   Magnetic CTA Button
───────────────────────────────────────────────────────────────── */
const MagneticButton = ({ children, href, variant = "primary" }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.3;
      const y = (e.clientY - top - height / 2) * 0.3;
      gsap.to(button, { x, y, duration: 0.4, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const base =
    "group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-display font-bold text-sm sm:text-base rounded-full overflow-hidden transition-all duration-500";
  const variants = {
    primary: "bg-accent text-primary hover:shadow-2xl hover:shadow-accent/50",
    secondary: "border-2 border-accent text-accent hover:text-primary",
  };

  return (
    <a ref={buttonRef} href={href} className={`${base} ${variants[variant]}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "secondary" && (
        <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Number Counter
───────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────
   Tech Stack Carousel
───────────────────────────────────────────────────────────────── */
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
        x: gsap.utils.unitize((x) => parseFloat(x) % (totalWidth / 2)),
      },
    });
  }, []);

  const duplicatedTech = [...techStack, ...techStack];

  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-border/20 bg-secondary/30 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-secondary via-secondary/90 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-secondary via-secondary/90 to-transparent z-10" />
      <div ref={carouselRef} className="flex gap-6 items-center">
        {duplicatedTech.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="group flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14">
              <div className="absolute inset-0 rounded-xl bg-primary/60 border border-border/60 group-hover:border-accent transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-accent-blue/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon icon={tech.icon} className="absolute inset-0 m-auto w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="text-[10px] md:text-xs font-mono text-text-dim group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Three.js Scene — 3D Helmet + Particles
───────────────────────────────────────────────────────────────── */
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
    const dl1 = new THREE.DirectionalLight(0x00ff88, 1.5);
    dl1.position.set(5, 5, 5);
    scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(0x00d4ff, 1.2);
    dl2.position.set(-5, 3, -5);
    scene.add(dl2);
    const pl = new THREE.PointLight(0xb77bff, 2, 100);
    pl.position.set(0, 0, 10);
    scene.add(pl);

    const loader = new GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.set(0, 0, 0);
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
      (err) => console.error("Model error:", err)
    );

    const pgeo = new THREE.BufferGeometry();
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 20;
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
      pgeo,
      new THREE.PointsMaterial({ color: 0x00ff88, size: 0.025, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
    );
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
        modelRef.current.rotation.y += (targetRotationRef.current.y - modelRef.current.rotation.y) * 0.08;
        modelRef.current.rotation.x += (targetRotationRef.current.x - modelRef.current.rotation.x) * 0.08;
        modelRef.current.rotation.y += 0.002;
        modelRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.15;
      }
      particles.rotation.y += 0.0005;
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

/* ─────────────────────────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────────────────────────── */
const StatCard = ({ number, suffix, label, icon, delay = 0 }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 60,
      opacity: 0,
      delay,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: cardRef.current, start: "top 90%" },
    });
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="group relative p-4 md:p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border/30 backdrop-blur-sm hover:border-accent/50 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <Icon icon={icon} className="w-5 h-5 text-accent mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
        <div className="text-2xl md:text-3xl font-bold font-display mb-1 bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
          <NumberCounter end={parseInt(number)} suffix={suffix} />
        </div>
        <div className="text-xs font-mono text-text-dim uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   HERO — Main Component
   Layout (desktop): LEFT = name + info | RIGHT = 3D helmet
   Layout (mobile):  stacked, helmet hidden
   Water effect:     full-hero, screen blend — black = transparent,
                     only liquid caustic highlights float over content
───────────────────────────────────────────────────────────────── */
const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { y: -40, opacity: 0, duration: 0.6 })
        .from(".hero-name-line", { y: 100, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out" }, "-=0.3")
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-description", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-cta", { scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".hero-stat", { y: 50, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.3")
        .from(".hero-right", { x: 80, opacity: 0, duration: 1.2, ease: "power2.out" }, 0.2)
        .from(".tech-carousel", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex flex-col min-h-screen overflow-hidden bg-primary"
    >
      {/* ── Layer 1: Static ambient decorations (lowest) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <div className="grid-bg w-full h-full" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-blue/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-purple/10 rounded-full blur-3xl animate-pulse" />
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-accent/30" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-accent-blue/30" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-accent-purple/30" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-accent/30" />
      </div>

      {/* ── Layer 2: Full-hero water ripple effect ──────────────────
          mix-blend-mode: screen means:
            • Pure black pixels  → fully transparent (invisible)
            • Bright caustics    → add light on top of everything below
          This means the water shimmer floats seamlessly over your
          text, stats, 3D model — no color box, no clipping.
      ──────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ mixBlendMode: "screen", opacity: 0.55 }}
      >
        <WaterEffect />
      </div>

      {/* ── Layer 3: All hero content (above water effect) ── */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Split layout */}
        <div className="flex flex-col md:flex-row flex-1 w-full max-w-none">

          {/* ── LEFT: Name + Info ── */}
          <div className="relative flex flex-col justify-center w-full md:w-1/2 px-6 sm:px-10 md:px-14 lg:px-20 pt-20 md:pt-0 pb-8 md:pb-0 min-h-[70vh] md:min-h-screen">

            {/* Available badge */}
            <div className="hero-badge mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono text-accent uppercase tracking-wider">Available for Work</span>
              </div>
            </div>

            {/* Name block — no wrapper box, water effect flows over it from the hero layer */}
            <div className="mb-6 md:mb-8">
              <div className="overflow-hidden">
                <h1 className="hero-name-line font-display font-bold text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl leading-none text-text tracking-tight">
                  ANSHU
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1
                  className="hero-name-line font-display font-bold text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-tight"
                  style={{
                    background: "linear-gradient(90deg, #00ff88, #00d4ff, #b77bff)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradient 4s ease infinite",
                  }}
                >
                  RAJ
                </h1>
              </div>
              {/* Thin accent line under name */}
              <div className="mt-4 w-32 h-px bg-gradient-to-r from-accent to-transparent" />
            </div>

            {/* Subtitle */}
            <div className="hero-subtitle mb-5 md:mb-6">
              <h2 className="font-display text-base sm:text-xl md:text-xl lg:text-2xl text-text-dim">
                Full-Stack Developer <span className="text-accent">×</span> Creative Technologist
              </h2>
            </div>

            {/* Description */}
            <div className="hero-description mb-8 md:mb-10 max-w-lg">
              <p className="text-sm sm:text-base md:text-base lg:text-lg text-text font-light leading-relaxed">
                Crafting{" "}
                <span className="text-accent font-medium neon-text">pixel-perfect</span>{" "}
                experiences at the intersection of{" "}
                <span className="text-accent-blue font-medium neon-text-blue">engineering</span>{" "}
                and{" "}
                <span className="text-accent-purple font-medium">artistry</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12">
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

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              <div className="hero-stat"><StatCard number="500" suffix="+" label="Problems Solved" icon="lucide:code-2" delay={0} /></div>
              <div className="hero-stat"><StatCard number="20" suffix="+" label="Live Projects" icon="lucide:rocket" delay={0.1} /></div>
            </div>
          </div>

          {/* ── RIGHT: 3D Helmet Canvas (desktop only) ── */}
          <div className="hero-right relative hidden md:flex items-center justify-center w-full md:w-1/2 min-h-screen">
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[420px] h-[420px] rounded-full border border-accent/10 animate-spin"
                style={{ animationDuration: "25s" }}
              />
              <div
                className="absolute w-[340px] h-[340px] rounded-full border border-accent-blue/10 animate-spin"
                style={{ animationDuration: "18s", animationDirection: "reverse" }}
              />
              <div className="absolute w-[200px] h-[200px] rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute w-[300px] h-[300px] rounded-full bg-accent-blue/8 blur-3xl" />
            </div>

            {/* Floating tech labels */}
            <div className="absolute top-1/4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono text-text-dim uppercase tracking-widest">Three.js</span>
            </div>
            <div className="absolute bottom-1/3 right-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" style={{ animationDelay: "0.5s" }} />
              <span className="text-xs font-mono text-text-dim uppercase tracking-widest">WebGL</span>
            </div>
            <div className="absolute top-1/3 right-8 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" style={{ animationDelay: "1s" }} />
              <span className="text-xs font-mono text-text-dim uppercase tracking-widest">GSAP</span>
            </div>

            {/* Three.js Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full opacity-90"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            <ThreeScene canvasRef={canvasRef} />
          </div>
        </div>

        {/* ── Tech Stack Carousel ── */}
        <div className="tech-carousel relative z-10">
          <TechStackCarousel />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
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

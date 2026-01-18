import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = ({ canvasRef }) => {
  const modelRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!canvasRef.current || window.innerWidth < 768) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0x00ff88, 1.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x00d4ff, 1.2);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xb77bff, 0.8);
    light3.position.set(0, 5, -5);
    scene.add(light3);

    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color(0x00ff88);
    const color2 = new THREE.Color(0x00d4ff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const loader = new GLTFLoader();
    loader.load(
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.set(window.innerWidth > 1024 ? 4 : 2, 0, 0);
        
        scene.add(model);
        modelRef.current = model;
      },
      undefined,
      () => {
        const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
        const material = new THREE.MeshStandardMaterial({
          color: 0x00ff88,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x00ff88,
          emissiveIntensity: 0.3
        });
        const fallback = new THREE.Mesh(geometry, material);
        fallback.position.set(window.innerWidth > 1024 ? 4 : 2, 0, 0);
        scene.add(fallback);
        modelRef.current = fallback;
      }
    );

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      rotationRef.current.targetY = mouseRef.current.targetX * Math.PI * 0.12;
      rotationRef.current.targetX = mouseRef.current.targetY * Math.PI * 0.06;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      rotationRef.current.x += (rotationRef.current.targetX - rotationRef.current.x) * 0.05;
      rotationRef.current.y += (rotationRef.current.targetY - rotationRef.current.y) * 0.05;

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.004;
        modelRef.current.rotation.x = rotationRef.current.x * 0.5;
        modelRef.current.rotation.y += rotationRef.current.y * 0.3;
        modelRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.15;
        const scale = 1 + Math.sin(Date.now() * 0.0012) * 0.03;
        const baseScale = window.innerWidth > 1024 ? 2.2 : 1.8;
        modelRef.current.scale.setScalar(scale * baseScale / 2);
      }

      particleSystem.rotation.y += 0.0003;
      particleSystem.rotation.x = mouseRef.current.y * 0.1;

      camera.position.x = mouseRef.current.x * 0.2;
      camera.position.y = mouseRef.current.y * 0.2;
      camera.lookAt(window.innerWidth > 1024 ? 4 : 2, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return null;
};

const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const canvasRef = useRef(null);
  const [displayedText, setDisplayedText] = useState("");
  
  const fullText = "< Crafting Digital Experiences />";

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 60);
    return () => clearInterval(typing);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-line", {
        y: 120,
        opacity: 0,
        stagger: 0.15,
        duration: 1.4,
        ease: "power4.out"
      })
      .from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: 1,
      }, "-=0.9")
      .from(".hero-desc-line", {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      }, "-=0.7")
      .from(".hero-cta", {
        scale: 0.9,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
      }, "-=0.5")
      .from(".hero-stat", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      }, "-=0.6");

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
      className="relative flex items-center min-h-screen overflow-hidden bg-primary"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-50 pointer-events-none hidden md:block"
      />
      <ThreeScene canvasRef={canvasRef} />

      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 grid-bg" />
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-accent-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/15 rounded-full blur-3xl animate-float" />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-accent/30 rotate-45 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-accent-blue/30 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-40 w-40 h-40 border-2 border-accent-purple/30 -rotate-12 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 right-40 w-20 h-20 border-2 border-accent/30 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-4xl">
          <div className="mb-6 md:mb-8">
            <p className="font-mono text-xs md:text-sm text-accent flex items-center gap-2">
              {displayedText}
              <span className="inline-block w-1.5 h-4 bg-accent animate-pulse" />
            </p>
          </div>

          <div ref={titleRef} className="mb-8 md:mb-10 overflow-hidden">
            <div className="hero-line">
              <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none text-text mb-2 md:mb-3">
                ANSHU
              </h1>
            </div>
            <div className="hero-line">
              <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none bg-gradient-to-r from-accent via-accent-blue to-accent-purple bg-clip-text text-transparent">
                RAJ
              </h1>
            </div>
          </div>

          <div className="hero-subtitle mb-8 md:mb-10">
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-dim flex flex-wrap items-center gap-2 md:gap-3">
              Full-Stack Developer
              <span className="text-accent text-2xl md:text-3xl">×</span>
              Creative Coder
            </h2>
          </div>

          <div className="mb-10 md:mb-12 space-y-2 max-w-2xl">
            <p className="hero-desc-line text-base md:text-lg lg:text-xl text-text-dim font-light">
              Building <span className="text-accent font-medium">animation-rich</span> web experiences that merge
            </p>
            <p className="hero-desc-line text-base md:text-lg lg:text-xl text-text-dim font-light">
              <span className="text-accent-blue font-medium">technical precision</span> with{" "}
              <span className="text-accent-purple font-medium">creative vision</span>
            </p>
            <p className="hero-desc-line text-base md:text-lg lg:text-xl text-text font-light mt-4 md:mt-6">
              500+ problems solved • 20+ projects deployed
            </p>
          </div>

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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-4xl">
            {[
              { number: "500+", label: "DSA Solved", icon: "lucide:code", color: "accent" },
              { number: "20+", label: "Projects", icon: "lucide:rocket", color: "accent-blue" },
              { number: "50+", label: "Users", icon: "lucide:users", color: "accent-purple" },
              { number: "60fps", label: "Performance", icon: "lucide:zap", color: "accent" },
            ].map((stat, index) => (
              <div
                key={index}
                className="hero-stat group relative p-5 md:p-6 rounded-xl bg-secondary/80 border border-border backdrop-blur-sm hover:border-accent transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative">
                  <Icon icon={stat.icon} className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color} mb-2 md:mb-3`} />
                  <div className={`text-2xl md:text-3xl font-bold text-${stat.color} font-display mb-1`}>
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
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-mono text-text-dim uppercase tracking-widest">Scroll</span>
      </div>

      <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 border-t-4 border-l-4 border-accent/30" />
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 border-t-4 border-r-4 border-accent-blue/30" />
      <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 border-b-4 border-l-4 border-accent-purple/30" />
      <div className="absolute bottom-0 right-0 w-24 md:w-32 h-24 md:h-32 border-b-4 border-r-4 border-accent/30" />
    </section>
  );
};

export default Hero;
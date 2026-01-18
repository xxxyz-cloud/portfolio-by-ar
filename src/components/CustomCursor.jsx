import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorColor, setCursorColor] = useState('#00ff88'); // Default accent color

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    let animationFrameId;

    // Define color scheme for each section
    const sectionColors = {
      'home': '#00ff88',        // accent (green)
      'services': '#00d4ff',    // accent-blue
      'about': '#b77bff',       // accent-purple
      'work': '#00ff88',        // accent (green)
      'contact': '#00d4ff',     // accent-blue
    };

    // Set up scroll-triggered color changes
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      const sectionId = section.id;
      const color = sectionColors[sectionId] || '#00ff88';

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCursorColor(color),
        onEnterBack: () => setCursorColor(color),
      });
    });

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Smooth follow with easing
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.2;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.2;
      
      gsap.set(cursor, {
        x: cursorPos.current.x,
        y: cursorPos.current.y,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseEnterInteractive = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
        gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onMouseLeaveInteractive = () => {
      setIsHovering(false);
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnterInteractive, true);
    document.body.addEventListener('mouseleave', onMouseLeaveInteractive, true);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnterInteractive, true);
      document.body.removeEventListener('mouseleave', onMouseLeaveInteractive, true);
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] transition-opacity duration-300 mix-blend-difference"
      style={{ 
        transform: 'translate(-50%, -50%)',
        opacity: isHovering ? 1 : 0.9,
      }}
    >
      {/* Arrow cursor shape */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300"
        style={{ filter: `drop-shadow(0 0 8px ${cursorColor})` }}
      >
        {/* Main arrow path */}
        <path
          d="M3 3L10.5 20.5L13.5 13.5L20.5 10.5L3 3Z"
          fill={cursorColor}
          stroke={cursorColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        {/* Inner glow effect */}
        <path
          d="M3 3L10.5 20.5L13.5 13.5L20.5 10.5L3 3Z"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>

      {/* Hover state ring */}
      {isHovering && (
        <div
          className="absolute inset-0 -m-2 rounded-full border-2 animate-pulse"
          style={{ borderColor: cursorColor, opacity: 0.3 }}
        />
      )}
    </div>
  );
};

export default CustomCursor;
import { Icon } from "@iconify/react/dist/iconify.js";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(Observer);

const Marquee = ({
  items,
  className = "text-white bg-black",
  icon = "mdi:star-four-points",
  iconClassName = "",
  reverse = false,
}) => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const [isReady, setIsReady] = useState(false);
  
  // Duplicate items for seamless loop - triple the items
  const duplicatedItems = [...items, ...items, ...items];

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || itemsRef.current.length === 0) return;

    const elements = itemsRef.current.filter(Boolean);
    if (elements.length === 0) return;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" },
    });

    // Calculate total width
    let totalWidth = 0;
    elements.forEach(el => {
      totalWidth += el.offsetWidth;
    });

    // Set initial position
    gsap.set(elements, { x: 0 });

    // Animate from 0 to -totalWidth/3 (since we tripled the items)
    const animDuration = totalWidth / 3 / 50; // 50px per second
    
    tl.to(elements, {
      x: reverse ? `+=${totalWidth / 3}` : `-=${totalWidth / 3}`,
      duration: animDuration,
      ease: "none",
      modifiers: {
        x: gsap.utils.unitize(x => {
          const distance = totalWidth / 3;
          return reverse 
            ? (parseFloat(x) % distance)
            : ((parseFloat(x) % -distance) - distance) % -distance;
        })
      }
    });

    // Observer for scroll interaction
    const observer = Observer.create({
      onChangeY(self) {
        let factor = 2.5;
        if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
          factor *= -1;
        }
        gsap.timeline({ defaults: { ease: "none" } })
          .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });

    return () => {
      tl.kill();
      observer.kill();
    };
  }, [isReady, reverse, duplicatedItems.length]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full h-20 md:h-[100px] flex items-center marquee-text-responsive font-light uppercase relative ${className}`}
    >
      <div className="flex absolute left-0 top-0 h-full items-center whitespace-nowrap will-change-transform">
        {duplicatedItems.map((text, index) => (
          <span
            key={`${text}-${index}`}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="flex items-center px-8 md:px-16 gap-x-16 md:gap-x-32 flex-shrink-0"
          >
            {text} <Icon icon={icon} className={`${iconClassName} flex-shrink-0`} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
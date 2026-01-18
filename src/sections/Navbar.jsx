import React, { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const tl = useRef(null);
  const iconTl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  useGSAP(() => {
    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([linksRef.current, contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, {
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        linksRef.current,
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.2"
      );

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: -3.3,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();
      iconTl.current.reverse();
    } else {
      tl.current.play();
      iconTl.current.play();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-6 sm:px-8 md:px-10 uppercase bg-secondary/95 backdrop-blur-xl text-text py-20 sm:py-24 md:py-28 gap-y-6 sm:gap-y-8 md:gap-y-10 md:w-3/4 lg:w-2/3 xl:w-1/2 md:left-auto md:right-0 border-l border-accent/20 overflow-y-auto"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid-bg w-full h-full" />
        </div>
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold">
            <span className="text-accent">Anshu</span> Raj
          </h2>
          <p className="text-xs sm:text-sm font-mono text-text-dim mt-1">Full-Stack Developer</p>
        </div>

        <div className="relative flex flex-col text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gap-y-3 sm:gap-y-4 font-display">
          {["home", "services", "about", "work", "contact"].map(
            (section, index) => (
              <div 
                key={index} 
                ref={(el) => (linksRef.current[index] = el)}
                className="group relative"
              >
                <Link
                  className="relative cursor-pointer transition-all duration-300 hover:text-accent inline-block"
                  to={`${section}`}
                  smooth
                  offset={0}
                  duration={2000}
                  onClick={toggleMenu}
                >
                  <span className="relative z-10">{section}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            )
          )}
        </div>

        <div
          ref={contactRef}
          className="relative flex flex-col gap-6 sm:gap-8"
        >
          <div className="font-light">
            <p className="tracking-wider text-text-dim uppercase text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Icon icon="lucide:mail" className="text-accent" />
              E-mail
            </p>
            <a
              href="mailto:rajanshu2123@gmail.com"
              className="text-sm sm:text-base md:text-lg tracking-widest lowercase hover:text-accent transition-colors duration-300 font-mono break-all"
            >
              rajanshu2123@gmail.com
            </a>
          </div>
          <div className="font-light">
            <p className="tracking-wider text-text-dim uppercase text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Icon icon="lucide:share-2" className="text-accent-blue" />
              Connect
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-2">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm leading-loose tracking-widest uppercase hover:text-accent-blue transition-colors duration-300 font-mono group inline-flex items-center gap-1"
                >
                  {social.name}
                  <Icon icon="lucide:external-link" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative text-xs font-mono text-text-dim">
          <p>© 2025 Anshu Raj</p>
          <p className="mt-1">Available for freelance & full-time opportunities</p>
        </div>
      </nav>

      <div
        className="fixed z-50 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 bg-accent rounded-full cursor-pointer w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 top-4 right-4 sm:top-6 sm:right-6 md:right-10 shadow-lg hover:shadow-accent/50 hover:scale-110 border-2 border-primary"
        onClick={toggleMenu}
        style={
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" }
            : { clipPath: "circle(0% at 50% 50%)" }
        }
      >
        <span
          ref={topLineRef}
          className="block w-6 sm:w-7 md:w-8 h-0.5 bg-primary rounded-full origin-center"
        ></span>
        <span
          ref={bottomLineRef}
          className="block w-6 sm:w-7 md:w-8 h-0.5 bg-primary rounded-full origin-center"
        ></span>
      </div>
    </>
  );
};

export default Navbar;
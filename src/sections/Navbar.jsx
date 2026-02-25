import React, { useEffect, useRef, useState, useCallback } from "react";
import { socials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";
import { Icon } from "@iconify/react/dist/iconify.js";

const PRIMARY_LINKS = [
  { label: "Home",     to: "home",     num: "01", tag: "Start" },
  { label: "Services", to: "services", num: "02", tag: "What I do" },
  { label: "About",    to: "about",    num: "03", tag: "Who I am" },
  { label: "Work",     to: "work",     num: "04", tag: "Projects" },
  { label: "Contact",  to: "contact",  num: "05", tag: "Let's talk" },
];

const Navbar = () => {
  const overlayRef    = useRef(null);
  const leftPanelRef  = useRef(null);
  const rightPanelRef = useRef(null);
  const linksRef      = useRef([]);
  const secondaryRef  = useRef([]);
  const footerLeftRef = useRef(null);
  const footerRightRef= useRef(null);
  const rightTagsRef  = useRef([]);
  const burgerRef     = useRef(null);
  const topLineRef    = useRef(null);
  const midLineRef    = useRef(null);
  const botLineRef    = useRef(null);
  const blobTl        = useRef(null);
  const cursorRef     = useRef(null);
  const isAnimating   = useRef(false);
  const verticalTextRef = useRef(null);
  const availRef      = useRef(null);
  const scanRef       = useRef(null);

  const [isOpen,      setIsOpen]      = useState(false);
  const [showBurger,  setShowBurger]  = useState(true);
  const [hoveredIdx,  setHoveredIdx]  = useState(null);

  useGSAP(() => {
    blobTl.current = gsap.timeline({ repeat: -1, yoyo: true })
      .to(burgerRef.current, { borderRadius: "63% 37% 53% 47% / 63% 59% 41% 37%", duration: 2.4, ease: "sine.inOut" })
      .to(burgerRef.current, { borderRadius: "37% 63% 47% 53% / 37% 41% 59% 63%", duration: 2.0, ease: "sine.inOut" });

    gsap.set([topLineRef.current, midLineRef.current, botLineRef.current], { transformOrigin: "center center" });

    gsap.set(leftPanelRef.current,  { clipPath: "inset(0 100% 0 0)" });
    gsap.set(rightPanelRef.current, { clipPath: "inset(0 0 0 100%)" });
    gsap.set(overlayRef.current,    { display: "none" });

    gsap.set([...linksRef.current, footerLeftRef.current, footerRightRef.current, verticalTextRef.current, availRef.current], { opacity: 0 });
    gsap.set(rightTagsRef.current,  { opacity: 0 });
    gsap.set(secondaryRef.current,  { opacity: 0 });
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const fn = () => {
      const cur = window.scrollY;
      setShowBurger(cur <= lastY || cur < 60);
      lastY = cur;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const dot = cursorRef.current;
    if (!dot) return;
    const fn = (e) => {
      if (!isOpen) return;
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [isOpen]);

  const openMenu = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    blobTl.current.pause();
    setIsOpen(true);
    gsap.set(overlayRef.current, { display: "flex" });

    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });

    tl
      .to(burgerRef.current, { scale: 1.1, duration: 0.16, ease: "power2.out" })
      .to(burgerRef.current, { scale: 1,   duration: 0.12, ease: "power2.in"  })
      .to(midLineRef.current, { scaleX: 0, opacity: 0, duration: 0.15, ease: "power2.in" }, "<")
      .to(topLineRef.current, { rotate: 45,  y:  5.5, duration: 0.26, ease: "power2.inOut" }, ">")
      .to(botLineRef.current, { rotate: -45, y: -5.5, duration: 0.26, ease: "power2.inOut" }, "<")
      .to([topLineRef.current, botLineRef.current], { background: "#00ff88", duration: 0.08 }, "<")
      .to(leftPanelRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.78, ease: "power4.inOut" }, "-=0.18")
      .to(rightPanelRef.current, { clipPath: "inset(0 0 0 0%)", duration: 0.78, ease: "power4.inOut" }, "<+0.08")
      .fromTo(linksRef.current, { y: "105%", opacity: 0 }, { y: "0%", opacity: 1, stagger: 0.065, duration: 0.55, ease: "power3.out" }, "-=0.32")
      .fromTo(rightTagsRef.current, { x: 18, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.065, duration: 0.4, ease: "power2.out" }, "<+0.1")
      .fromTo(verticalTextRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.3")
      .fromTo(secondaryRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.34, ease: "power2.out" }, "-=0.3")
      .fromTo([footerLeftRef.current, footerRightRef.current, availRef.current], { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" }, "<");
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpen(false);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current,    { display: "none" });
        gsap.set(leftPanelRef.current,  { clipPath: "inset(0 100% 0 0)" });
        gsap.set(rightPanelRef.current, { clipPath: "inset(0 0 0 100%)" });
        gsap.set([...linksRef.current, ...rightTagsRef.current, ...secondaryRef.current,
          footerLeftRef.current, footerRightRef.current, verticalTextRef.current, availRef.current
        ], { opacity: 0 });
        blobTl.current.resume();
        isAnimating.current = false;
      },
    });

    tl
      .to([...linksRef.current, ...rightTagsRef.current, ...secondaryRef.current,
           footerLeftRef.current, footerRightRef.current, verticalTextRef.current, availRef.current], {
        opacity: 0, y: -10, stagger: 0.02, duration: 0.2, ease: "power2.in",
      })
      .to(rightPanelRef.current, { clipPath: "inset(0 0 0 100%)", duration: 0.6, ease: "power4.inOut" }, "-=0.05")
      .to(leftPanelRef.current,  { clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: "power4.inOut" }, "<+0.06")
      .to(topLineRef.current, { rotate: 0, y: 0, duration: 0.24, ease: "power2.inOut" }, "-=0.35")
      .to(botLineRef.current, { rotate: 0, y: 0, duration: 0.24, ease: "power2.inOut" }, "<")
      .to([topLineRef.current, botLineRef.current], { background: "#e5e5e5", duration: 0.08 }, "<")
      .to(midLineRef.current, { scaleX: 1, opacity: 1, duration: 0.2, ease: "power2.out" }, ">-0.06");
  }, []);

  const toggleMenu = useCallback(() => {
    isOpen ? closeMenu() : openMenu();
  }, [isOpen, openMenu, closeMenu]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        /* ── Burger ── */
        .nb-burger {
          position: fixed;
          top: clamp(16px,3vw,28px);
          right: clamp(16px,3vw,28px);
          z-index: 9000;
          width: clamp(52px,6vw,70px);
          height: clamp(52px,6vw,70px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px; cursor: pointer;
          border-radius: 46% 54% 49% 51% / 44% 48% 52% 56%;
          border: 1px solid rgba(0,255,136,0.18);
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(14px);
          transition: clip-path 0.42s cubic-bezier(0.4,0,0.2,1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .nb-burger:hover {
          border-color: rgba(0,255,136,0.6);
          background: rgba(10,10,10,0.85);
          box-shadow: 0 0 20px rgba(0,255,136,0.12), inset 0 0 20px rgba(0,255,136,0.04);
        }
        .nb-burger.open  {
          border-color: rgba(0,255,136,0.25);
          background: rgba(10,10,10,0.5);
          backdrop-filter: blur(0px);
        }
        .nb-burger .ln {
          display: block;
          width: clamp(20px,2.2vw,26px);
          height: 1.5px;
          background: #e5e5e5;
          border-radius: 99px;
          transform-origin: center;
        }

        /* ── Overlay ── */
        .nb-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; cursor: none;
        }

        /* ── Grid pattern for right panel ── */
        .nb-grid-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── Left panel ── */
        .nb-left {
          width: 58%;
          background: #080808;
          display: flex; flex-direction: column;
          padding: clamp(24px,4vw,56px);
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(0,255,136,0.08);
        }
        /* Scanline effect on left panel */
        .nb-left::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0,255,136,0.015) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 0;
        }
        .nb-left::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(0,255,136,0.05), transparent);
          pointer-events: none;
        }

        /* ── Right panel ── */
        .nb-right {
          width: 42%;
          background: #0d0d0d;
          display: flex; flex-direction: column;
          padding: clamp(24px,4vw,56px);
          position: relative;
          overflow: hidden;
        }
        /* Subtle right glow */
        .nb-right::after {
          content: "";
          position: absolute;
          top: 0; right: 0;
          width: 60%;
          height: 50%;
          background: radial-gradient(ellipse at top right, rgba(0,212,255,0.04), transparent 70%);
          pointer-events: none;
        }

        /* ── Top bars ── */
        .nb-topbar {
          display: flex; justify-content: space-between; align-items: center;
          padding-bottom: clamp(14px,2vw,24px);
          margin-bottom: 0;
          position: relative; z-index: 1;
        }
        .nb-topbar-label {
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
        }

        /* ── Nav links ── */
        .nb-links { display: flex; flex-direction: column; margin: auto 0; position: relative; z-index: 1; }
        .nb-link-wrap { overflow: hidden; line-height: 1; }
        .nb-link-inner { transform: translateY(105%); opacity: 0; }
        .nb-link-row {
          display: flex; align-items: baseline; gap: clamp(8px,1vw,16px);
          text-decoration: none; cursor: none;
        }
        .nb-link-num {
          font-family: monospace;
          font-size: clamp(9px,0.85vw,11px);
          letter-spacing: 0.24em;
          color: rgba(0,255,136,0.2);
          min-width: 2.5ch;
          transition: color 0.2s ease;
        }
        .nb-link-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem,8vw,8rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 0.9;
          color: rgba(229,229,229,0.75);
          display: block;
          transition:
            color 0.22s ease,
            opacity 0.22s ease,
            text-shadow 0.22s ease;
        }
        .nb-link-arrow {
          font-size: clamp(0.9rem,1.6vw,1.6rem);
          color: #00ff88;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        /* Hover states */
        .nb-link-wrap:hover .nb-link-label {
          color: #00ff88;
          text-shadow:
            0 0 30px rgba(0,255,136,0.6),
            0 0 80px rgba(0,255,136,0.25),
            0 0 120px rgba(0,255,136,0.1);
          opacity: 1 !important;
        }
        .nb-link-wrap:hover .nb-link-num   { color: #00ff88; }
        .nb-link-wrap:hover .nb-link-arrow { opacity: 1; transform: translateX(0); }

        /* Dim siblings */
        .nb-links:has(.nb-link-wrap:hover) .nb-link-wrap:not(:hover) .nb-link-label {
          opacity: 0.12;
          color: rgba(229,229,229,0.5);
          text-shadow: none;
        }
        .nb-links:has(.nb-link-wrap:hover) .nb-link-wrap:not(:hover) .nb-link-num {
          color: rgba(0,255,136,0.08);
        }

        /* ── Right tags ── */
        .nb-tag-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: clamp(10px,1.5vh,18px);
          opacity: 0;
          position: relative; z-index: 1;
        }
        .nb-tag-num {
          font-family: monospace; font-size: 9px;
          letter-spacing: 0.3em; color: rgba(0,255,136,0.2);
        }
        .nb-tag-label {
          font-family: monospace; font-size: clamp(10px,1vw,12px);
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(229,229,229,0.25);
        }
        .nb-tag-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(0,255,136,0.2); flex-shrink: 0;
        }

        /* ── Vertical text ── */
        .nb-vertical {
          position: absolute;
          right: clamp(14px,2vw,28px);
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          transform-origin: center center;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(0,255,136,0.15);
          white-space: nowrap;
          opacity: 0;
          z-index: 1;
        }

        /* ── Footer ── */
        .nb-footer-left {
          border-top: 1px solid rgba(0,255,136,0.08);
          padding-top: clamp(12px,2vh,20px);
          margin-top: auto;
          opacity: 0;
          position: relative; z-index: 1;
        }
        .nb-footer-right {
          border-top: 1px solid rgba(0,212,255,0.08);
          padding-top: clamp(12px,2vh,20px);
          margin-top: auto;
          opacity: 0;
          position: relative; z-index: 1;
        }
        .nb-footer-label {
          font-family: monospace; font-size: 10px;
          letter-spacing: 0.34em; text-transform: uppercase;
          display: block; margin-bottom: 8px;
        }
        .nb-sec-link {
          font-family: monospace;
          font-size: clamp(9px,0.95vw,11px);
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 3px;
          cursor: none;
          transition: color 0.2s ease, text-shadow 0.2s ease;
        }

        /* ── Avail badge ── */
        .nb-avail {
          display: inline-flex; align-items: center; gap: 8px;
          opacity: 0; position: relative; z-index: 1;
        }
        .nb-avail-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 8px rgba(0,255,136,0.8);
          animation: nb-pulse 2s ease-in-out infinite;
        }
        @keyframes nb-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.8); }
        }
        .nb-avail-text {
          font-family: monospace; font-size: 10px;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(0,255,136,0.5);
        }

        /* ── Divider neon line ── */
        .nb-divider-line {
          position: absolute;
          top: 0; bottom: 0;
          left: 58%;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,255,136,0.3) 20%,
            rgba(0,212,255,0.3) 50%,
            rgba(183,123,255,0.2) 80%,
            transparent 100%
          );
          z-index: 10;
          box-shadow: 0 0 8px rgba(0,255,136,0.08);
        }
      `}</style>

      {/* Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed", pointerEvents: "none", zIndex: 9999,
          width: 7, height: 7, borderRadius: "50%",
          background: "#00ff88",
          transform: "translate(-50%,-50%)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.28s ease",
          boxShadow: "0 0 10px rgba(0,255,136,0.9), 0 0 20px rgba(0,255,136,0.4)",
        }}
      />

      {/* Overlay */}
      <div ref={overlayRef} className="nb-overlay">

        {/* Neon divider between panels */}
        <div className="nb-divider-line" />

        {/* ── LEFT — deep dark ─────────────────────────────── */}
        <div ref={leftPanelRef} className="nb-left">

          {/* Top bar */}
          <div className="nb-topbar" style={{ borderBottom: "1px solid rgba(0,255,136,0.06)" }}>
            <span className="nb-topbar-label" style={{ color: "rgba(0,255,136,0.3)" }}>
              <span style={{ color: "rgba(0,255,136,0.18)" }}>~/</span>navigation
            </span>
            <div ref={availRef} className="nb-avail">
              <span className="nb-avail-dot" />
              <span className="nb-avail-text">Available for work</span>
            </div>
          </div>

          {/* Links */}
          <nav className="nb-links" style={{ paddingBlock: "clamp(16px,2.5vh,32px)" }}>
            {PRIMARY_LINKS.map((link, i) => (
              <div key={i} className="nb-link-wrap"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="nb-link-inner" ref={(el) => (linksRef.current[i] = el)}>
                  <Link
                    to={link.to} smooth duration={2000} offset={0}
                    onClick={toggleMenu}
                    className="nb-link-row"
                  >
                    <span className="nb-link-num">{link.num}</span>
                    <span className="nb-link-label">{link.label}</span>
                    <span className="nb-link-arrow">↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </nav>

          {/* Footer left — email */}
          <div ref={footerLeftRef} className="nb-footer-left">
            <span className="nb-footer-label" style={{ color: "rgba(0,255,136,0.25)" }}>
              <span style={{ color: "rgba(0,255,136,0.15)" }}>// </span>Email
            </span>
            <a
              href="mailto:rajanshu2123@gmail.com"
              className="nb-sec-link"
              style={{ color: "rgba(229,229,229,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#00ff88";
                e.currentTarget.style.textShadow = "0 0 12px rgba(0,255,136,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(229,229,229,0.3)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              rajanshu2123@gmail.com
              <Icon icon="lucide:arrow-up-right" style={{ width: 9, height: 9 }} />
            </a>
          </div>
        </div>

        {/* ── RIGHT — slightly lighter dark ───────────────── */}
        <div ref={rightPanelRef} className="nb-right">

          {/* Grid texture */}
          <div className="nb-grid-pattern" />

          {/* Top bar */}
          <div className="nb-topbar" style={{ borderBottom: "1px solid rgba(0,212,255,0.06)" }}>
            <span className="nb-topbar-label" style={{ color: "rgba(0,212,255,0.35)" }}>Anshu Raj</span>
            <span className="nb-topbar-label" style={{
              color: "rgba(229,229,229,0.15)",
              fontVariantNumeric: "tabular-nums",
            }}>2025</span>
          </div>

          {/* Tags — mirror the links */}
          <div style={{ marginBlock: "auto", paddingBlock: "clamp(16px,2.5vh,32px)", position: "relative", zIndex: 1 }}>
            <span style={{
              fontFamily: "monospace", fontSize: 9, letterSpacing: "0.36em",
              textTransform: "uppercase", color: "rgba(0,212,255,0.2)",
              display: "block", marginBottom: "clamp(18px,3vh,36px)",
            }}>
              Index
            </span>
            {PRIMARY_LINKS.map((link, i) => {
              const isHov = hoveredIdx === i;
              return (
                <div
                  key={i}
                  className="nb-tag-row"
                  ref={(el) => (rightTagsRef.current[i] = el)}
                  style={{
                    paddingLeft: isHov ? "10px" : "0",
                    transition: "padding-left 0.2s ease",
                    borderLeft: isHov ? "1px solid #00ff88" : "1px solid rgba(0,255,136,0.06)",
                  }}
                >
                  <span className="nb-tag-num" style={isHov ? { color: "#00ff88" } : {}}>
                    {link.num}
                  </span>
                  <span
                    className="nb-tag-dot"
                    style={isHov ? { background: "#00ff88", boxShadow: "0 0 6px rgba(0,255,136,0.8)" } : {}}
                  />
                  <span
                    className="nb-tag-label"
                    style={isHov ? { color: "#00ff88", textShadow: "0 0 10px rgba(0,255,136,0.35)" } : {}}
                  >
                    {link.tag}
                  </span>
                  {isHov && (
                    <span style={{
                      fontFamily: "monospace", fontSize: 9,
                      color: "rgba(0,255,136,0.4)", letterSpacing: "0.2em",
                      marginLeft: "auto",
                    }}>
                      ↗
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Vertical decorative text */}
          <span ref={verticalTextRef} className="nb-vertical">
            Full-Stack Developer · 3D & Animation Specialist
          </span>

          {/* Footer right — socials */}
          <div ref={footerRightRef} className="nb-footer-right">
            <span className="nb-footer-label" style={{ color: "rgba(0,212,255,0.25)" }}>
              <span style={{ color: "rgba(0,212,255,0.15)" }}>// </span>Connect
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(10px,1.5vw,20px)" }}>
              {(socials || []).map((s, i) => (
                <div key={i} ref={(el) => (secondaryRef.current[i] = el)} style={{ opacity: 0 }}>
                  <a
                    href={s.href} target="_blank" rel="noopener noreferrer"
                    className="nb-sec-link"
                    style={{ color: "rgba(229,229,229,0.25)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#00d4ff";
                      e.currentTarget.style.textShadow = "0 0 12px rgba(0,212,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(229,229,229,0.25)";
                      e.currentTarget.style.textShadow = "none";
                    }}
                  >
                    {s.name}
                    <Icon icon="lucide:arrow-up-right" style={{ width: 9, height: 9 }} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Burger */}
      <button
        ref={burgerRef}
        className={`nb-burger${isOpen ? " open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        style={showBurger ? { clipPath: "circle(50% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
      >
        <span ref={topLineRef} className="ln" />
        <span ref={midLineRef} className="ln" style={{ width: "65%" }} />
        <span ref={botLineRef} className="ln" />
      </button>
    </>
  );
};

export default Navbar;

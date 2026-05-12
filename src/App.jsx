import React, { useEffect, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import WorksIntro from "./sections/WorksIntro";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import CustomCursor from "./components/CustomCursor";
import WebGLLoader from "./components/WebGLLoader"; // ← new loader
import { useProgress } from "@react-three/drei";

/* ─── App ─────────────────────────────────────────────── */
const App = () => {
  const { progress }  = useProgress();
  const [isReady,       setIsReady]       = useState(false);
  const [loadProgress,  setLoadProgress]  = useState(0);

  useEffect(() => {
    const mobile = window.innerWidth < 768;

    if (mobile) {
      // On mobile there's no WebGL 3-D model to load,
      // so we run a 2.4-second simulated ramp instead.
      const t0 = Date.now(), dur = 2400;
      const iv = setInterval(() => {
        const p = Math.min(((Date.now() - t0) / dur) * 100, 100);
        setLoadProgress(p);
        if (p >= 100) clearInterval(iv);
      }, 40);
      return () => clearInterval(iv);
    } else {
      setLoadProgress(progress);
    }
  }, [progress]);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-hidden bg-primary">
      <CustomCursor />

      {/* ── WebGL loader — visible until the user clicks to reveal ── */}
      {!isReady && (
        <WebGLLoader
          progress={loadProgress}
          onComplete={() => setIsReady(true)}
        />
      )}

      {/* ── Main site — fades in after loader dismisses ─────────── */}
      <div className={`${isReady ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <WorksIntro />
        <Works />
        <ContactSummary />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;

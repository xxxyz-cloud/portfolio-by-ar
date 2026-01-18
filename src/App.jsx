import React, { useEffect, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import CustomCursor from "./components/CustomCursor";
import { useProgress } from "@react-three/drei";

const App = () => {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      const startTime = Date.now();
      const targetDuration = 2000;
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / targetDuration) * 100, 100);
        setLoadProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsReady(true), 300);
        }
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setLoadProgress(progress);
      if (progress === 100) {
        setTimeout(() => setIsReady(true), 300);
      }
    }
  }, [progress]);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-hidden bg-primary">
      <CustomCursor />
      
      {!isReady && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-primary text-text transition-opacity duration-700">
          <div className="mb-8 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-center">
              <span className="text-accent neon-text">Anshu</span> Raj
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-mono text-center mt-2 text-text-dim">
              Full-Stack Developer
            </p>
          </div>

          <div className="relative w-80 max-w-[90vw]">
            <p className="mb-4 text-lg sm:text-xl tracking-widest animate-pulse font-mono text-accent text-center">
              Loading {Math.floor(loadProgress)}%
            </p>
            <div className="relative h-2 overflow-hidden rounded-full bg-border">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-300 bg-gradient-to-r from-accent via-accent-blue to-accent-purple"
                style={{ width: `${loadProgress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            
            <div className="mt-4 text-xs font-mono text-center text-text-dim">
              <p className="animate-pulse">Initializing experience...</p>
            </div>
          </div>

          <div className="absolute top-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 sm:right-20 w-32 sm:w-64 h-32 sm:h-64 bg-accent-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      )}

      <div className={`${isReady ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <Works />
        <ContactSummary />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;
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
import { useProgress } from "@react-three/drei";

const App = () => {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

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
          setFadeOut(true);
          setTimeout(() => setIsReady(true), 1000);
        }
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setLoadProgress(progress);
      if (progress === 100) {
        setFadeOut(true);
        setTimeout(() => setIsReady(true), 1000);
      }
    }
  }, [progress]);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-hidden bg-primary">
      <CustomCursor />
      
      {!isReady && (
        <div 
          className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-primary transition-all duration-1000 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Elegant top border line */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-700"
              style={{ 
                width: `${loadProgress}%`,
                boxShadow: `0 0 10px ${loadProgress > 50 ? '#00ff88' : 'transparent'}`,
              }}
            />
          </div>

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center space-y-12 px-4">
            
            {/* Minimalist logo/name reveal */}
            <div className="relative overflow-hidden">
              <div 
                className="transform transition-all duration-1000 ease-out"
                style={{
                  transform: loadProgress > 20 ? 'translateY(0)' : 'translateY(100%)',
                  opacity: loadProgress > 20 ? 1 : 0,
                }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-light tracking-tight text-center">
                  <span className="inline-block">
                    <span className="text-text">Anshu</span>
                    {' '}
                    <span 
                      className="relative inline-block"
                      style={{
                        color: '#00ff88',
                        textShadow: loadProgress > 70 ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none',
                      }}
                    >
                      Raj
                      <span 
                        className="absolute bottom-0 left-0 h-px bg-accent transition-all duration-700"
                        style={{ width: `${Math.max(0, loadProgress - 40)}%` }}
                      />
                    </span>
                  </span>
                </h1>
                
                <div 
                  className="mt-4 text-xs sm:text-sm font-mono tracking-[0.3em] text-center uppercase transition-all duration-700 delay-300"
                  style={{
                    color: '#808080',
                    opacity: loadProgress > 40 ? 1 : 0,
                  }}
                >
                  Full-Stack Developer
                </div>
              </div>
            </div>

            {/* Refined progress indicator */}
            <div 
              className="w-80 sm:w-96 max-w-[90vw] space-y-6 transition-all duration-700 delay-500"
              style={{
                opacity: loadProgress > 30 ? 1 : 0,
                transform: loadProgress > 30 ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {/* Progress bar */}
              <div className="relative">
                <div className="h-px bg-border overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 relative"
                    style={{ 
                      width: `${loadProgress}%`,
                    }}
                  >
                    {/* Subtle glow at the end */}
                    <div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-8"
                      style={{
                        background: `radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%)`,
                        opacity: loadProgress < 100 ? 1 : 0,
                      }}
                    />
                  </div>
                </div>
                
                {/* Progress percentage */}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-text-dim uppercase">
                    Loading
                  </span>
                  <span 
                    className="text-xs sm:text-sm font-mono tabular-nums transition-colors duration-300"
                    style={{
                      color: loadProgress === 100 ? '#00ff88' : '#808080',
                    }}
                  >
                    {Math.floor(loadProgress)}%
                  </span>
                </div>
              </div>

              {/* Status text with fade transitions */}
              <div className="text-center">
                <p 
                  className="text-[10px] sm:text-xs font-mono text-text-dim transition-opacity duration-500"
                  style={{
                    opacity: loadProgress < 30 ? 1 : 0,
                  }}
                >
                  Initializing...
                </p>
                <p 
                  className="text-[10px] sm:text-xs font-mono text-text-dim transition-opacity duration-500 absolute left-0 right-0"
                  style={{
                    opacity: loadProgress >= 30 && loadProgress < 70 ? 1 : 0,
                  }}
                >
                  Loading experience...
                </p>
                <p 
                  className="text-[10px] sm:text-xs font-mono text-accent transition-opacity duration-500 absolute left-0 right-0"
                  style={{
                    opacity: loadProgress >= 70 && loadProgress < 100 ? 1 : 0,
                  }}
                >
                  Almost ready...
                </p>
                <p 
                  className="text-[10px] sm:text-xs font-mono text-accent transition-opacity duration-500 absolute left-0 right-0"
                  style={{
                    opacity: loadProgress === 100 ? 1 : 0,
                  }}
                >
                  Welcome
                </p>
              </div>
            </div>
          </div>

          {/* Subtle ambient glow effects - very refined */}
          <div 
            className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[120px] transition-opacity duration-[3s]"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
              opacity: loadProgress > 20 ? 0.6 : 0,
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[120px] transition-opacity duration-[3s] delay-1000"
            style={{
              background: 'radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
              opacity: loadProgress > 40 ? 0.4 : 0,
            }}
          />

          {/* Elegant bottom border line */}
          <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-all duration-700 delay-300"
              style={{ 
                width: `${loadProgress * 0.7}%`,
                marginLeft: `${15}%`,
                opacity: loadProgress > 50 ? 0.5 : 0,
              }}
            />
          </div>
        </div>
      )}

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

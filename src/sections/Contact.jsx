import { useGSAP } from "@gsap/react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import Marquee from "../components/Marquee";
import { socials } from "../constants";
import gsap from "gsap";
import { Icon } from "@iconify/react/dist/iconify.js";

const Contact = () => {
  const text = `Got a project idea or want to collaborate?
    Let's build something extraordinary together
    I'm always open to discussing new opportunities`;
  
  const items = [
    "let's collaborate",
    "let's collaborate",
    "let's collaborate",
    "let's collaborate",
    "let's collaborate",
  ];

  useGSAP(() => {
    gsap.from(".social-link", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: ".social-link",
      },
    });
  }, []);

  return (
    <section
      id="contact"
      className="relative flex flex-col justify-between min-h-screen bg-secondary overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-bg w-full h-full" />
      </div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10">
        <AnimatedHeaderSection
          subTitle={"Get In Touch"}
          title={"Let's Create"}
          text={text}
          textColor={"text-text"}
          withScrollTrigger={true}
        />

        <div className="flex px-10 font-light text-text uppercase lg:text-[32px] text-[26px] leading-none mb-10">
          <div className="flex flex-col w-full gap-10">
            {/* Email */}
            <div className="social-link group">
              <div className="flex items-center gap-3 mb-2">
                <Icon icon="lucide:mail" className="text-accent" />
                <h2 className="font-display">E-mail</h2>
              </div>
              <div className="w-full h-px my-3 bg-gradient-to-r from-border via-accent to-border" />
              <a
                href="mailto:rajanshu2123@gmail.com"
                className="block text-xl md:text-2xl lg:text-3xl tracking-wider lowercase text-text-dim hover:text-accent transition-colors duration-300 font-mono"
              >
                rajanshu2123@gmail.com
              </a>
            </div>

            {/* Location */}
            <div className="social-link group">
              <div className="flex items-center gap-3 mb-2">
                <Icon icon="lucide:map-pin" className="text-accent-blue" />
                <h2 className="font-display">Location</h2>
              </div>
              <div className="w-full h-px my-3 bg-gradient-to-r from-border via-accent-blue to-border" />
              <p className="text-xl md:text-2xl lg:text-3xl text-text-dim font-mono">
                Bokaro Steel City,Jharkhand,India
              </p>
            </div>

            {/* Social Media */}
            <div className="social-link group">
              <div className="flex items-center gap-3 mb-2">
                <Icon icon="lucide:share-2" className="text-accent-purple" />
                <h2 className="font-display">Connect</h2>
              </div>
              <div className="w-full h-px my-3 bg-gradient-to-r from-border via-accent-purple to-border" />
              <div className="flex flex-wrap gap-4">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link relative px-4 py-2 overflow-hidden text-sm md:text-base leading-loose tracking-wider uppercase transition-all duration-300 border border-border rounded-lg hover:border-accent"
                  >
                    <span className="relative z-10 font-mono text-text group-hover/link:text-primary transition-colors duration-300">
                      {social.name}
                    </span>
                    <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                ))}
              </div>
            </div>

            {/* Resume Download */}
            <div className="social-link group">
              <div className="flex items-center gap-3 mb-2">
                <Icon icon="lucide:download" className="text-accent" />
                <h2 className="font-display">Resume</h2>
              </div>
              <div className="w-full h-px my-3 bg-gradient-to-r from-border via-accent to-border" />
              <a
                href="/resume/anshu-raj-resume.pdf"
                download
                className="inline-flex items-center gap-3 px-6 py-3 text-base md:text-lg font-mono bg-accent text-primary rounded-lg hover:bg-accent-blue transition-all duration-300 shadow-lg hover:shadow-accent/50"
              >
                <Icon icon="lucide:file-text" />
                Download Resume
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-10 mb-16">
          <div className="p-4 rounded-lg bg-primary/30 border border-border text-center">
            <div className="text-2xl font-bold text-accent font-display">2+</div>
            <div className="text-sm text-text-dim font-mono">Years Coding</div>
          </div>
          <div className="p-4 rounded-lg bg-primary/30 border border-border text-center">
            <div className="text-2xl font-bold text-accent-blue font-display">500+</div>
            <div className="text-sm text-text-dim font-mono">Problems Solved</div>
          </div>
          <div className="p-4 rounded-lg bg-primary/30 border border-border text-center">
            <div className="text-2xl font-bold text-accent-purple font-display">20+</div>
            <div className="text-sm text-text-dim font-mono">Projects Live</div>
          </div>
          <div className="p-4 rounded-lg bg-primary/30 border border-border text-center">
            <div className="text-2xl font-bold text-accent font-display">100%</div>
            <div className="text-sm text-text-dim font-mono">Dedication</div>
          </div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <Marquee 
        items={items} 
        className="text-text bg-transparent border-y-2 border-accent/30" 
        icon="material-symbols:code"
        iconClassName="text-accent"
      />

      {/* Footer */}
      <div className="relative z-10 px-10 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-dim font-mono">
            © 2025 Anshu Raj. Crafted with 💚 and ☕
          </p>
          <p className="text-sm text-text-dim font-mono">
            Built with React, Three.js, GSAP & Tailwind
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
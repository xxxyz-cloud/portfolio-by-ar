import { useGSAP } from "@gsap/react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import Marquee from "../components/Marquee";
import { socials } from "../constants";
import gsap from "gsap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useRef } from "react";

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

  // Form state with validation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const messageInputRef = useRef(null);

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

    gsap.from(".contact-form", {
      y: 80,
      opacity: 0,
      delay: 0.3,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact-form",
        start: "top 85%",
      },
    });
  }, []);

  // Live validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (formTouched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFocus = (inputRef) => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleFocusOut = (inputRef) => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    
    setFormErrors(errors);
    setFormTouched({ name: true, email: true, message: true });
    
    if (Object.keys(errors).length > 0) {
      // Shake animation on error
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.out",
      });
      return;
    }
    
    // Submit to Web3Forms
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '3cf7a9c6-0d4d-43d9-bb80-42b291901303',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Contact Form Submission from ${formData.name}`,
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setFormTouched({});
        
        // Success animation
        gsap.to(formRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.5)",
          yoyo: true,
          repeat: 1,
        });
        
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharCount = (text, max) => {
    const count = text.length;
    const percentage = (count / max) * 100;
    return { count, percentage, isNearLimit: percentage > 80 };
  };

  const messageCharLimit = 500;
  const messageStats = getCharCount(formData.message, messageCharLimit);

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

        {/* Enhanced Interactive Contact Form */}
        <div className="px-10 mb-16">
          <div className="max-w-4xl mx-auto">
            <form 
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/50 to-secondary/50 border-2 border-border/50 backdrop-blur-sm overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid-bg w-full h-full" />
              </div>

              {/* Animated gradient orb */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative z-10 space-y-8">
                {/* Form Header */}
                <div className="mb-10">
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-3 bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
                    Send a Message
                  </h3>
                  <p className="text-text-dim font-mono text-sm">
                    Fill out the form below and I'll get back to you within 24 hours
                  </p>
                </div>

                {/* Name Field */}
                <div className="relative group">
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-mono text-accent mb-3 uppercase tracking-wider flex items-center gap-2"
                  >
                    <Icon icon="lucide:user" className="w-4 h-4" />
                    Your Name *
                  </label>
                  <div 
                    ref={nameInputRef}
                    className="relative"
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={() => handleFocus(nameInputRef)}
                      onBlurCapture={() => handleFocusOut(nameInputRef)}
                      className={`w-full px-6 py-4 bg-primary/50 border-2 rounded-xl text-text placeholder-text-dim font-mono text-base transition-all duration-300 focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/20 ${
                        formErrors.name && formTouched.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-border focus:border-accent'
                      }`}
                      placeholder="John Doe"
                    />
                    
                    {/* Animated border on focus */}
                    <div className="absolute inset-0 rounded-xl pointer-events-none">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-accent via-accent-blue to-accent-purple opacity-0 blur transition-opacity duration-300 ${
                        formTouched.name && !formErrors.name ? 'opacity-20' : ''
                      }`} />
                    </div>

                    {/* Success checkmark */}
                    {formTouched.name && !formErrors.name && formData.name && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Icon icon="lucide:check-circle" className="w-5 h-5 text-accent animate-scale-in" />
                      </div>
                    )}
                  </div>
                  
                  {/* Error message */}
                  {formErrors.name && formTouched.name && (
                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm font-mono animate-shake">
                      <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                      {formErrors.name}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-mono text-accent-blue mb-3 uppercase tracking-wider flex items-center gap-2"
                  >
                    <Icon icon="lucide:mail" className="w-4 h-4" />
                    Email Address *
                  </label>
                  <div 
                    ref={emailInputRef}
                    className="relative"
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={() => handleFocus(emailInputRef)}
                      onBlurCapture={() => handleFocusOut(emailInputRef)}
                      className={`w-full px-6 py-4 bg-primary/50 border-2 rounded-xl text-text placeholder-text-dim font-mono text-base transition-all duration-300 focus:outline-none focus:border-accent-blue focus:shadow-lg focus:shadow-accent-blue/20 ${
                        formErrors.email && formTouched.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-border focus:border-accent-blue'
                      }`}
                      placeholder="john@example.com"
                    />
                    
                    <div className="absolute inset-0 rounded-xl pointer-events-none">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-accent-blue via-accent to-accent-purple opacity-0 blur transition-opacity duration-300 ${
                        formTouched.email && !formErrors.email ? 'opacity-20' : ''
                      }`} />
                    </div>

                    {formTouched.email && !formErrors.email && formData.email && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Icon icon="lucide:check-circle" className="w-5 h-5 text-accent-blue animate-scale-in" />
                      </div>
                    )}
                  </div>
                  
                  {formErrors.email && formTouched.email && (
                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm font-mono animate-shake">
                      <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                      {formErrors.email}
                    </div>
                  )}
                </div>

                {/* Message Field with Character Count */}
                <div className="relative group">
                  <div className="flex justify-between items-center mb-3">
                    <label 
                      htmlFor="message" 
                      className="text-sm font-mono text-accent-purple uppercase tracking-wider flex items-center gap-2"
                    >
                      <Icon icon="lucide:message-square" className="w-4 h-4" />
                      Message *
                    </label>
                    <div className={`text-xs font-mono transition-colors duration-300 ${
                      messageStats.isNearLimit ? 'text-accent' : 'text-text-dim'
                    }`}>
                      <span className={messageStats.count > messageCharLimit ? 'text-red-500' : ''}>
                        {messageStats.count}
                      </span>
                      <span className="text-text-dim">/{messageCharLimit}</span>
                    </div>
                  </div>
                  <div 
                    ref={messageInputRef}
                    className="relative"
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={() => handleFocus(messageInputRef)}
                      onBlurCapture={() => handleFocusOut(messageInputRef)}
                      rows="6"
                      maxLength={messageCharLimit}
                      className={`w-full px-6 py-4 bg-primary/50 border-2 rounded-xl text-text placeholder-text-dim font-mono text-base transition-all duration-300 focus:outline-none focus:border-accent-purple focus:shadow-lg focus:shadow-accent-purple/20 resize-none ${
                        formErrors.message && formTouched.message 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-border focus:border-accent-purple'
                      }`}
                      placeholder="Tell me about your project..."
                    />
                    
                    {/* Character count progress bar */}
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-border/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          messageStats.percentage > 100 ? 'bg-red-500' :
                          messageStats.isNearLimit ? 'bg-accent' : 'bg-accent-purple'
                        }`}
                        style={{ width: `${Math.min(messageStats.percentage, 100)}%` }}
                      />
                    </div>

                    <div className="absolute inset-0 rounded-xl pointer-events-none">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple via-accent to-accent-blue opacity-0 blur transition-opacity duration-300 ${
                        formTouched.message && !formErrors.message ? 'opacity-20' : ''
                      }`} />
                    </div>

                    {formTouched.message && !formErrors.message && formData.message && (
                      <div className="absolute right-4 top-4">
                        <Icon icon="lucide:check-circle" className="w-5 h-5 text-accent-purple animate-scale-in" />
                      </div>
                    )}
                  </div>
                  
                  {formErrors.message && formTouched.message && (
                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm font-mono animate-shake">
                      <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                      {formErrors.message}
                    </div>
                  )}
                </div>

                {/* Submit Button with States */}
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className={`group relative w-full md:w-auto px-10 py-5 rounded-xl font-display font-bold text-lg overflow-hidden transition-all duration-500 ${
                    isSubmitting 
                      ? 'bg-text-dim cursor-wait scale-95' 
                      : submitStatus === 'success'
                      ? 'bg-accent text-primary scale-100'
                      : submitStatus === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-accent text-primary hover:scale-105 hover:shadow-2xl hover:shadow-accent/50'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <Icon icon="lucide:check-circle" className="w-5 h-5" />
                        Message Sent!
                      </>
                    ) : submitStatus === 'error' ? (
                      <>
                        <Icon icon="lucide:x-circle" className="w-5 h-5" />
                        Failed. Try Again
                      </>
                    ) : (
                      <>
                        Send Message
                        <Icon icon="lucide:send" className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  
                  {/* Shimmer effect */}
                  {!isSubmitting && submitStatus !== 'success' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Original contact info */}
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
                Bokaro Steel City, Jharkhand, India
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

      {/* Bottom Marquee with new variant */}
      <Marquee 
        items={items} 
        className="text-text bg-transparent border-y-2 border-accent/30" 
        icon="material-symbols:code"
        iconClassName="text-accent"
        variant="gradient"
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

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </section>
  );
};

export default Contact;

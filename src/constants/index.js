// Anshu Raj Portfolio - Constants & Data

export const servicesData = [
  {
    title: "Full-Stack Development",
    description:
      "From MongoDB schemas to React components, I architect complete digital ecosystems. MERN stack specialist building production-grade applications that scale from 0 to 10,000 users without breaking a sweat.",
    items: [
      {
        title: "Real-Time Applications",
        description: "(Socket.io, WebSockets, Live Collaboration)",
      },
      {
        title: "Modern Frontend",
        description: "(React, Next.js, TypeScript, Server Components)",
      },
      {
        title: "Robust Backend",
        description: "(Node.js, Express, REST APIs, MongoDB)",
      },
    ],
  },
  {
    title: "Animation & 3D Experiences",
    description:
      "Bridging art and engineering. I craft motion-rich interfaces with GSAP, Three.js, and WebGL that transform static designs into memorable experiences—running at 60fps on mobile.",
    items: [
      {
        title: "3D Web Graphics",
        description: "(Three.js, React Three Fiber, WebGL Shaders)",
      },
      {
        title: "Advanced Animations",
        description: "(GSAP, ScrollTrigger, Framer Motion)",
      },
      {
        title: "Interactive Experiences",
        description: "(Particle Systems, Procedural Generation, GPU Effects)",
      },
    ],
  },
  {
    title: "AI Integration & Innovation",
    description:
      "Merging cutting-edge AI with practical applications. Google Gemini integration, smart rate limiting, and production-grade reliability in AI-powered tools that users actually want to use.",
    items: [
      {
        title: "AI-Powered Features",
        description: "(Google Gemini API, Code Generation, Smart Assistance)",
      },
      {
        title: "Data Analytics",
        description: "(GenAI Analytics, Predictive Modeling, Risk Assessment)",
      },
      {
        title: "Intelligent Systems",
        description: "(Rate Limiting, Retry Logic, Error Handling)",
      },
    ],
  },
  {
    title: "Problem Solving at Scale",
    description:
      "500+ algorithmic problems solved. I don't just code features—I optimize algorithms, refactor architectures, and solve complex system design challenges with elegant, maintainable solutions.",
    items: [
      {
        title: "Data Structures",
        description: "(Arrays, Trees, Graphs, Dynamic Programming)",
      },
      {
        title: "System Design",
        description: "(Scalability, Performance, Architecture Patterns)",
      },
      {
        title: "Code Quality",
        description: "(Clean Code, Testing, Documentation, Best Practices)",
      },
    ],
  },
];

export const projects = [
  {
    id: 1,
    name: "CodexSpace",
    description:
      "Real-time collaborative IDE powered by AI. Built for 50+ concurrent users with Google Gemini integration, WebContainer execution, and smart rate limiting.",
    href: "https://codex-space-frontend.vercel.app/",
    image: "/assets/projects/codexspace.jpg",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Socket.io" },
      { id: 3, name: "Google Gemini AI" },
      { id: 4, name: "WebContainer" },
      { id: 5, name: "MongoDB" },
    ],
    featured: true,
  },
  {
    id: 2,
    name: "Phoenix",
    description:
      "AI-powered crisis recovery platform built for a hackathon and deployed on Google Cloud Run. A 6-agent Gemini pipeline runs crisis diagnostics, generates a survival plan, simulates parallel futures with a self-correction loop, and coaches the team through recovery in real time.",
    href: "https://phoenix-647479600848.us-west1.run.app/",
    image: "/assets/projects/phoenix.jpg",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Google Gemini AI" },
      { id: 3, name: "Three.js" },
      { id: 4, name: "GSAP" },
      { id: 5, name: "Express" },
    ],
    featured: true,
  },
  {
    id: 3,
    name: "Hyperspace Rush",
    description:
      "3D tunnel racing game with procedural track generation, difficulty progression, and 60fps mobile performance. Pure WebGL mastery.",
    href: "https://hyper-space-rush.vercel.app/",
    image: "/assets/projects/hyperspace.jpg",
    frameworks: [
      { id: 1, name: "Three.js" },
      { id: 2, name: "GSAP" },
      { id: 3, name: "WebGL" },
      { id: 4, name: "Vanilla JS" },
    ],
    featured: true,
  },
  {
    id: 4,
    name: "AURA",
    description:
      "Luxury fashion e-commerce frontend with a full MERN backend. Features a WebGL displacement-shader hero transition, scroll-scramble text effects, a custom dot-ring-label cursor state machine, and a keyword-hover photo burst in the editorial section.",
    href: "https://aura-ecom-frontend.vercel.app/",
    image: "/assets/projects/aura.jpg",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Three.js" },
      { id: 3, name: "GSAP" },
      { id: 4, name: "Zustand" },
      { id: 5, name: "MongoDB" },
    ],
  },
    {
    id: 5,
    name: "Inkwell - Animated Journal Diary",
    description:
      "A premium animated landing page for journaling apps. Includes a custom pencil cursor with ink trail, ghost handwriting canvas animation, darkroom card effects, smooth scroll and responsive design",
    href: "https://visual-diary-pink.vercel.app/",
    image: "/assets/projects/1.jpg",
    frameworks: [
      { id: 1, name: "Three JS" },
      { id: 2, name: "React" },
      { id: 3, name: "Gsap" },
      { id: 4, name: "Tailwind" },
    ],
  },
  
];

export const socials = [
  { name: "GitHub", href: "https://github.com/anshu-c8NETed" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/anshu-raj-tech" },
  { name: "LeetCode", href: "https://leetcode.com/u/anshxu" },
];

export const skills = {
  languages: ["C++", "JavaScript", "TypeScript", "Python"],
  frontend: ["React", "Next.js", "HTML5", "CSS3", "Tailwind", "GSAP", "Three.js", "Framer Motion"],
  backend: ["Node.js", "Express.js", "Socket.io", "REST APIs"],
  database: ["MongoDB", "Git/GitHub"],
  tools: ["VSCode", "Cursor", "Figma", "Postman", "Render", "Netlify", "Vercel"],
};

export const achievements = [
  "500+ Data Structures & Algorithms problems solved",
  "20+ production-ready projects deployed",
  "GenAI Powered Data Analytics - Tata iQ, Forage",
  "Front-End Software Engineering - Skyscanner, Forage",
  "Tech & Media Lead - PPGS, HIT",
];

export const stats = [
  { number: "500+", label: "DSA Problems Solved" },
  { number: "10+", label: "Production Projects" },
  { number: "50+", label: "Concurrent Users Supported" },
  { number: "60", label: "FPS Mobile Performance" },
];

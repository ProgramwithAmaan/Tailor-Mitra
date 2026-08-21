import React, { useEffect, useRef } from "react";
import {
  Sparkles, ArrowUpRight, Download, MessageCircle, CheckCircle2,
  Flag, LayoutTemplate, Atom, Server, Database, Shirt, Target,
  Github, ExternalLink, Building2, CloudSun, TrendingUp, Globe,
  LayoutDashboard, Smartphone, PlugZap, Award, BrainCircuit, Code,
  Send, Terminal, Coffee, Linkedin, Instagram, Twitter, Mail, Phone,
  MapPin, Clock, Calendar, Route, FileCode, Wind, Boxes, FileCode2,
  Palette, GitBranch, Figma, CodeXml
} from "lucide-react";

const TECH = [
  { name: "React", icon: Atom, level: "Advanced", pct: 90 },
  { name: "Node.js", icon: Server, level: "Advanced", pct: 88 },
  { name: "Express", icon: Route, level: "Advanced", pct: 85 },
  { name: "MongoDB", icon: Database, level: "Advanced", pct: 85 },
  { name: "JavaScript", icon: FileCode, level: "Expert", pct: 92 },
  { name: "Java", icon: Coffee, level: "Intermediate", pct: 70 },
  { name: "Tailwind CSS", icon: Wind, level: "Advanced", pct: 90 },
  { name: "Redux", icon: Boxes, level: "Intermediate", pct: 75 },
  { name: "HTML", icon: FileCode2, level: "Expert", pct: 95 },
  { name: "CSS", icon: Palette, level: "Expert", pct: 93 },
  { name: "Git", icon: GitBranch, level: "Advanced", pct: 88 },
  { name: "GitHub", icon: Github, level: "Advanced", pct: 88 },
  { name: "VS Code", icon: Code, level: "Expert", pct: 95 },
  { name: "Postman", icon: Send, level: "Advanced", pct: 85 },
  { name: "Figma", icon: Figma, level: "Intermediate", pct: 65 },
];

const PROJECTS = [
  {
    title: "Tailor Management System",
    desc: "A complete dashboard for tailoring businesses — orders, measurements, billing and customer records in one place.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    icon: Shirt,
    cls: "thumb-p1",
  },
  {
    title: "Rent Management System",
    desc: "Helps landlords track tenants, rent cycles, payments and due reminders with a clean admin panel.",
    tags: ["React", "Express", "MongoDB", "Redux"],
    icon: Building2,
    cls: "thumb-p2",
  },
  {
    title: "Weather App",
    desc: "Real-time weather lookup with a location search, forecast cards and a clean, responsive UI.",
    tags: ["JavaScript", "REST API", "CSS"],
    icon: CloudSun,
    cls: "thumb-p3",
  },
  {
    title: "Bull Watch",
    desc: "A market-tracking tool for watching stock movement, with saved watchlists and quick insights.",
    tags: ["React", "Node.js", "API Integration"],
    icon: TrendingUp,
    cls: "thumb-p4",
  },
];

const SERVICES = [
  { title: "Web Development", desc: "Fast, modern websites and web apps built with clean, maintainable code.", icon: Globe, cls: "s1" },
  { title: "Dashboard Development", desc: "Data-rich admin panels and business dashboards that are easy to use daily.", icon: LayoutDashboard, cls: "s2" },
  { title: "Responsive UI Design", desc: "Interfaces that feel great on every screen, from mobile to widescreen.", icon: Smartphone, cls: "s3" },
  { title: "REST API Development", desc: "Secure, well-documented APIs that power reliable, scalable applications.", icon: PlugZap, cls: "s4" },
];

const STATS = [
  { count: 10, suffix: "+", label: "Projects" },
  { count: 500, suffix: "+", label: "GitHub Commits" },
  { count: 1000, suffix: "+", label: "Hours Coding" },
  { count: 3, suffix: "+", label: "Years Learning" },
];

const CERTS = [
  { title: "MERN Stack Development", sub: "Full stack web development with MongoDB, Express, React & Node", status: "Completed", icon: Award },
  { title: "DSA with Java", sub: "Data structures, algorithms & problem solving in Java", status: "Completed", icon: Award },
  { title: "React Development", sub: "Component architecture, hooks and state management", status: "Completed", icon: Award },
  { title: "Backend Development", sub: "REST APIs, authentication & database design", status: "Completed", icon: Award },
  { title: "AI / ML", sub: "Exploring machine learning fundamentals — next on the list", status: "In progress", icon: BrainCircuit },
];

const WORKSPACE_ITEMS = [
  { label: "VS Code", icon: Code },
  { label: "GitHub", icon: Github },
  { label: "Postman", icon: Send },
  { label: "MongoDB Compass", icon: Database },
  { label: "Terminal", icon: Terminal },
  { label: "Coffee Mug", icon: Coffee },
];

const SOCIALS = [
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Globe, label: "Portfolio" },
  { icon: Mail, label: "Email" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
];

const TIMELINE = [
  { step: "Step 01", title: "Started Programming", desc: "Wrote my first lines of code and got hooked on building things.", icon: Flag },
  { step: "Step 02", title: "Learned HTML, CSS & JS", desc: "Built the foundation — structure, style and interactivity on the web.", icon: LayoutTemplate },
  { step: "Step 03", title: "Mastered React", desc: "Moved into component-driven UI and modern frontend architecture.", icon: Atom },
  { step: "Step 04", title: "Learned Node & Express", desc: "Started building REST APIs and server-side logic from scratch.", icon: Server },
  { step: "Step 05", title: "MongoDB", desc: "Designed schemas and connected the dots into a full MERN stack.", icon: Database },
  { step: "Step 06", title: "Built Tailor Management System", desc: "Shipped a complete business management dashboard end to end.", icon: Shirt },
  { step: "Current goal", title: "Become a Software Engineer at a top product company", desc: "Sharpening DSA, system design and product thinking to get there.", icon: Target, current: true },
];

// Counter Component
const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const dur = 1400;
          const start = performance.now();
          function tick(now) {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            if (ref.current) ref.current.textContent = Math.floor(eased * value) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else if (ref.current) ref.current.textContent = value + suffix;
          }
          requestAnimationFrame(tick);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);

  return (
    <div ref={wrapRef} className="stat-num">
      <span ref={ref}>0</span>
    </div>
  );
};

// Reveal Component
const Reveal = ({ as: Tag = "div", className = "", children, ...rest }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const fill = entry.target.querySelector(".tech-bar-fill");
          if (fill) requestAnimationFrame(() => (fill.style.width = fill.dataset.pct + "%"));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

// GlowCard Component
const GlowCard = ({ as: Tag = "div", className = "", children, ...rest }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref} className={`glow-card ${className}`} onMouseMove={onMove} {...rest}>
      {children}
    </Tag>
  );
};

// RippleButton Component
const RippleButton = ({ as: Tag = "a", className = "", children, ...rest }) => {
  const onClick = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - r.left - size / 2 + "px";
    ripple.style.top = e.clientY - r.top - size / 2 + "px";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  };
  return (
    <Tag className={`btn ${className}`} onClick={onClick} {...rest}>
      {children}
    </Tag>
  );
};

// Main Component
export default function AboutDeveloper() {
  const avatarWrapRef = useRef(null);
  const heroVisualRef = useRef(null);

  useEffect(() => {
    const heroVisual = heroVisualRef.current;
    const avatarWrap = avatarWrapRef.current;
    if (!heroVisual || !avatarWrap) return;
    const onMove = (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      avatarWrap.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
    };
    const onLeave = () => {
      avatarWrap.style.transform = "rotateY(0deg) rotateX(0deg)";
    };
    heroVisual.addEventListener("mousemove", onMove);
    heroVisual.addEventListener("mouseleave", onLeave);
    return () => {
      heroVisual.removeEventListener("mousemove", onMove);
      heroVisual.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="adx-root">
      <style>{`
        .adx-root {
          --primary: #2563EB;
          --secondary: #4F46E5;
          --accent: #7C3AED;
          --success: #22C55E;
          --bg: #F8FAFC;
          --card: #FFFFFF;
          --text: #111827;
          --text-soft: #6B7280;
          --border: #E5E7EB;
          --grad: linear-gradient(135deg, var(--primary), var(--secondary) 55%, var(--accent));
          --radius: 24px;
          --shadow-sm: 0 2px 8px rgba(17,24,39,.04);
          --shadow-md: 0 8px 30px rgba(37,99,235,.08);
          --shadow-lg: 0 20px 60px rgba(37,99,235,.14);
          font-family: 'Inter', -apple-system, sans-serif;
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .adx-root * { box-sizing: border-box; }
        .adx-root h1, .adx-root h2, .adx-root h3, .adx-root h4 {
          font-family: 'Inter Tight', 'Inter', sans-serif;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .adx-root p { margin: 0; }
        .adx-root a { text-decoration: none; color: inherit; }
        .adx-root ul { list-style: none; margin: 0; padding: 0; }
        .adx-root img { max-width: 100%; display: block; }

        .adx-root .wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
        .adx-root section { position: relative; padding: 96px 0; }
        .adx-root section:first-of-type { padding-top: 0; }

        .adx-root .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--primary);
          background: rgba(37,99,235,.08);
          border: 1px solid rgba(37,99,235,.15);
          padding: 6px 14px;
          border-radius: 99px;
          margin-bottom: 18px;
        }
        .adx-root .section-head { max-width: 640px; margin: 0 auto 52px; text-align: center; }
        .adx-root .section-head h2 { font-size: clamp(28px, 3.4vw, 40px); font-weight: 800; }
        .adx-root .section-head p { margin-top: 12px; font-size: 16px; color: var(--text-soft); line-height: 1.65; }

        .adx-root .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
        }
        .adx-root .reveal.visible { opacity: 1; transform: translateY(0); }
        .adx-root .reveal-delay-1.visible { transition-delay: .08s; }
        .adx-root .reveal-delay-2.visible { transition-delay: .16s; }
        .adx-root .reveal-delay-3.visible { transition-delay: .24s; }
        .adx-root .reveal-delay-4.visible { transition-delay: .32s; }

        .adx-root .glass {
          background: rgba(255,255,255,.68);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          border: 1px solid rgba(255,255,255,.6);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
        }
        .adx-root .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s cubic-bezier(.16,1,.3,1), border-color .3s;
        }
        .adx-root .card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(37,99,235,.25);
        }

        .adx-root .glow-card { position: relative; overflow: hidden; }
        .adx-root .glow-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(37,99,235,.12), transparent 60%);
          opacity: 0;
          transition: opacity .35s;
          pointer-events: none;
        }
        .adx-root .glow-card:hover::before { opacity: 1; }

        .adx-root .btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          font-weight: 600;
          font-size: 14.5px;
          padding: 13px 24px;
          border-radius: 14px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, background .3s, color .3s, border-color .3s;
          white-space: nowrap;
        }
        .adx-root .btn:active { transform: scale(.97); }
        .adx-root .btn-primary {
          background: var(--grad);
          color: #fff;
          box-shadow: 0 10px 26px rgba(37,99,235,.32);
        }
        .adx-root .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 34px rgba(37,99,235,.4);
        }
        .adx-root .btn-ghost {
          background: rgba(255,255,255,.7);
          color: var(--text);
          border-color: var(--border);
        }
        .adx-root .btn-ghost:hover {
          transform: translateY(-3px);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 10px 24px rgba(37,99,235,.14);
        }
        .adx-root .btn-dark { background: #111827; color: #fff; }
        .adx-root .btn-dark:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(17,24,39,.28);
        }
        .adx-root .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,.55);
          transform: scale(0);
          animation: adx-rip .6s ease-out;
          pointer-events: none;
        }
        @keyframes adx-rip { to { transform: scale(3); opacity: 0; } }

        .adx-root .hero {
          position: relative;
          padding: 120px 0 110px;
          background: radial-gradient(1100px 500px at 15% -10%, rgba(37,99,235,.16), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(124,58,237,.14), transparent 55%), var(--bg);
          overflow: hidden;
        }
        .adx-root .hero-noise {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(37,99,235,.05) 1px, transparent 1px);
          background-size: 26px 26px;
          -webkit-mask-image: linear-gradient(to bottom, black, transparent 80%);
          mask-image: linear-gradient(to bottom, black, transparent 80%);
          pointer-events: none;
        }
        .adx-root .hero-grid {
          display: grid;
          grid-template-columns: .85fr 1.15fr;
          gap: 64px;
          align-items: center;
          position: relative;
        }
        .adx-root .hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 420px;
        }
        .adx-root .float-shape {
          position: absolute;
          border-radius: 30px;
          opacity: .85;
          animation: adx-floaty 7s ease-in-out infinite;
        }
        .adx-root .fs1 {
          width: 78px;
          height: 78px;
          top: 8%;
          left: 6%;
          background: linear-gradient(135deg, #93C5FD, #2563EB);
          animation-delay: .2s;
          box-shadow: 0 12px 24px rgba(37,99,235,.25);
        }
        .adx-root .fs2 {
          width: 54px;
          height: 54px;
          bottom: 12%;
          left: 0%;
          background: linear-gradient(135deg, #C4B5FD, #7C3AED);
          border-radius: 50%;
          animation-delay: 1.1s;
          box-shadow: 0 12px 24px rgba(124,58,237,.25);
        }
        .adx-root .fs3 {
          width: 60px;
          height: 60px;
          top: 2%;
          right: 6%;
          background: linear-gradient(135deg, #A5B4FC, #4F46E5);
          animation-delay: .6s;
          transform: rotate(18deg);
          box-shadow: 0 12px 24px rgba(79,70,229,.25);
        }
        .adx-root .fs4 {
          width: 40px;
          height: 40px;
          bottom: 6%;
          right: 12%;
          background: linear-gradient(135deg, #6EE7B7, #22C55E);
          border-radius: 50%;
          animation-delay: 1.6s;
          box-shadow: 0 10px 20px rgba(34,197,94,.25);
        }
        @keyframes adx-floaty {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(6deg); }
        }

        .adx-root .avatar-wrap {
          position: relative;
          width: 260px;
          height: 260px;
          will-change: transform;
          transition: transform .15s ease-out;
        }
        .adx-root .avatar-ring {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--primary), var(--accent), var(--secondary), var(--primary));
          animation: adx-spin 6s linear infinite;
          filter: blur(2px);
        }
        .adx-root .avatar-ring::after {
          content: "";
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: var(--bg);
        }
        @keyframes adx-spin { to { transform: rotate(360deg); } }
        .adx-root .avatar {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--grad);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 88px;
          font-weight: 800;
          color: #fff;
          box-shadow: 0 0 0 8px rgba(255,255,255,.9), 0 25px 60px rgba(37,99,235,.35);
          z-index: 2;
        }
        .adx-root .online-dot {
          position: absolute;
          bottom: 14px;
          right: 14px;
          z-index: 3;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--success);
          border: 4px solid #fff;
          animation: adx-pulse 2s infinite;
        }
        @keyframes adx-pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,.55); }
          70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        .adx-root .hero-copy .wave {
          display: inline-block;
          animation: adx-wave 2.4s ease-in-out infinite;
          transform-origin: 70% 70%;
        }
        @keyframes adx-wave {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(16deg); }
          30% { transform: rotate(-8deg); }
          45% { transform: rotate(14deg); }
          60% { transform: rotate(0deg); }
        }
        .adx-root .hero-copy h1 {
          font-size: clamp(34px, 4.6vw, 52px);
          font-weight: 800;
          line-height: 1.08;
          margin-top: 10px;
        }
        .adx-root .hero-copy .grad-text {
          background: var(--grad);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .adx-root .hero-role {
          margin-top: 14px;
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .adx-root .hero-role .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }
        .adx-root .hero-tagline {
          margin-top: 18px;
          font-size: 16.5px;
          line-height: 1.7;
          color: var(--text-soft);
          max-width: 520px;
        }
        .adx-root .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }
        .adx-root .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }
        .adx-root .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #1E3A8A;
          background: rgba(37,99,235,.08);
          border: 1px solid rgba(37,99,235,.16);
          padding: 7px 13px;
          border-radius: 99px;
          transition: transform .3s, background .3s;
        }
        .adx-root .badge:hover {
          transform: translateY(-2px);
          background: rgba(37,99,235,.14);
        }
        .adx-root .badge svg { width: 13px; height: 13px; color: var(--success); }

        .adx-root .about-grid {
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 0;
          align-items: center;
          padding: 56px;
        }
        .adx-root .about-illust {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adx-root .orbit {
          position: absolute;
          border: 1.5px dashed rgba(37,99,235,.28);
          border-radius: 50%;
        }
        .adx-root .orbit1 {
          width: 230px;
          height: 230px;
          animation: adx-spin 18s linear infinite;
        }
        .adx-root .orbit2 {
          width: 170px;
          height: 170px;
          animation: adx-spin 12s linear infinite reverse;
        }
        .adx-root .orbit-dot {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--grad);
          top: -7px;
          left: calc(50% - 7px);
          box-shadow: 0 6px 14px rgba(37,99,235,.4);
        }
        .adx-root .orbit-dot2 { background: linear-gradient(135deg, #7C3AED, #4F46E5); }
        .adx-root .about-core {
          width: 96px;
          height: 96px;
          border-radius: 26px;
          background: var(--grad);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(37,99,235,.3);
          animation: adx-floaty 5s ease-in-out infinite;
        }
        .adx-root .about-text h2 { font-size: 30px; font-weight: 800; }
        .adx-root .about-text p { margin-top: 16px; font-size: 16px; line-height: 1.8; color: var(--text-soft); }

        .adx-root .timeline {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          padding-left: 6px;
        }
        .adx-root .timeline::before {
          content: "";
          position: absolute;
          left: 23px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(var(--border), var(--border));
        }
        .adx-root .t-item {
          position: relative;
          display: flex;
          gap: 26px;
          padding-bottom: 44px;
        }
        .adx-root .t-item:last-child { padding-bottom: 0; }
        .adx-root .t-dot {
          flex: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: .4s;
        }
        .adx-root .t-dot svg { color: var(--text-soft); transition: .4s; }
        .adx-root .t-item.visible .t-dot {
          background: var(--grad);
          border-color: transparent;
          box-shadow: 0 10px 22px rgba(37,99,235,.32);
        }
        .adx-root .t-item.visible .t-dot svg { color: #fff; }
        .adx-root .t-body { padding-top: 6px; }
        .adx-root .t-year {
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--primary);
        }
        .adx-root .t-title { font-size: 17px; font-weight: 700; margin-top: 4px; }
        .adx-root .t-desc { font-size: 14.5px; color: var(--text-soft); margin-top: 5px; line-height: 1.6; }
        .adx-root .t-item.current .t-title { color: var(--accent); }

        .adx-root .tech-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
        }
        .adx-root .tech-card { padding: 22px 20px; text-align: left; }
        .adx-root .tech-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .adx-root .tech-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(37,99,235,.09);
          color: var(--primary);
          transition: transform .4s cubic-bezier(.16,1,.3,1), background .4s, color .4s;
        }
        .adx-root .tech-card:hover .tech-icon {
          transform: rotate(-8deg) scale(1.08);
          background: var(--grad);
          color: #fff;
        }
        .adx-root .tech-name { font-weight: 700; font-size: 14.5px; }
        .adx-root .tech-level { font-size: 11.5px; color: var(--text-soft); margin-top: 1px; }
        .adx-root .tech-bar {
          margin-top: 16px;
          height: 6px;
          border-radius: 99px;
          background: #EEF2F7;
          overflow: hidden;
        }
        .adx-root .tech-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: var(--grad);
          width: 0%;
          transition: width 1.1s cubic-bezier(.16,1,.3,1);
        }

        .adx-root .proj-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .adx-root .proj-card { overflow: hidden; }
        .adx-root .proj-thumb {
          height: 190px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adx-root .proj-thumb::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,.16), transparent 45%);
        }
        .adx-root .proj-thumb::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .adx-root .thumb-p1 { background: linear-gradient(135deg, #2563EB, #4F46E5); }
        .adx-root .thumb-p2 { background: linear-gradient(135deg, #4F46E5, #7C3AED); }
        .adx-root .thumb-p3 { background: linear-gradient(135deg, #0EA5E9, #2563EB); }
        .adx-root .thumb-p4 { background: linear-gradient(135deg, #7C3AED, #DB2777); }
        .adx-root .proj-body { padding: 24px; }
        .adx-root .proj-title { font-size: 18px; font-weight: 700; }
        .adx-root .proj-desc { font-size: 14px; color: var(--text-soft); margin-top: 8px; line-height: 1.65; }
        .adx-root .proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }
        .adx-root .tag {
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 99px;
          background: #EFF3FF;
          color: var(--secondary);
          border: 1px solid rgba(79,70,229,.15);
        }
        .adx-root .proj-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .adx-root .proj-actions .btn { padding: 10px 16px; font-size: 13.5px; }

        .adx-root .serv-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .adx-root .serv-card { padding: 28px 22px; }
        .adx-root .serv-ill {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          transition: transform .4s cubic-bezier(.16,1,.3,1);
        }
        .adx-root .serv-card:hover .serv-ill { transform: scale(1.1) rotate(-6deg); }
        .adx-root .serv-ill.s1 { background: linear-gradient(135deg, #2563EB, #3B82F6); }
        .adx-root .serv-ill.s2 { background: linear-gradient(135deg, #4F46E5, #6366F1); }
        .adx-root .serv-ill.s3 { background: linear-gradient(135deg, #7C3AED, #A855F7); }
        .adx-root .serv-ill.s4 { background: linear-gradient(135deg, #0891B2, #06B6D4); }
        .adx-root .serv-card h3 { font-size: 16.5px; font-weight: 700; }
        .adx-root .serv-card p { font-size: 14px; color: var(--text-soft); margin-top: 8px; line-height: 1.6; }

        .adx-root .stats-band {
          border-radius: var(--radius);
          background: var(--grad);
          padding: 56px 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(37,99,235,.28);
        }
        .adx-root .stat-num {
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 800;
          color: #fff;
          font-family: 'Inter Tight';
        }
        .adx-root .stat-label {
          font-size: 13.5px;
          color: rgba(255,255,255,.85);
          margin-top: 6px;
          font-weight: 600;
          letter-spacing: .02em;
        }

        .adx-root .cert-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .adx-root .cert-card {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 20px 24px;
        }
        .adx-root .cert-preview {
          flex: none;
          width: 88px;
          height: 64px;
          border-radius: 14px;
          background: var(--grad);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .adx-root .cert-preview::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, rgba(255,255,255,.35) 0%, transparent 40%);
        }
        .adx-root .cert-info { flex: 1; }
        .adx-root .cert-title { font-size: 15.5px; font-weight: 700; }
        .adx-root .cert-sub { font-size: 13px; color: var(--text-soft); margin-top: 3px; }
        .adx-root .cert-status {
          flex: none;
          font-size: 11.5px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 99px;
          background: rgba(34,197,94,.12);
          color: #15803D;
          border: 1px solid rgba(34,197,94,.25);
        }
        .adx-root .cert-status.progress {
          background: rgba(124,58,237,.1);
          color: var(--accent);
          border-color: rgba(124,58,237,.22);
        }

        .adx-root .workspace-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 52px;
        }
        .adx-root .laptop {
          position: relative;
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adx-root .laptop-screen {
          width: 280px;
          height: 180px;
          border-radius: 14px 14px 4px 4px;
          background: #111827;
          padding: 10px;
          box-shadow: 0 30px 60px rgba(17,24,39,.25);
        }
        .adx-root .laptop-screen-inner {
          width: 100%;
          height: 100%;
          border-radius: 6px;
          background: var(--grad);
          position: relative;
          overflow: hidden;
        }
        .adx-root .laptop-screen-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);
          background-size: 16px 16px;
        }
        .adx-root .laptop-base {
          width: 320px;
          height: 14px;
          background: linear-gradient(#E5E7EB, #CBD5E1);
          border-radius: 0 0 10px 10px;
          margin-top: -2px;
          box-shadow: 0 10px 20px rgba(17,24,39,.15);
        }
        .adx-root .ws-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .adx-root .ws-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
        }
        .adx-root .ws-item svg { color: var(--primary); flex: none; }
        .adx-root .ws-item span { font-size: 13.5px; font-weight: 600; }

        .adx-root .social-card { padding: 48px; text-align: center; }
        .adx-root .social-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .adx-root .social-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid var(--border);
          transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, background .35s, border-color .35s;
        }
        .adx-root .social-btn svg { color: var(--text); transition: color .35s; }
        .adx-root .social-btn:hover {
          transform: translateY(-6px) scale(1.06);
          background: var(--grad);
          border-color: transparent;
          box-shadow: 0 16px 30px rgba(37,99,235,.32);
        }
        .adx-root .social-btn:hover svg { color: #fff; }

        .adx-root .contact-card {
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        .adx-root .contact-card::before {
          content: "";
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,.16), transparent 70%);
          top: -140px;
          right: -100px;
        }
        .adx-root .contact-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 48px;
          align-items: center;
        }
        .adx-root .contact-inner h2 { font-size: clamp(26px, 3.4vw, 36px); font-weight: 800; line-height: 1.2; }
        .adx-root .contact-inner p { margin-top: 14px; color: var(--text-soft); font-size: 15.5px; max-width: 440px; }
        .adx-root .contact-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .adx-root .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .adx-root .contact-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
        }
        .adx-root .contact-row svg { color: var(--primary); flex: none; }
        .adx-root .contact-row .label {
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: var(--text-soft);
          font-weight: 700;
        }
        .adx-root .contact-row .value { font-size: 14.5px; font-weight: 600; margin-top: 1px; }

        .adx-root footer { padding: 44px 0 40px; border-top: 1px solid var(--border); }
        .adx-root .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .adx-root .footer-inner p { font-size: 13.5px; color: var(--text-soft); }
        .adx-root .footer-inner .heart {
          color: #EF4444;
          display: inline-block;
          animation: adx-pulse2 1.6s ease-in-out infinite;
        }
        @keyframes adx-pulse2 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }

        @media (max-width: 980px) {
          .adx-root .hero-grid { grid-template-columns: 1fr; text-align: center; }
          .adx-root .hero-copy p, .adx-root .hero-copy .hero-tagline { margin-left: auto; margin-right: auto; }
          .adx-root .hero-actions, .adx-root .badges { justify-content: center; }
          .adx-root .about-grid { grid-template-columns: 1fr; gap: 36px; padding: 40px; }
          .adx-root .about-illust { order: -1; }
          .adx-root .tech-grid { grid-template-columns: repeat(3, 1fr); }
          .adx-root .proj-grid { grid-template-columns: 1fr; }
          .adx-root .serv-grid { grid-template-columns: repeat(2, 1fr); }
          .adx-root .stats-band { grid-template-columns: repeat(2, 1fr); }
          .adx-root .workspace-grid { grid-template-columns: 1fr; padding: 36px; }
          .adx-root .contact-inner { grid-template-columns: 1fr; }
          .adx-root .contact-card { padding: 40px; }
        }
        @media (max-width: 600px) {
          .adx-root section { padding: 64px 0; }
          .adx-root .tech-grid { grid-template-columns: repeat(2, 1fr); }
          .adx-root .serv-grid { grid-template-columns: 1fr; }
          .adx-root .stats-band { grid-template-columns: 1fr 1fr; padding: 36px 22px; }
          .adx-root .cert-card { flex-wrap: wrap; }
          .adx-root .avatar-wrap { width: 200px; height: 200px; }
          .adx-root .avatar { font-size: 66px; }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="wrap hero-grid">
          <div className="hero-visual reveal visible" ref={heroVisualRef}>
            <div className="float-shape fs1" />
            <div className="float-shape fs2" />
            <div className="float-shape fs3" />
            <div className="float-shape fs4" />
            <div className="avatar-wrap" ref={avatarWrapRef}>
              <div className="avatar-ring" />
              <div className="avatar">AS</div>
              <div className="online-dot" title="Available for work" />
            </div>
          </div>

          <Reveal className="hero-copy reveal-delay-1">
            <div className="eyebrow"><Sparkles size={13} /> About the developer</div>
            <h1>
              Hello <span className="wave">👋</span>
              <br />I'm <span className="grad-text">Amaan Saifi</span>
            </h1>
            <div className="hero-role"><span className="dot" /> Full Stack MERN Developer</div>
            <p className="hero-tagline">
              "Building modern, scalable and user-friendly business management applications."
            </p>

            <div className="hero-actions">
              <RippleButton href="#" className="btn-primary">View Portfolio <ArrowUpRight size={16} /></RippleButton>
              <RippleButton href="#" className="btn-ghost">Download Resume <Download size={16} /></RippleButton>
              <RippleButton href="#contact" className="btn-dark">Contact Me <MessageCircle size={16} /></RippleButton>
            </div>

            <div className="badges">
              {["MERN Stack", "React Developer", "Node.js", "MongoDB", "Java", "UI/UX Enthusiast"].map((b) => (
                <span className="badge" key={b}><CheckCircle2 /> {b}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section>
        <div className="wrap">
          <Reveal>
            <GlowCard className="glass about-grid">
              <div className="about-text">
                <div className="eyebrow">About me</div>
                <h2>Turning ideas into real products</h2>
                <p>
                  Passionate Full Stack Developer specializing in MERN Stack development. I love creating
                  modern dashboards, business management systems, beautiful UI/UX and scalable web
                  applications — the kind of software that quietly makes someone's workday easier.
                </p>
                <p style={{ marginTop: 12 }}>
                  Currently focused on building the Tailor Management System — a real-world business tool
                  for measurements, orders, billing and customer management.
                </p>
              </div>
              <div className="about-illust">
                <div className="orbit orbit1"><span className="orbit-dot" /></div>
                <div className="orbit orbit2"><span className="orbit-dot orbit-dot2" /></div>
                <div className="about-core"><CodeXml size={44} color="#fff" /></div>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section>
        <div className="wrap">
          <Reveal className="section-head" style={{ display: "block" }}>
            <div className="eyebrow">My journey</div>
            <h2>From first "Hello World" to production apps</h2>
            <p>Every stop along the way, in order.</p>
          </Reveal>

          <div className="timeline">
            {TIMELINE.map((t) => {
              const Icon = t.icon;
              return (
                <Reveal as="div" className={`t-item ${t.current ? "current" : ""}`} key={t.title}>
                  <div className="t-dot"><Icon size={20} /></div>
                  <div className="t-body">
                    <div className="t-year">{t.step}</div>
                    <div className="t-title">{t.title}</div>
                    <div className="t-desc">{t.desc}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section>
        <div className="wrap">
          <Reveal className="section-head" style={{ display: "block" }}>
            <div className="eyebrow">Tech stack</div>
            <h2>Tools I build with</h2>
            <p>A hands-on toolkit across the frontend, backend and workflow.</p>
          </Reveal>

          <div className="tech-grid">
            {TECH.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal as="div" className={`card tech-card reveal-delay-${(i % 4) + 1}`} key={t.name}>
                  <div className="tech-top">
                    <div className="tech-icon"><Icon size={20} /></div>
                    <div>
                      <div className="tech-name">{t.name}</div>
                      <div className="tech-level">{t.level}</div>
                    </div>
                  </div>
                  <div className="tech-bar"><div className="tech-bar-fill" data-pct={t.pct} /></div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section>
        <div className="wrap">
          <Reveal className="section-head" style={{ display: "block" }}>
            <div className="eyebrow">Projects</div>
            <h2>Things I've shipped</h2>
            <p>A few products built end-to-end, from schema to UI.</p>
          </Reveal>

          <div className="proj-grid">
            {PROJECTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal as="div" className={`card proj-card ${i % 2 ? "reveal-delay-1" : ""}`} key={p.title}>
                  <div className={`proj-thumb ${p.cls}`}><Icon size={52} color="#fff" /></div>
                  <div className="proj-body">
                    <div className="proj-title">{p.title}</div>
                    <p className="proj-desc">{p.desc}</p>
                    <div className="proj-tags">
                      {p.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                    </div>
                    <div className="proj-actions">
                      <RippleButton href="#" className="btn-ghost"><Github size={15} /> GitHub</RippleButton>
                      <RippleButton href="#" className="btn-primary"><ExternalLink size={15} /> Live Demo</RippleButton>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section>
        <div className="wrap">
          <Reveal className="section-head" style={{ display: "block" }}>
            <div className="eyebrow">Services</div>
            <h2>What I can build for you</h2>
            <p>End-to-end product work, from interface to server.</p>
          </Reveal>
          <div className="serv-grid">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal as="div" className={`card serv-card reveal-delay-${i + 1}`} key={s.title}>
                  <div className={`serv-ill ${s.cls}`}><Icon size={24} color="#fff" /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ACHIEVEMENTS ================= */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="stats-band">
              {STATS.map((s) => (
                <div className="stat" key={s.label}>
                  <Counter value={s.count} suffix={s.suffix} />
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CERTIFICATIONS ================= */}
      <section>
        <div className="wrap">
          <Reveal className="section-head" style={{ display: "block" }}>
            <div className="eyebrow">Certifications</div>
            <h2>Learning, formalized</h2>
            <p>Courses and certifications backing up the hands-on work.</p>
          </Reveal>
          <div className="cert-row">
            {CERTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal as="div" className={`card cert-card reveal-delay-${(i % 4) + 1}`} key={c.title}>
                  <div className="cert-preview"><Icon size={26} color="#fff" /></div>
                  <div className="cert-info">
                    <div className="cert-title">{c.title}</div>
                    <div className="cert-sub">{c.sub}</div>
                  </div>
                  <span className={`cert-status ${c.status === "In progress" ? "progress" : ""}`}>{c.status}</span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WORKSPACE ================= */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="glass workspace-grid">
              <div className="laptop">
                <div>
                  <div className="laptop-screen"><div className="laptop-screen-inner" /></div>
                  <div className="laptop-base" />
                </div>
              </div>
              <div>
                <div className="eyebrow">Workspace</div>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 18 }}>Where the code happens</h2>
                <div className="ws-items">
                  {WORKSPACE_ITEMS.map((w) => {
                    const Icon = w.icon;
                    return (
                      <div className="card ws-item" key={w.label}>
                        <Icon size={19} />
                        <span>{w.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SOCIAL ================= */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="glass social-card">
              <div className="eyebrow">Connect</div>
              <h2 style={{ fontSize: 26, fontWeight: 800 }}>Find me around the web</h2>
              <div className="social-row">
                {SOCIALS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a href="#" className="social-btn" title={s.label} key={s.label}>
                      <Icon size={21} />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact">
        <div className="wrap">
          <Reveal>
            <div className="glass contact-card">
              <div className="contact-inner">
                <div>
                  <div className="eyebrow">Get in touch</div>
                  <h2>Let's build something amazing together 🚀</h2>
                  <p>Have a project in mind or an idea for a business dashboard? I'd love to hear about it.</p>
                  <div className="contact-actions">
                    <RippleButton href="#" className="btn-primary"><Mail size={16} /> Send Email</RippleButton>
                    <RippleButton href="#" className="btn-ghost"><Calendar size={16} /> Schedule Meeting</RippleButton>
                  </div>
                </div>
                <div className="contact-list">
                  <div className="card contact-row"><Mail size={18} /><div><div className="label">Email</div><div className="value">amaan.saifi.dev@gmail.com</div></div></div>
                  <div className="card contact-row"><Phone size={18} /><div><div className="label">Phone</div><div className="value">+91 98765 43210</div></div></div>
                  <div className="card contact-row"><MapPin size={18} /><div><div className="label">Location</div><div className="value">Uttar Pradesh, India</div></div></div>
                  <div className="card contact-row"><Clock size={18} /><div><div className="label">Availability</div><div className="value">Open to new opportunities</div></div></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="wrap footer-inner">
          <p>Made with <span className="heart">❤</span> by <strong style={{ color: "var(--text)" }}>Amaan Saifi</strong></p>
          <p>© 2026 · Tailor Management System</p>
        </div>
      </footer>
    </div>
  );
}



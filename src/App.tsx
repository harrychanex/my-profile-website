import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronLeft, ChevronRight, Menu, X, Plus, Minus, ChevronDown,
  Monitor, Phone, Calendar,
  MessageCircle, Mail,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Project Data (business language) ─── */
const projects = [
  {
    id: 1,
    title: 'Knightsbridge Lounge',
    category: 'Food & Beverage',
    description: 'Luxury shisha lounge — built a dark, cinematic web presence that matches their premium brand.',
    image: '/projects/knightsbridge-poster.jpg',
    video: '/projects/knightsbridge.mp4',
  },
  {
    id: 2,
    title: 'Kanto Café',
    category: 'Food & Beverage',
    description: 'Filipino-Korean fusion bakery — created their first online menu and ordering experience.',
    image: '/projects/kanto-cafe-poster.jpg',
    video: '/projects/kanto-cafe.mp4',
  },
  {
    id: 3,
    title: 'SparkGenie Education',
    category: 'Education',
    description: "Bilingual children's education platform — designed to help parents find and book classes easily.",
    image: '/projects/sparkgenie-poster.jpg',
    video: '/projects/sparkgenie.mp4',
  },
  {
    id: 4,
    title: 'MOBA Barber',
    category: 'Lifestyle',
    description: "Italian barber shop — built their first-ever website with online booking integration.",
    image: '/projects/moba-barber-poster.jpg',
    video: '/projects/moba-barber.mp4',
  },
];

const categories = ['All', 'Food & Beverage', 'Lifestyle', 'Education'];

/* ─── FAQ Data ─── */
const faqs = [
  {
    question: 'What does your process look like?',
    answer: 'Simple: Discovery call \u2192 Proposal \u2192 Build \u2192 Launch \u2192 Support. We start with a free 15-minute call to understand your business, then send you a clear proposal with pricing. Once approved, we build and launch \u2014 usually within 2\u20134 weeks for websites.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Websites: 2\u20134 weeks from start to launch. AI Phone Reception: live within 24 hours of setup. Booking systems: 1\u20132 weeks. We always give you a clear timeline before starting.',
  },
  {
    question: 'Do you work with small independent businesses?',
    answer: "That\u2019s exactly who I work with. From barber shops to restaurants to caf\u00e9s \u2014 if you\u2019re an independent business owner who wants to grow, we should talk.",
  },
  {
    question: 'How does the AI phone reception actually work?',
    answer: "It\u2019s like having a super-reliable receptionist. When customers call, AI answers naturally \u2014 it knows your menu, hours, and booking rules. It books tables or appointments automatically and sends confirmations via WhatsApp. Complex calls get forwarded to you. Try it yourself \u2014 WhatsApp us for a private demo.",
  },
  {
    question: "What if I already have a website but it\u2019s outdated?",
    answer: "I do redesigns too. Send me your current URL via WhatsApp and I\u2019ll give you a free audit with specific recommendations on what to improve.",
  },
  {
    question: 'What are your prices?',
    answer: "Websites from \u00a31,500. AI Phone Reception from \u00a3149/month. Booking Systems from \u00a399/month. Every project gets a custom quote based on your specific needs \u2014 no hidden fees.",
  },
];

/* ─── AI Reception data ─── */
const comparisonRows = [
  { label: 'Monthly cost', staff: '\u00a3960+', ai: 'From \u00a3149' },
  { label: 'Available', staff: 'Limited hours', ai: '24/7/365' },
  { label: 'Misses calls?', staff: 'Up to 40%', ai: 'Never' },
  { label: 'Sick days?', staff: 'Yes', ai: 'Never' },
  { label: 'Books tables?', staff: 'Sometimes', ai: 'Always' },
];

const aiSteps = [
  { num: '01', title: 'We learn your business', desc: 'Menu, hours, booking rules \u2014 everything your customers ask about.' },
  { num: '02', title: 'AI answers your phone', desc: 'Natural voice, handles enquiries, takes bookings instantly.' },
  { num: '03', title: 'Bookings flow in automatically', desc: 'WhatsApp confirmations, email alerts, calendar sync.' },
  { num: '04', title: 'Complex calls go to you', desc: 'Complaints and special requests are forwarded to your mobile.' },
];

/* ─── Service Features for FeatureCard grid ─── */
const serviceFeatures = [
  {
    title: 'Website Design & Redesign',
    icon: Monitor,
    description: 'A stunning website that works as hard as you do. Designed to convert visitors into paying customers — not just look pretty. From £1,500.',
  },
  {
    title: 'AI Phone Reception',
    icon: Phone,
    description: 'An AI receptionist that answers your phone 24/7, books tables and appointments, and never calls in sick. From £149/mo.',
  },
  {
    title: 'Booking & Management Systems',
    icon: Calendar,
    description: 'Let customers book online without calling. Reduce no-shows with automatic reminders. From £99/mo.',
  },
];

/* ─── AnimatedContainer (motion) ─── */
function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Globe Canvas Component ─── */
function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const DOT_COUNT = 1200;
    const RADIUS = Math.min(width, height) * 0.38;
    let angle = 0;

    const dots: { theta: number; phi: number }[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      dots.push({ theta, phi: Math.asin(y) });
      void r;
    }

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      angle += 0.003;

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < DOT_COUNT; i++) {
        const { theta, phi } = dots[i];
        const rotTheta = theta + angle;
        const x3 = RADIUS * Math.cos(phi) * Math.cos(rotTheta);
        const y3 = RADIUS * Math.sin(phi);
        const z3 = RADIUS * Math.cos(phi) * Math.sin(rotTheta);
        const fov = RADIUS * 2.5;
        const scale = fov / (fov + z3 + RADIUS);
        const px = cx + x3 * scale;
        const py = cy - y3 * scale;
        const normalizedZ = (z3 + RADIUS) / (2 * RADIUS);
        const alpha = 0.15 + normalizedZ * 0.85;
        const dotSize = 0.8 + normalizedZ * 1.0;

        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      }
      frameRef.current = requestAnimationFrame(render);
    }

    render();

    const onResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="globe-canvas" />;
}

/* ─── FAQ Item Component ─── */
function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-8 text-left gap-6"
        aria-expanded={open}
      >
        <span
          className="flex-1 leading-tight"
          style={{
            fontSize: 'clamp(18px, 2.2vw, 28px)',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '-0.02em',
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {String(index + 1).padStart(2, '0')}. {question}
        </span>
        <span className="flex-shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div
        ref={answerRef}
        className="faq-answer"
        style={{
          maxHeight: open ? `${answerRef.current?.scrollHeight ?? 400}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <p className="pb-8 max-w-[700px] leading-relaxed" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
    MAIN APP
═══════════════════════════════════════════ */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroVideoEnded, setHeroVideoEnded] = useState(false);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimatingRef = useRef(false);
  const servicesRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const frameSectionRef = useRef<HTMLElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameIndexRef = useRef(0);
  const aiRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  /* ─── Navbar scroll ─── */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── Hero carousel helpers — semicircular arc ─── */
  const getCardStyle = useCallback((index: number, active: number) => {
    const total = projects.length;
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);
    const arcSpread = 48;
    const angleDeg = diff * arcSpread;
    const angleRad = (angleDeg * Math.PI) / 180;
    const radiusX = 440;
    const radiusY = 100;

    const x = Math.sin(angleRad) * radiusX;
    const y = (1 - Math.cos(angleRad)) * radiusY;

    const scale = absDiff === 0 ? 1 : absDiff === 1 ? 0.82 : 0.65;
    const opacity = absDiff <= 1 ? 1 : absDiff === 2 ? 0.4 : 0;
    const blur = absDiff === 0 ? 0 : absDiff === 1 ? 2 : 5;
    const brightness = absDiff === 0 ? 1 : 0.55;
    const zIndex = 10 - absDiff;
    const overlayOpacity = absDiff === 0 ? 0 : absDiff === 1 ? 0.35 : 0.6;

    return { x, y, scale, opacity, blur, brightness, zIndex, overlayOpacity };
  }, []);

  const goToHero = useCallback((target: number) => {
    if (isAnimatingRef.current) return;
    const N = projects.length;
    const next = ((target % N) + N) % N;

    isAnimatingRef.current = true;
    heroCardsRef.current.forEach((card, i) => {
      if (!card) return;
      const s = getCardStyle(i, next);
      gsap.to(card, {
        x: s.x,
        y: s.y,
        scale: s.scale,
        opacity: s.opacity,
        filter: `blur(${s.blur}px) brightness(${s.brightness})`,
        zIndex: s.zIndex,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: i === 0 ? () => { isAnimatingRef.current = false; } : undefined,
      });
      const overlay = card.querySelector<HTMLDivElement>('.card-overlay');
      if (overlay) {
        gsap.to(overlay, { opacity: s.overlayOpacity, duration: 0.5 });
      }
    });
    setHeroIndex(next);
  }, [getCardStyle]);

  const heroNext = useCallback(() => goToHero(heroIndex + 1), [heroIndex, goToHero]);
  const heroPrev = useCallback(() => goToHero(heroIndex - 1), [heroIndex, goToHero]);

  /* ─── Set initial hero card positions ─── */
  useEffect(() => {
    heroCardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, { opacity: 0, y: 50 });
    });
  }, []);

  useEffect(() => {
    if (!heroVideoEnded) return;
    heroCardsRef.current.forEach((card, i) => {
      if (!card) return;
      const s = getCardStyle(i, 0);
      gsap.fromTo(card,
        {
          x: s.x, y: s.y + 50, scale: s.scale, opacity: 0,
          filter: `blur(${s.blur}px) brightness(${s.brightness})`,
          zIndex: s.zIndex,
        },
        {
          x: s.x, y: s.y, opacity: s.opacity,
          filter: `blur(${s.blur}px) brightness(${s.brightness})`,
          duration: 1.1, delay: 0.4 + i * 0.08, ease: 'power2.out',
        }
      );
      const overlay = card.querySelector<HTMLDivElement>('.card-overlay');
      if (overlay) gsap.set(overlay, { opacity: s.overlayOpacity });
    });
  }, [heroVideoEnded, getCardStyle]);

  /* ─── Hero auto-advance ─── */
  useEffect(() => {
    if (!heroVideoEnded) return;
    const timer = setInterval(() => heroNext(), 5000);
    return () => clearInterval(timer);
  }, [heroNext, heroVideoEnded]);

  /* ─── Keyboard nav ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') heroNext();
      if (e.key === 'ArrowLeft') heroPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [heroNext, heroPrev]);

  /* ─── Scroll-driven frame sequence ─── */
  useEffect(() => {
    const FRAME_COUNT = 145;
    const canvas = frameCanvasRef.current;
    const section = frameSectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pendingFrame: number | null = null;
    let rafId = 0;

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(frameIndexRef.current);
    };

    const drawFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
      frameIndexRef.current = index;
    };

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const padded = String(i).padStart(4, '0');
      img.src = `/frames/${padded}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          sizeCanvas();
          drawFrame(0);
        }
      };
      images[i] = img;
    }

    const scheduleFrame = (index: number) => {
      pendingFrame = index;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (pendingFrame !== null && pendingFrame !== frameIndexRef.current) {
            drawFrame(pendingFrame);
          }
          rafId = 0;
          pendingFrame = null;
        });
      }
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const index = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * (FRAME_COUNT - 1)));
        scheduleFrame(index);
      },
    });

    window.addEventListener('resize', sizeCanvas);
    return () => {
      st.kill();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', sizeCanvas);
    };
  }, []);

  /* ─── ScrollTrigger animations ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Services
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelector('.services-header'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: servicesRef.current, start: 'top 80%' } }
        );
        gsap.fromTo(
          servicesRef.current.querySelectorAll('.service-card'),
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: servicesRef.current.querySelector('.services-grid'), start: 'top 85%' } }
        );
      }

      // Works
      if (worksRef.current) {
        gsap.fromTo(
          worksRef.current.querySelector('.works-header'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: worksRef.current, start: 'top 80%' } }
        );
        gsap.fromTo(
          worksRef.current.querySelectorAll('.work-card'),
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: worksRef.current.querySelector('.works-grid'), start: 'top 85%' } }
        );
      }

      // AI Section
      if (aiRef.current) {
        gsap.fromTo(
          aiRef.current.querySelectorAll('.ai-anim'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: aiRef.current, start: 'top 75%' } }
        );
      }

      // About
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current.querySelectorAll('.about-anim'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' } }
        );
      }

      // FAQ
      if (faqRef.current) {
        gsap.fromTo(
          faqRef.current.querySelector('.faq-header'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: faqRef.current, start: 'top 80%' } }
        );
      }

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.querySelectorAll('.cta-anim'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' } }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ─── Filtered projects ─── */
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const navItems = ['Work', 'Services', 'AI Reception', 'About', 'Contact'];

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Grain texture */}
      <svg className="grain-overlay" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ═══════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 w-full z-50 flex items-center justify-between transition-all duration-500 ${navScrolled ? 'navbar-scrolled' : ''}`}
        style={{
          padding: '0 clamp(20px, 4vw, 56px)',
          height: '72px',
          background: navScrolled ? undefined : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      >
        <a
          href="#"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: "'Syne', sans-serif",
          }}
        >
          HARRY CHAN
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >
              {item}
            </a>
          ))}
          <a
            href="https://wa.me/447442242155?text=Hi%20Harry%2C%20I%27d%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '12px', letterSpacing: '0.06em' }}
          >
            GET STARTED
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden"
          style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
          style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(16px)', animation: 'fadeUp 0.3s ease-out both' }}
        >
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '36px',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="https://wa.me/447442242155?text=Hi%20Harry%2C%20I%27d%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ marginTop: '12px' }}
            onClick={() => setMenuOpen(false)}
          >
            GET STARTED
          </a>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          HERO — Video + Arc Carousel
      ═══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Hero background video */}
        <video
          ref={heroVideoRef}
          muted
          playsInline
          autoPlay
          onEnded={() => setHeroVideoEnded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
          src="/hero-bg.mp4"
        />

        {/* Dark overlay for text clarity */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1,
          }}
        />

        {/* Tagline text — visible until video ends, then fades out */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            textAlign: 'center',
            opacity: heroVideoEnded ? 0 : 1,
            transition: 'opacity 0.8s ease',
            pointerEvents: heroVideoEnded ? 'none' : 'auto',
            width: '90%',
            maxWidth: '700px',
          }}
        >
          <h1
            className="fade-up"
            style={{
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: '14px',
            }}
          >
            Your business deserves<br />to be seen.
          </h1>
          <p
            className="fade-up fade-up-d1"
            style={{
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
            }}
          >
            I build websites, AI systems, and booking tools that bring customers to your door.
          </p>
        </div>

        {/* Stats row — appears after video ends */}
        <div
          style={{
            position: 'absolute',
            top: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(16px, 3vw, 32px)',
            flexWrap: 'wrap',
            opacity: heroVideoEnded ? 1 : 0,
            transition: 'opacity 0.8s ease 0.6s',
          }}
        >
          {['48+ Projects Delivered', '7+ Years Experience', 'Cambridge, UK'].map((stat, i) => (
            <span
              key={i}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {stat}
            </span>
          ))}
        </div>

        {/* Spacer to push carousel down */}
        <div style={{ paddingTop: '420px' }} />

        {/* Arc carousel */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            flex: '1 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
          }}
        >
          {/* Subtle arc track */}
          <div style={{
            position: 'absolute',
            width: '880px',
            height: '200px',
            bottom: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            borderRadius: '50% 50% 0 0',
            pointerEvents: 'none',
          }} />

          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={el => { heroCardsRef.current[index] = el; }}
              className="hero-card"
              onClick={() => goToHero(index)}
              style={{
                width: 'min(48vw, 520px)',
                aspectRatio: '16/10',
              }}
            >
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.image}
                  muted
                  loop
                  playsInline
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )}
              <div className="card-overlay" style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, borderRadius: '12px' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '18px 22px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  borderRadius: '0 0 12px 12px',
                }}
              >
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
                  {project.category}
                </p>
                <h3 style={{ fontSize: '17px', fontWeight: 500, color: '#fff', letterSpacing: '-0.02em' }}>
                  {project.title}
                </h3>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            onClick={heroPrev}
            className="hero-nav-arrow"
            style={{ position: 'absolute', left: 'clamp(12px, 3vw, 40px)', zIndex: 30, opacity: heroVideoEnded ? 1 : 0, pointerEvents: heroVideoEnded ? 'auto' : 'none', transition: 'opacity 0.6s ease' }}
            aria-label="Previous project"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={heroNext}
            className="hero-nav-arrow"
            style={{ position: 'absolute', right: 'clamp(12px, 3vw, 40px)', zIndex: 30, opacity: heroVideoEnded ? 1 : 0, pointerEvents: heroVideoEnded ? 'auto' : 'none', transition: 'opacity 0.6s ease' }}
            aria-label="Next project"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Dot pagination */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '28px',
            marginBottom: '40px',
            opacity: heroVideoEnded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goToHero(i)}
              className={`dot-pill ${i === heroIndex ? 'active' : 'inactive'}`}
              style={{ height: '5px', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            color: 'rgba(255,255,255,0.25)',
            opacity: heroVideoEnded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCROLL FRAME SEQUENCE
      ═══════════════════════════════════════════ */}
      <section
        ref={frameSectionRef}
        style={{ position: 'relative', height: '400vh', background: '#000' }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <canvas
            ref={frameCanvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES — FeatureCard Grid
      ═══════════════════════════════════════════ */}
      <section
        ref={servicesRef}
        id="services"
        style={{
          background: '#000',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <AnimatedContainer className="mx-auto max-w-3xl text-center services-header">
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
              className="text-balance"
            >
              Three ways I grow your business
            </h2>
            <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
              No jargon. No fluff. Just tools that bring you more customers and save you money.
            </p>
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.4}
            className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3 services-grid"
          >
            {serviceFeatures.map((feature, i) => (
              <FeatureCard key={i} feature={feature} />
            ))}
          </AnimatedContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SELECTED WORKS
      ═══════════════════════════════════════════ */}
      <section
        ref={worksRef}
        id="work"
        style={{
          background: '#000',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div className="works-header" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', color: '#fff', marginBottom: '8px', lineHeight: 1.1 }}>
              Selected works
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)' }}>
              Real projects for real businesses.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))', gap: '20px' }}>
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="work-card img-wrap"
                style={{ borderRadius: '12px', overflow: 'hidden', background: '#111', cursor: 'pointer', position: 'relative', aspectRatio: '16/10' }}
              >
                {project.video ? (
                  <video
                    src={project.video}
                    poster={project.image}
                    muted loop playsInline autoPlay
                    className="img-scale"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="img-scale"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(20px, 3vw, 32px)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
                        {project.category}
                      </span>
                      <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '6px' }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', maxWidth: '360px' }}>
                        {project.description}
                      </p>
                    </div>
                    <span className="work-card-arrow" style={{ fontSize: '22px', color: '#fff', marginLeft: '16px', flexShrink: 0 }}>
                      &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          AI RECEPTION DEEP-DIVE
      ═══════════════════════════════════════════ */}
      <section
        ref={aiRef}
        id="ai-reception"
        style={{
          position: 'relative',
          background: '#000',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="ai-anim" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
              CallGenius AI
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}>
              Your staff can choose not to answer.<br />AI never does.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', maxWidth: '520px', margin: '0 auto' }}>
              AI phone reception built for UK restaurants and salons.
            </p>
          </div>

          {/* Comparison table */}
          <div className="ai-anim comparison-table" style={{ marginBottom: 'clamp(48px, 6vw, 72px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
            <table>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ width: '35%' }}></th>
                  <th className="staff-col" style={{ width: '32.5%' }}>Your Current Staff</th>
                  <th style={{ width: '32.5%', color: '#fff' }}>CallGenius AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.label}</td>
                    <td className="staff-col">{row.staff}</td>
                    <td className="ai-col">{row.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How it works */}
          <div className="ai-anim">
            <h3 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#fff', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 48px)' }}>
              How it works
            </h3>
          </div>

          <div
            className="ai-anim"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '16px',
              marginBottom: 'clamp(48px, 6vw, 72px)',
            }}
          >
            {aiSteps.map((step) => (
              <div key={step.num} className="step-card">
                <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'Syne', sans-serif", color: 'rgba(255,255,255,0.2)', display: 'block', marginBottom: '12px' }}>
                  {step.num}
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Demo CTA */}
          <div className="ai-anim" style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px 32px', maxWidth: '520px', margin: '0 auto 20px' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                Live demo coming soon
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                WhatsApp us to arrange a private demo for your business.
              </p>
            </div>
            <a
              href="https://wa.me/447442242155?text=Hi%20Harry%2C%20I%27m%20interested%20in%20the%20AI%20phone%20reception%20demo."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '18px 36px', fontSize: '15px' }}
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════ */}
      <section
        ref={aboutRef}
        id="about"
        style={{
          background: '#000',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
        >
          {/* Visual block */}
          <div
            className="about-anim"
            style={{
              aspectRatio: '4/5',
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #0a0a0a 0%, #080808 40%, #0c0c0c 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 'clamp(80px, 12vw, 140px)', fontWeight: 800, fontFamily: "'Syne', sans-serif", color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.04em', userSelect: 'none' }}>
              HC
            </span>
          </div>

          {/* Text */}
          <div className="about-anim">
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
              About
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>
              Meet Harry
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '16px' }}>
              I&rsquo;m Harry &mdash; a Cambridge-based digital consultant who&rsquo;s spent 7+ years helping businesses look and perform better online.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '16px' }}>
              I started by building websites for local shops, and now I specialise in AI-powered tools that save business owners time and money.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '28px' }}>
              When I&rsquo;m not building, I&rsquo;m coaching badminton to 40+ students across Cambridge. I bring the same energy to every project: obsessive attention to detail, honest advice, and results that actually matter to your bottom line.
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Technologies I work with
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['React', 'Next.js', 'Supabase', 'Retell AI', 'Vercel'].map(tech => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
      <section
        ref={faqRef}
        style={{
          background: '#000',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 56px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="faq-header" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>
              Common questions
            </h2>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTACT / CTA
      ═══════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        id="contact"
        style={{
          position: 'relative',
          background: '#000',
          padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 56px)',
          textAlign: 'center',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <GlobeCanvas />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="cta-anim" style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.08, marginBottom: '16px' }}>
            Ready to grow<br />your business?
          </h2>
          <p className="cta-anim" style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginBottom: '40px' }}>
            Book a free 15-minute call. No pressure, no commitment.
          </p>

          <div className="cta-anim" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a
              href="https://wa.me/447442242155?text=Hi%20Harry%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '18px 36px', fontSize: '15px' }}
            >
              <MessageCircle size={18} />
              WhatsApp Me Now
            </a>
            <a
              href="mailto:harrychanex@gmail.com"
              className="btn-outline"
              style={{ padding: '18px 36px', fontSize: '15px' }}
            >
              <Mail size={18} />
              Send an Email
            </a>
          </div>

          <div className="cta-anim" style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
              Or find me on
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {['Instagram', 'LinkedIn'].map(s => (
                <a
                  key={s}
                  href="#"
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          <p className="cta-anim" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
            Cambridge, UK &middot; harrychanex@gmail.com
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{ background: '#000', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 56px) clamp(32px, 4vw, 48px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '48px', marginBottom: '56px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', color: '#fff', marginBottom: '16px', fontFamily: "'Syne', sans-serif" }}>
              HARRY CHAN
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '220px' }}>
              Crafting digital experiences that bring customers to your door.
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Work</p>
            {['Portfolio', 'Case Studies', 'Results'].map(link => (
              <a key={link} href="#work" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', lineHeight: 2.2, transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >{link}</a>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Services</p>
            {['Website Design', 'AI Phone Reception', 'Booking Systems'].map(link => (
              <a key={link} href="#services" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', lineHeight: 2.2, transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >{link}</a>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Connect</p>
            {[
              { label: 'WhatsApp', href: 'https://wa.me/447442242155' },
              { label: 'Email', href: 'mailto:harrychanex@gmail.com' },
              { label: 'Instagram', href: '#' },
              { label: 'LinkedIn', href: '#' },
            ].map(link => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', lineHeight: 2.2, transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >{link.label}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '1120px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>&copy; 2026 Harry Chan. All rights reserved.</span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>Built in Cambridge, UK.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Menu, X, Plus, Minus } from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Project Data ─── */
const projects = [
  {
    id: 1,
    title: 'SparkGenie',
    category: 'Education',
    description: 'Children\'s English education platform with playful illustrations and bilingual interface.',
    image: '/projects/sparkgenie-poster.jpg',
    video: '/projects/sparkgenie.mp4',
  },
  {
    id: 2,
    title: 'Kanto Café',
    category: 'Food & Beverage',
    description: 'Filipino-Korean fusion bakery with immersive 3D product showcase and online ordering.',
    image: '/projects/kanto-cafe-poster.jpg',
    video: '/projects/kanto-cafe.mp4',
  },
  {
    id: 3,
    title: 'Knightsbridge',
    category: 'Hospitality',
    description: 'Luxury London lounge with dark cinematic web presence and atmospheric branding.',
    image: '/projects/knightsbridge-poster.jpg',
    video: '/projects/knightsbridge.mp4',
  },
  {
    id: 4,
    title: 'MOBA Barber',
    category: 'Lifestyle',
    description: 'Italian barber shop with bold visual identity and dynamic team showcase.',
    image: '/projects/moba-barber-poster.jpg',
    video: '/projects/moba-barber.mp4',
  },
];

const categories = ['All', 'Education', 'Food & Beverage', 'Hospitality', 'Lifestyle'];

const services = [
  {
    title: 'Web Design',
    description: 'Pixel-perfect interfaces crafted for conversion and delight. Every layout decision is intentional.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Development',
    description: 'Clean, performant code that brings designs to life with precision and speed.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Brand Identity',
    description: 'Visual systems that communicate with clarity and resonate with your audience.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Motion Design',
    description: 'Subtle animations that elevate the experience and guide users naturally.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  },
];

const faqs = [
  {
    question: 'What does your design process look like?',
    answer: 'We start with a discovery phase to understand your goals, audience, and competitive landscape. From there we move into strategy, wireframing, visual design, and development — with your input at every stage. The result is a product that truly reflects your brand.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Most projects run between 6 and 12 weeks depending on scope. A focused brand identity refresh can be completed in 3–4 weeks, while a full website build with custom interactions typically takes 8–12 weeks. We\'ll provide a clear timeline before work begins.',
  },
  {
    question: 'Do you work with startups and early-stage companies?',
    answer: 'Absolutely. Some of our best work has been with early-stage companies who needed to establish a strong brand presence quickly. We offer flexible engagement models to suit different budgets and timelines.',
  },
  {
    question: 'What technologies do you build with?',
    answer: 'We work primarily with React, Next.js, and Webflow for web builds, paired with Framer Motion or GSAP for animations. For e-commerce we use Shopify. We always recommend the right tool for the job rather than forcing a single stack.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer: 'Yes. We offer monthly retainer packages for ongoing design, development, and content updates. Many clients continue working with us after launch to iterate on features and keep their digital presence sharp.',
  },
];

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

    // Pre-compute dots on a sphere using Fibonacci lattice
    const dots: { theta: number; phi: number }[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      dots.push({ theta, phi: Math.asin(y) });
      void r; // used in render loop below
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

        // 3D sphere coords
        const x3 = RADIUS * Math.cos(phi) * Math.cos(rotTheta);
        const y3 = RADIUS * Math.sin(phi);
        const z3 = RADIUS * Math.cos(phi) * Math.sin(rotTheta);

        // Simple perspective projection
        const fov = RADIUS * 2.5;
        const scale = fov / (fov + z3 + RADIUS);
        const px = cx + x3 * scale;
        const py = cy - y3 * scale;

        // Depth-based opacity
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
    <div
      className="border-b"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-8 text-left gap-6"
        aria-expanded={open}
      >
        <span
          className="flex-1 leading-tight"
          style={{
            fontSize: 'clamp(20px, 2.5vw, 32px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif",
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
        <p
          className="pb-8 max-w-[700px] leading-relaxed"
          style={{
            fontSize: '14.6px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [heroIndex, setHeroIndex] = useState(0);
  const [servicesPage, setServicesPage] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const heroCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const frameSectionRef = useRef<HTMLElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const statsRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const isAnimatingRef = useRef(false);

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

    // Arc geometry — cards sit on a semicircle
    const arcSpread = 48; // degrees between each card
    const angleDeg = diff * arcSpread;
    const angleRad = (angleDeg * Math.PI) / 180;
    const radiusX = 440;
    const radiusY = 100;

    const x = Math.sin(angleRad) * radiusX;
    const y = (1 - Math.cos(angleRad)) * radiusY; // 0 at center, rises on sides

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
        onComplete: i === 0 ? () => {
          isAnimatingRef.current = false;
        } : undefined,
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
  }, [getCardStyle]);

  /* ─── Hero auto-advance ─── */
  useEffect(() => {
    const timer = setInterval(() => heroNext(), 5000);
    return () => clearInterval(timer);
  }, [heroNext]);

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

    // Size canvas to fill viewport (retina-aware)
    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Redraw current frame after resize
      drawFrame(frameIndexRef.current);
    };

    // Draw image with "cover" behaviour
    const drawFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover calc
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
      frameIndexRef.current = index;
    };

    // Preload all frames
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
    framesRef.current = images;

    // Use rAF to batch scroll updates for smoothness
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

    // ScrollTrigger to scrub through frames
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
      // Stats — counter animation
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll<HTMLElement>('.stat-item');
        gsap.fromTo(statEls,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
          }
        );
        statsRef.current.querySelectorAll<HTMLElement>('.stat-number').forEach(el => {
          const target = parseInt(el.getAttribute('data-target') ?? '0', 10);
          const suffix = el.getAttribute('data-suffix') ?? '';
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
            onUpdate() {
              el.textContent = Math.round(obj.val) + suffix;
            },
          });
        });
      }

      // Selected Works
      if (worksRef.current) {
        gsap.fromTo(
          worksRef.current.querySelector('.works-header'),
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: worksRef.current, start: 'top 80%' },
          }
        );
        gsap.fromTo(
          worksRef.current.querySelectorAll('.work-card'),
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power2.out',
            scrollTrigger: { trigger: worksRef.current.querySelector('.works-grid'), start: 'top 80%' },
          }
        );
      }

      // Services
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelector('.services-header'),
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: servicesRef.current, start: 'top 80%' },
          }
        );
      }

      // Trust Banner
      if (trustRef.current) {
        gsap.fromTo(
          trustRef.current.querySelectorAll('.trust-item'),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: trustRef.current, start: 'top 80%' },
          }
        );
      }

      // FAQ
      if (faqRef.current) {
        gsap.fromTo(
          faqRef.current.querySelector('.faq-header'),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: faqRef.current, start: 'top 80%' },
          }
        );
      }

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.querySelectorAll('.cta-anim'),
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ─── Filtered projects ─── */
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  /* ─── Avatar colors for Trust Banner ─── */
  const avatarColors = ['#c9a84c', '#e85d9a', '#5ba3c9', '#6dba6d', '#c94040'];

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════ */}
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 flex items-center justify-between transition-all duration-500 ${navScrolled ? 'navbar-scrolled' : ''}`}
        style={{ padding: '0 56px', height: '72px' }}
      >
        <a
          href="#"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none',
          }}
        >
          HARRY CHAN
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Work', 'Services', 'About', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontSize: '13.6px',
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
            href="#contact"
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '12px' }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
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
          style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(12px)', animation: 'fadeUp 0.3s ease-out both' }}
        >
          {['Work', 'Services', 'About', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '40px',
                fontWeight: 300,
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════
          HERO
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
        {/* Background image of active project */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${projects[heroIndex].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.8s ease',
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 75%, #000 100%)',
          }}
        />

        {/* Hero text content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            paddingTop: '120px',
            paddingBottom: '60px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <h1
            className="fade-up"
            style={{
              fontSize: 'clamp(44px, 6vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.06em',
              lineHeight: 1.05,
              color: '#fff',
              marginBottom: '32px',
            }}
          >
            Design that<br />makes it real
          </h1>
          <p
            className="fade-up fade-up-d1"
            style={{
              fontSize: '15px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '36px',
              letterSpacing: '-0.01em',
            }}
          >
            Crafting premium digital experiences.
          </p>
          <div className="fade-up fade-up-d2">
            <a href="#work" className="btn-primary">
              View Portfolio
            </a>
          </div>
        </div>

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
          {/* Subtle arc track hint */}
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
              {/* Dark overlay (controlled by GSAP) */}
              <div
                className="card-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#000',
                  opacity: 0,
                  borderRadius: '12px',
                }}
              />
              {/* Text overlay */}
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

          {/* Left arrow */}
          <button
            onClick={heroPrev}
            className="hero-nav-arrow"
            style={{ position: 'absolute', left: 'clamp(12px, 3vw, 40px)', zIndex: 30 }}
            aria-label="Previous project"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right arrow */}
          <button
            onClick={heroNext}
            className="hero-nav-arrow"
            style={{ position: 'absolute', right: 'clamp(12px, 3vw, 40px)', zIndex: 30 }}
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
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
          {/* Subtle vignette overlay */}
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
          STATS
      ═══════════════════════════════════════════ */}
      <section
        ref={statsRef}
        style={{ background: '#000', padding: '80px 56px', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '14.9px',
              color: '#ddd',
              textAlign: 'center',
              marginBottom: '64px',
              letterSpacing: '-0.01em',
            }}
          >
            Trusted by clients who believe in exceptional digital craft.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row' as const,
              flexWrap: 'wrap' as const,
              justifyContent: 'center',
              gap: '64px',
              textAlign: 'center',
            }}
          >
            {[
              { num: 48, suffix: '+', label: 'Projects Delivered' },
              { num: 12, suffix: '', label: 'Awards Won' },
              { num: 7, suffix: '+', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div
                  className="stat-number"
                  data-target={stat.num}
                  data-suffix={stat.suffix}
                  style={{
                    fontSize: 'clamp(48px, 5vw, 72px)',
                    fontWeight: 300,
                    letterSpacing: '-0.06em',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  0
                </div>
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '11.8px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SELECTED WORKS
      ═══════════════════════════════════════════ */}
      <section
        ref={worksRef}
        id="work"
        style={{ background: '#fff', padding: '100px 56px', color: '#000' }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

          {/* Header */}
          <div className="works-header" style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: 'clamp(36px, 4vw, 50px)',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                color: '#000',
                marginBottom: '10px',
                lineHeight: 1.1,
              }}
            >
              Selected works
            </h2>
            <p style={{ fontSize: '14.6px', color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.01em' }}>
              A curated collection of recent projects.
            </p>
          </div>

          {/* Category tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap' as const,
              gap: '8px',
              marginBottom: '48px',
              overflowX: 'auto',
            }}
          >
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

          {/* Works grid */}
          <div className="works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))', gap: '24px' }}>
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="work-card img-wrap"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#111',
                  cursor: 'pointer',
                  position: 'relative',
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
                {/* Text overlay at bottom left */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '28px 32px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <h3
                        style={{
                          fontSize: 'clamp(22px, 2.5vw, 33px)',
                          fontWeight: 400,
                          color: '#fff',
                          letterSpacing: '-0.03em',
                          lineHeight: 1.1,
                          marginBottom: '6px',
                        }}
                      >
                        {project.title}
                      </h3>
                      <p style={{ fontSize: '14.6px', color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.01em' }}>
                        {project.description}
                      </p>
                    </div>
                    <span
                      className="work-card-arrow"
                      style={{ fontSize: '24px', color: '#fff', marginLeft: '16px', flexShrink: 0 }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════ */}
      <section
        ref={servicesRef}
        id="services"
        style={{ background: '#fff', padding: '100px 0 80px', color: '#000', borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 56px' }}>
          {/* Header row */}
          <div
            className="services-header"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              alignItems: 'start',
              marginBottom: '56px',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(32px, 3.5vw, 50px)',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                color: '#000',
                lineHeight: 1.1,
              }}
            >
              Everything you need<br />in one studio
            </h2>
            <p
              style={{
                fontSize: '14.6px',
                color: 'rgba(0,0,0,0.5)',
                letterSpacing: '-0.01em',
                lineHeight: 1.65,
                paddingTop: '8px',
              }}
            >
              From brand strategy to live website, we handle every layer of your digital presence. One team, one vision, one seamless process.
            </p>
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div
          className="services-scroll"
          style={{ display: 'flex', gap: '16px', padding: '0 56px', paddingRight: '40px' }}
        >
          {services.map((service, i) => (
            <div
              key={i}
              className="service-scroll-card"
              style={{
                width: '430px',
                height: '583px',
                borderRadius: '12px',
                background: '#2f2f2f',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <img
                src={service.image}
                alt={service.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.55 }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '32px',
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    marginBottom: '10px',
                  }}
                >
                  {service.title}
                </h3>
                <p style={{ fontSize: '11.8px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {service.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot pagination for services */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '36px',
          }}
        >
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setServicesPage(i)}
              className={`dot-pill ${i === servicesPage ? 'active' : 'inactive'}`}
              style={{ height: '5px', border: 'none', cursor: 'pointer', padding: 0, background: i === servicesPage ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)' }}
              aria-label={`Service page ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST BANNER
      ═══════════════════════════════════════════ */}
      <section
        ref={trustRef}
        style={{
          background: '#000',
          padding: '100px 56px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Avatar row */}
        <div
          className="trust-item"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}
        >
          {avatarColors.map((color, i) => (
            <div
              key={i}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: color,
                border: '2px solid #000',
                marginLeft: i === 0 ? 0 : '-12px',
                position: 'relative',
                zIndex: 5 - i,
              }}
            />
          ))}
        </div>
        <h2
          className="trust-item"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 500,
            color: '#fff',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          Trusted by forward-thinking brands worldwide
        </h2>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
      <section
        ref={faqRef}
        id="about"
        style={{
          background: '#000',
          padding: '100px 56px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="faq-header" style={{ marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: 'clamp(32px, 3.5vw, 50px)',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                color: '#fff',
                lineHeight: 1.1,
              }}
            >
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
          CTA — Particle Globe
      ═══════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        id="contact"
        style={{
          position: 'relative',
          background: '#000',
          padding: '120px 56px',
          textAlign: 'center',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <GlobeCanvas />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2
            className="cta-anim"
            style={{
              fontSize: 'clamp(42px, 6vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.041em',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
          >
            Start your project<br />today
          </h2>
          <p
            className="cta-anim"
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '44px',
              letterSpacing: '-0.01em',
            }}
          >
            No commitment required. Let&rsquo;s explore the possibilities.
          </p>
          <div className="cta-anim">
            <a href="mailto:hello@harrychan.co" className="btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer
        style={{
          background: '#000',
          padding: '80px 56px 48px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#fff',
                marginBottom: '16px',
              }}
            >
              HARRY CHAN
            </p>
            <p style={{ fontSize: '14.6px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '200px' }}>
              Crafting premium digital experiences that make it real.
            </p>
          </div>

          {/* Work */}
          <div>
            <p
              style={{
                fontSize: '11.8px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Work
            </p>
            {['Portfolio', 'Case Studies', 'Process', 'Results'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  display: 'block',
                  fontSize: '14.6px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  lineHeight: 2,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Services */}
          <div>
            <p
              style={{
                fontSize: '11.8px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Services
            </p>
            {['Web Design', 'Development', 'Brand Identity', 'Motion Design'].map(link => (
              <a
                key={link}
                href="#services"
                style={{
                  display: 'block',
                  fontSize: '14.6px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  lineHeight: 2,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Connect */}
          <div>
            <p
              style={{
                fontSize: '11.8px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Connect
            </p>
            {['Email', 'LinkedIn', 'Dribbble', 'Instagram'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  display: 'block',
                  fontSize: '14.6px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  lineHeight: 2,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'row' as const,
            flexWrap: 'wrap' as const,
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            &copy; 2026 Harry Chan. All rights reserved.
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            Made with care in Hong Kong.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;

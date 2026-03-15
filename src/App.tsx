import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import './App.css';

/* ─── Project Data ─── */
const projects = [
  {
    id: 1,
    title: 'Lumina Lounge',
    category: 'Chapter 1',
    subtitle: 'Hospitality Experience',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    color: '#c9a84c',
  },
  {
    id: 2,
    title: 'Nova Academy',
    category: 'Chapter 2',
    subtitle: 'Education Platform',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    color: '#e85d9a',
  },
  {
    id: 3,
    title: 'Aether AI',
    category: 'Chapter 3',
    subtitle: 'Technology Product',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    color: '#c94040',
  },
  {
    id: 4,
    title: 'Monarch Estates',
    category: 'Chapter 4',
    subtitle: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    color: '#5ba3c9',
  },
  {
    id: 5,
    title: 'Pulse Fitness',
    category: 'Chapter 5',
    subtitle: 'Wellness Brand',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&w=800&q=80',
    color: '#6dba6d',
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  /* ─── Mouse parallax tracking ─── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalize to -1 … +1 from center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  }, []);

  /* ─── Calculate card transforms ─── */
  const getCardStyle = useCallback((index: number, active: number) => {
    const diff = index - active;
    const absDiff = Math.abs(diff);

    // Center card: flat, large, bright
    // Side cards: rotated on Y-axis, scaled down, pushed back, dimmed
    const rotateY = diff * 42;            // degrees of rotation
    const translateX = diff * 30;         // % horizontal spread
    const translateZ = -absDiff * 180;    // push side cards back
    const scale = absDiff === 0 ? 1 : 0.78;
    const opacity = absDiff > 2 ? 0 : absDiff > 1 ? 0.25 : absDiff === 1 ? 0.6 : 1;
    const brightness = absDiff === 0 ? 1 : 0.35;

    return {
      transform: `translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      filter: `brightness(${brightness})`,
      zIndex: 10 - absDiff,
    };
  }, []);

  /* ─── Animate to index ─── */
  const goTo = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || index < 0 || index >= projects.length) return;
    setIsAnimating(true);

    // Animate all cards to their new positions
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const style = getCardStyle(i, index);
      gsap.to(card, {
        duration: 0.9,
        ease: 'power3.inOut',
        ...style,
        onComplete: i === index ? () => {
          setCurrentIndex(index);
          setIsAnimating(false);
        } : undefined,
      });
    });
  }, [currentIndex, isAnimating, getCardStyle]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  /* ─── Keyboard ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  /* ─── Initial entrance animation ─── */
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const style = getCardStyle(i, 0);
      // Start from below and faded
      gsap.fromTo(card,
        { y: 80, ...style, opacity: 0 },
        { ...style, y: 0, duration: 1.2, delay: 0.3 + i * 0.08, ease: 'power2.out' }
      );
    });
  }, [getCardStyle]);

  return (
    <div className="min-h-screen bg-[#0c1a22] text-white">

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 md:px-14 h-20">
        <a href="#" className="text-sm font-semibold tracking-[0.1em] text-white/80 hover:text-white transition-colors">
          HARRY CHAN
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/40 hover:text-white transition-colors z-50">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0c1a22]/98 backdrop-blur-sm flex flex-col items-center justify-center gap-10"
          style={{ animation: 'fadeUp 0.3s ease-out forwards' }}>
          {['Work', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              className="text-4xl md:text-5xl font-light tracking-tight text-white/80 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          HERO — 3D Card-Pick Carousel
          Large heading on top, 3D fanned cards below
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} onMouseMove={handleMouseMove}
        className="relative w-full h-screen flex flex-col items-center overflow-hidden">

        {/* ── Atmospheric background gradient ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 30%, rgba(45,85,105,0.35) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 50% 80%, rgba(20,50,70,0.4) 0%, transparent 60%),
              linear-gradient(to bottom, #0c1a22 0%, #0f2230 40%, #0c1a22 100%)
            `
          }}
        />

        {/* ── Heading ── */}
        <div className="relative z-10 flex flex-col items-center text-center pt-24 md:pt-28 px-6">
          <h1 className="fade-up overflow-visible leading-[0.95]">
            <span className="block text-[14vw] md:text-[9vw] lg:text-[7.5vw] font-bold tracking-[-0.03em] uppercase"
              style={{ color: 'rgba(125,181,197,0.55)', letterSpacing: '-0.02em' }}>
              Portfolio
            </span>
            <span className="block text-[8vw] md:text-[4.5vw] lg:text-[3.8vw] font-light italic text-white/80 -mt-[1vw] md:-mt-[0.5vw]"
              style={{ fontFamily: "'Georgia', serif" }}>
              selected works
            </span>
          </h1>

          <p className="fade-up fade-up-d1 mt-4 text-sm md:text-base text-white/30 tracking-wide max-w-md">
            A curated collection of recent projects
          </p>
        </div>

        {/* ── 3D Card Carousel ── */}
        <div className="carousel-scene absolute bottom-[6vh] md:bottom-[8vh] w-full flex items-center justify-center"
          style={{ height: '55vh' }}>

          {projects.map((project, index) => {
            const style = getCardStyle(index, currentIndex);

            return (
              <div
                key={project.id}
                ref={el => { cardsRef.current[index] = el; }}
                className="carousel-card absolute cursor-pointer rounded-lg overflow-hidden"
                onClick={() => goTo(index)}
                style={{
                  width: 'min(50vw, 380px)',
                  height: '100%',
                  ...style,
                  transition: 'none', // GSAP handles transitions
                }}
              >
                {/* Image with parallax on active card */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  style={{
                    transform: index === currentIndex
                      ? `translate(${-mouse.x * 15}px, ${-mouse.y * 10}px) scale(1.08)`
                      : 'scale(1.02)',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 rounded-lg"
                  style={{
                    background: `linear-gradient(to top,
                      ${project.color}44 0%,
                      rgba(12,26,34,0.6) 35%,
                      rgba(12,26,34,0.15) 55%,
                      transparent 100%
                    )`,
                  }}
                />

                {/* Card content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-sm font-light italic text-white/60"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    {project.category}
                  </span>
                  <h2 className="mt-1 text-xl md:text-2xl font-bold tracking-tight uppercase text-white/95 leading-tight"
                    style={{ color: project.color }}>
                    {project.title}
                  </h2>
                </div>

                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    boxShadow: index === currentIndex
                      ? `0 0 60px ${project.color}22, 0 20px 60px rgba(0,0,0,0.5)`
                      : '0 10px 40px rgba(0,0,0,0.6)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Nav Arrows (edge-mounted like reference) ── */}
        <button onClick={prev} disabled={currentIndex === 0 || isAnimating}
          className="nav-arrow absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30
                     w-12 h-12 rounded-full bg-black/30 border border-white/10
                     flex items-center justify-center text-white/70 backdrop-blur-sm">
          <ChevronLeft size={22} />
        </button>
        <button onClick={next} disabled={currentIndex === projects.length - 1 || isAnimating}
          className="nav-arrow absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30
                     w-12 h-12 rounded-full bg-black/30 border border-white/10
                     flex items-center justify-center text-white/70 backdrop-blur-sm">
          <ChevronRight size={22} />
        </button>

        {/* ── Progress indicator ── */}
        <div className="absolute bottom-[2vh] left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {projects.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} disabled={isAnimating}
              className={`rounded-full transition-all duration-500
                ${i === currentIndex
                  ? 'w-3 h-3 bg-white/70'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 border-y border-white/[0.06] bg-[#0a1820]">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-16 text-center">
          {[
            { num: '48+', label: 'Projects Delivered' },
            { num: '12', label: 'Awards Won' },
            { num: '7+', label: 'Years Experience' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-light tracking-tight text-white/85">{s.num}</div>
              <div className="mt-2 text-[11px] tracking-[0.16em] uppercase text-white/30">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="overflow-hidden whitespace-nowrap py-10 border-b border-white/[0.06]">
        <div className="flex">
          {[0, 1].map(i => (
            <div key={i} className="animate-marquee inline-block text-3xl md:text-4xl font-light tracking-tight uppercase text-white/8 px-4"
              aria-hidden={i > 0}>
              Design • Development • Strategy • Branding • E-commerce • Architecture •&nbsp;
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SELECTED WORKS GRID ═══ */}
      <section id="work" className="py-28 md:py-36 px-8 md:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 md:flex md:justify-between md:items-end">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">Portfolio</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/85">Selected Works</h2>
            </div>
            <p className="mt-6 md:mt-0 text-base text-white/30 max-w-sm leading-relaxed">
              A curated collection of recent projects spanning hospitality, education, technology, and beyond.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="group cursor-pointer img-wrap">
                <div className="aspect-[16/10] overflow-hidden bg-[#111820] rounded-lg">
                  <img src={project.image} alt={project.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 img-scale" />
                </div>
                <div className="mt-5 space-y-1">
                  <span className="text-[10px] tracking-[0.16em] uppercase text-white/25">{project.subtitle}</span>
                  <h3 className="text-xl font-medium tracking-tight text-white/75 group-hover:text-white transition-colors">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-28 md:py-36 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">Studio</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/85 leading-tight">
              Design that<br />moves people
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-white/35 leading-relaxed">
              Crafting premium digital experiences where every element serves a purpose and every interaction feels intentional.
            </p>
            <p className="text-base text-white/25 leading-relaxed">
              From concept to launch, we partner with forward-thinking brands to create websites that are as functional as they are beautiful.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-28 md:py-36 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">Services</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/85">What we do</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {[
              { title: 'Web Design', desc: 'Pixel-perfect interfaces crafted for conversion and delight.' },
              { title: 'Development', desc: 'Clean, performant code that brings designs to life.' },
              { title: 'Brand Identity', desc: 'Visual systems that communicate with clarity.' },
              { title: 'Motion Design', desc: 'Subtle animations that elevate the experience.' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0c1a22] p-10 hover:bg-white/[0.02] transition-colors duration-500">
                <div className="text-xs text-white/15 mb-8">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-lg font-medium text-white/75 tracking-tight">{s.title}</h3>
                <p className="mt-4 text-sm text-white/25 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="contact" className="py-32 lg:py-44 px-6 border-t border-white/[0.06] text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white/85 leading-[1.05]">
            Ready to stand out?
          </h2>
          <p className="text-lg text-white/30 max-w-xl mx-auto leading-relaxed">
            Get started today and build a digital experience that leaves a lasting impression.
          </p>
          <div className="pt-4">
            <a href="#"
              className="inline-block px-10 py-5 bg-white text-[#0c1a22] text-sm font-semibold tracking-[0.08em] uppercase hover:bg-white/90 transition-colors rounded-sm">
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-14 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-[0.08em] text-white/50">HARRY CHAN</span>
          <span className="text-xs tracking-wide text-white/20">© 2026 All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

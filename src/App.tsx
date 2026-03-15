import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ArrowLeft, Menu, X } from 'lucide-react';
import './App.css';

/* ─── Project Data ─── */
const projects = [
  {
    id: 1,
    title: 'Lumina Lounge',
    category: 'Hospitality',
    description: 'An immersive venue experience with fluid transitions and atmospheric design.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 2,
    title: 'Nova Academy',
    category: 'Education',
    description: 'A modern learning platform built to scale across courses and students.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 3,
    title: 'Aether AI',
    category: 'Technology',
    description: 'Product storytelling that converts curiosity into action.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 4,
    title: 'Monarch Estates',
    category: 'Real Estate',
    description: 'Refined property presentation where architecture speaks for itself.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 5,
    title: 'Pulse Fitness',
    category: 'Wellness',
    description: 'High-energy brand site with dynamic schedules and seamless membership.',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&w=1400&q=80',
  },
];

/* ─── Constants ─── */
const CARD_WIDTH_VW = 52;
const CARD_GAP_VW = 2.5;
const STEP_VW = CARD_WIDTH_VW + CARD_GAP_VW;

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  /* ─── Navigate ─── */
  const goTo = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || index < 0 || index >= projects.length) return;
    setIsAnimating(true);
    gsap.to(trackRef.current, {
      x: `${-index * STEP_VW}vw`,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        setCurrentIndex(index);
        setIsAnimating(false);
      },
    });
  }, [currentIndex, isAnimating]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  /* ─── Keyboard nav ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  /* ─── Initial entrance ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(trackRef.current, { x: '6vw' }, { x: 0, duration: 1.4, ease: 'power2.out', delay: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 md:px-14 h-20">
        <a href="#" className="text-base font-semibold tracking-[0.08em] text-white/90">
          HARRY CHAN
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/50 hover:text-white transition-colors">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808]/98 backdrop-blur-sm flex flex-col items-center justify-center gap-10">
          {['Work', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              className="text-4xl md:text-5xl font-light tracking-tight text-white/90 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          HERO — Squarespace Composition
          Heading + CTA centered top, gallery track below
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen flex flex-col items-center overflow-hidden">

        {/* ── Heading + CTA ── */}
        <div className="relative z-10 flex flex-col items-center text-center pt-32 md:pt-36 px-6">
          <h1 className="fade-up text-[11vw] md:text-[6.5vw] lg:text-[5.5vw] font-light tracking-[-0.04em] leading-[1.05] text-white/95">
            A website makes it real
          </h1>
          <div className="fade-up fade-up-delay-1 mt-8">
            <a href="#contact"
              className="inline-block px-8 py-4 bg-white text-black text-sm font-semibold tracking-[0.08em] uppercase hover:bg-white/90 transition-colors">
              Get Started
            </a>
          </div>
          <p className="fade-up fade-up-delay-2 mt-4 text-sm text-white/40 tracking-wide">
            Start for free. No credit card required.
          </p>
        </div>

        {/* ── Gallery Track ── */}
        <div className="absolute bottom-[8vh] md:bottom-[6vh] w-full">
          <div
            ref={trackRef}
            className="hero-track flex items-end"
            style={{ paddingLeft: `${(100 - CARD_WIDTH_VW) / 2}vw`, gap: `${CARD_GAP_VW}vw` }}
          >
            {projects.map((project, index) => {
              const isActive = index === currentIndex;
              const distance = Math.abs(index - currentIndex);

              return (
                <div
                  key={project.id}
                  className="gallery-card flex-shrink-0 relative overflow-hidden cursor-pointer"
                  onClick={() => goTo(index)}
                  style={{
                    width: `${CARD_WIDTH_VW}vw`,
                    height: isActive ? '42vh' : '34vh',
                    opacity: distance > 1 ? 0.2 : distance === 1 ? 0.5 : 1,
                    filter: isActive ? 'none' : 'brightness(0.55) saturate(0.7)',
                    transition: 'height 0.8s cubic-bezier(0.25,1,0.5,1), opacity 0.8s ease, filter 0.8s ease',
                  }}
                >
                  {/* Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0"
                    style={{
                      background: isActive
                        ? 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.2) 50%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.3) 100%)',
                    }}
                  />

                  {/* Content — active card only */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                      <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
                        {project.category}
                      </span>
                      <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white/95 leading-tight">
                        {project.title}
                      </h2>
                      <p className="mt-3 text-sm text-white/45 max-w-md leading-relaxed hidden md:block">
                        {project.description}
                      </p>
                      <button className="mt-5 group inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase text-white/70 hover:text-white transition-colors">
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Label — side cards */}
                  {!isActive && distance <= 1 && (
                    <div className="absolute bottom-6 left-6">
                      <span className="text-[10px] tracking-[0.16em] uppercase text-white/40">{project.category}</span>
                      <h3 className="mt-1 text-base font-medium text-white/60 tracking-tight">{project.title}</h3>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Nav arrows ── */}
        <div className="absolute bottom-[3vh] left-8 md:left-14 flex items-center gap-3 z-20">
          <button onClick={prev} disabled={currentIndex === 0 || isAnimating}
            className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/60 hover:border-white/30 hover:text-white transition-all disabled:opacity-15 disabled:cursor-not-allowed">
            <ArrowLeft size={15} />
          </button>
          <button onClick={next} disabled={currentIndex === projects.length - 1 || isAnimating}
            className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/60 hover:border-white/30 hover:text-white transition-all disabled:opacity-15 disabled:cursor-not-allowed">
            <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Counter ── */}
        <div className="absolute bottom-[3vh] right-8 md:right-14 text-xs tracking-[0.14em] text-white/35 z-20">
          <span className="text-white/80">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="mx-2 opacity-30">—</span>
          <span>{String(projects.length).padStart(2, '0')}</span>
        </div>

        {/* ── Progress dots ── */}
        <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {projects.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} disabled={isAnimating}
              className={`h-[2px] transition-all duration-500 ${i === currentIndex ? 'w-8 bg-white/80' : 'w-3 bg-white/15 hover:bg-white/25'}`} />
          ))}
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="py-16 border-y border-white/[0.06] bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-16 text-center">
          <div>
            <div className="text-4xl font-light tracking-tight text-white/90">48+</div>
            <div className="mt-2 text-[11px] tracking-[0.16em] uppercase text-white/35">Projects Delivered</div>
          </div>
          <div>
            <div className="text-4xl font-light tracking-tight text-white/90">12</div>
            <div className="mt-2 text-[11px] tracking-[0.16em] uppercase text-white/35">Awards Won</div>
          </div>
          <div>
            <div className="text-4xl font-light tracking-tight text-white/90">7+</div>
            <div className="mt-2 text-[11px] tracking-[0.16em] uppercase text-white/35">Years Experience</div>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="overflow-hidden whitespace-nowrap py-10 border-b border-white/[0.06]">
        <div className="flex">
          <div className="animate-marquee inline-block text-3xl md:text-4xl font-light tracking-tight uppercase text-white/10 px-4">
            Design • Development • Strategy • Branding • E-commerce • Architecture •&nbsp;
          </div>
          <div className="animate-marquee inline-block text-3xl md:text-4xl font-light tracking-tight uppercase text-white/10 px-4" aria-hidden="true">
            Design • Development • Strategy • Branding • E-commerce • Architecture •&nbsp;
          </div>
        </div>
      </div>

      {/* ═══ SELECTED WORKS GRID ═══ */}
      <section id="work" className="py-28 md:py-36 px-8 md:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 md:flex md:justify-between md:items-end">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/35">Portfolio</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/90">Selected Works</h2>
            </div>
            <p className="mt-6 md:mt-0 text-base text-white/35 max-w-sm leading-relaxed">
              A curated collection of recent projects spanning hospitality, education, technology, and beyond.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="group cursor-pointer img-wrap">
                <div className="aspect-[16/10] overflow-hidden bg-[#111]">
                  <img src={project.image} alt={project.title}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100 img-scale" />
                </div>
                <div className="mt-5 space-y-1">
                  <span className="text-[10px] tracking-[0.16em] uppercase text-white/30">{project.category}</span>
                  <h3 className="text-xl font-medium tracking-tight text-white/80 group-hover:text-white transition-colors">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT / STUDIO ═══ */}
      <section id="about" className="py-28 md:py-36 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/35">Studio</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/90 leading-tight">
              Design that<br />moves people
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-white/40 leading-relaxed">
              Crafting premium digital experiences where every element serves a purpose and every interaction feels intentional.
            </p>
            <p className="text-base text-white/30 leading-relaxed">
              From concept to launch, we partner with forward-thinking brands to create websites that are as functional as they are beautiful.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-28 md:py-36 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/35">Services</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/90">What we do</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {[
              { title: 'Web Design', desc: 'Pixel-perfect interfaces crafted for conversion and delight.' },
              { title: 'Development', desc: 'Clean, performant code that brings designs to life.' },
              { title: 'Brand Identity', desc: 'Visual systems that communicate with clarity.' },
              { title: 'Motion Design', desc: 'Subtle animations that elevate the experience.' },
            ].map((s, i) => (
              <div key={i} className="bg-[#080808] p-10 hover:bg-white/[0.02] transition-colors duration-500">
                <div className="text-xs text-white/20 mb-8">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-lg font-medium text-white/80 tracking-tight">{s.title}</h3>
                <p className="mt-4 text-sm text-white/30 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="contact" className="py-32 lg:py-44 px-6 border-t border-white/[0.06] text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white/90 leading-[1.05]">
            Ready to stand out?
          </h2>
          <p className="text-lg text-white/35 max-w-xl mx-auto leading-relaxed">
            Get started today and build a digital experience that leaves a lasting impression.
          </p>
          <div className="pt-4">
            <a href="#"
              className="inline-block px-10 py-5 bg-white text-black text-sm font-semibold tracking-[0.08em] uppercase hover:bg-white/90 transition-colors">
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-14 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-[0.08em] text-white/60">HARRY CHAN</span>
          <span className="text-xs tracking-wide text-white/25">© 2026 All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

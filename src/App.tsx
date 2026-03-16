import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbitAngle = useRef(0);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  /* ─── Orbital carousel animation ─── */
  useEffect(() => {
    const N = projects.length;
    const speed = 0.003; // radians per frame
    const radiusX = 340; // horizontal spread (px)
    const verticalShift = 30; // cards at back shift up slightly

    let rafId: number;

    const animate = () => {
      if (!isHoveringOrbit) {
        orbitAngle.current += speed;
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const angle = orbitAngle.current + (Math.PI * 2 / N) * i;
        const x = Math.sin(angle) * radiusX;
        const z = Math.cos(angle); // -1 (back) to +1 (front)
        const y = -z * verticalShift; // back cards move up

        // Map z from [-1, 1] to visual properties
        const scale = 0.55 + (z + 1) * 0.275; // 0.55 → 1.1
        const opacity = 0.2 + (z + 1) * 0.4;  // 0.2 → 1.0
        const brightness = 0.3 + (z + 1) * 0.35; // 0.3 → 1.0
        const zIndex = Math.round((z + 1) * 10);

        card.style.transform = `translateX(${x}px) translateY(${y}px) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.filter = `brightness(${brightness})`;
        card.style.zIndex = String(zIndex);
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isHoveringOrbit]);

  /* ─── ScrollTrigger animations ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(statEls, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
        });
        const counters = statsRef.current.querySelectorAll('.stat-number');
        counters.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2, ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + (el.getAttribute('data-suffix') || '');
            },
          });
        });
      }

      // Selected Works
      if (worksRef.current) {
        const heading = worksRef.current.querySelector('.works-heading');
        if (heading) {
          gsap.fromTo(heading, { y: 60, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 85%' },
          });
        }
        const cards = worksRef.current.querySelectorAll('.work-card');
        gsap.fromTo(cards, { y: 80, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: worksRef.current.querySelector('.works-grid'), start: 'top 80%' },
        });
      }

      // About
      if (aboutRef.current) {
        const left = aboutRef.current.querySelector('.about-left');
        const right = aboutRef.current.querySelector('.about-right');
        if (left) gsap.fromTo(left, { x: -80, opacity: 0 }, {
          x: 0, opacity: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' },
        });
        if (right) gsap.fromTo(right, { x: 80, opacity: 0 }, {
          x: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' },
        });
      }

      // Services
      if (servicesRef.current) {
        const heading = servicesRef.current.querySelector('.services-heading');
        if (heading) gsap.fromTo(heading, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 85%' },
        });
        const cards = servicesRef.current.querySelectorAll('.service-card');
        gsap.fromTo(cards, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: servicesRef.current.querySelector('.services-grid'), start: 'top 80%' },
        });
      }

      // CTA
      if (ctaRef.current) {
        const h2 = ctaRef.current.querySelector('h2');
        const p = ctaRef.current.querySelector('p');
        const btn = ctaRef.current.querySelector('.cta-btn');
        if (h2) gsap.fromTo(h2, { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
        });
        if (p) gsap.fromTo(p, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
        });
        if (btn) gsap.fromTo(btn, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, delay: 0.4, ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

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
        <div className="fixed inset-0 z-40 bg-black/98 backdrop-blur-sm flex flex-col items-center justify-center gap-10"
          style={{ animation: 'fadeUp 0.3s ease-out forwards' }}>
          {['Work', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              className="text-4xl md:text-5xl font-light tracking-tight text-white/80 hover:text-white transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ═══ HERO — Orbital Carousel ═══ */}
      <section ref={heroRef}
        className="relative w-full h-screen flex flex-col items-center overflow-hidden">

        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 50% 80%, rgba(255,255,255,0.02) 0%, transparent 60%),
              linear-gradient(to bottom, #000000 0%, #0a0a0a 40%, #000000 100%)
            `
          }}
        />

        {/* Heading */}
        <div className="relative z-10 flex flex-col items-center text-center pt-24 md:pt-28 px-6">
          <h1 className="fade-up overflow-visible leading-[0.95]">
            <span className="block text-[14vw] md:text-[9vw] lg:text-[7.5vw] font-bold tracking-[-0.03em] uppercase"
              style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em' }}>
              Portfolio
            </span>
            <span className="block text-[8vw] md:text-[4.5vw] lg:text-[3.8vw] font-light italic text-white/60 -mt-[1vw] md:-mt-[0.5vw]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              selected works
            </span>
          </h1>
          <p className="fade-up fade-up-d1 mt-4 text-sm md:text-base text-white/30 tracking-wide max-w-md">
            A curated collection of recent projects
          </p>
        </div>

        {/* Orbital Carousel */}
        <div className="orbit-stage absolute bottom-[10vh] md:bottom-[12vh] w-full flex items-center justify-center"
          style={{ height: '50vh' }}
          onMouseEnter={() => setIsHoveringOrbit(true)}
          onMouseLeave={() => setIsHoveringOrbit(false)}>

          {/* Orbit track hint — subtle ellipse */}
          <div className="absolute w-[680px] h-[200px] border border-white/[0.03] rounded-[50%] pointer-events-none" />

          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={el => { cardsRef.current[index] = el; }}
              className="orbit-card absolute cursor-pointer rounded-lg overflow-hidden"
              style={{
                width: 'min(45vw, 340px)',
                aspectRatio: '16/9',
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                loading={index < 3 ? 'eager' : 'lazy'}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(to top,
                    ${project.color}55 0%,
                    rgba(0,0,0,0.5) 40%,
                    rgba(0,0,0,0.1) 60%,
                    transparent 100%
                  )`,
                }}
              />

              {/* Card content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <span className="text-xs font-light italic text-white/50"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {project.category}
                </span>
                <h2 className="mt-1 text-lg md:text-xl font-bold tracking-tight uppercase leading-tight"
                  style={{ color: project.color }}>
                  {project.title}
                </h2>
              </div>

              {/* Border glow */}
              <div className="absolute inset-0 rounded-lg pointer-events-none"
                style={{ boxShadow: `0 0 40px ${project.color}15, 0 15px 40px rgba(0,0,0,0.5)` }}
              />
            </div>
          ))}
        </div>

        {/* Orbit status */}
        <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 z-20">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">
            {isHoveringOrbit ? 'Paused' : 'Orbiting'}
          </span>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsRef} className="py-16 border-y border-white/[0.06] bg-[#050505]">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-16 text-center">
          {[
            { num: 48, suffix: '+', label: 'Projects Delivered' },
            { num: 12, suffix: '', label: 'Awards Won' },
            { num: 7, suffix: '+', label: 'Years Experience' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number text-4xl font-light tracking-tight text-white/85"
                data-target={s.num} data-suffix={s.suffix}>
                0
              </div>
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
              Design &bull; Development &bull; Strategy &bull; Branding &bull; E-commerce &bull; Architecture &bull;&nbsp;
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SELECTED WORKS GRID ═══ */}
      <section ref={worksRef} id="work" className="py-28 md:py-36 px-8 md:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="works-heading mb-20 md:flex md:justify-between md:items-end">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">Portfolio</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/85" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Selected Works</h2>
            </div>
            <p className="mt-6 md:mt-0 text-base text-white/30 max-w-sm leading-relaxed">
              A curated collection of recent projects spanning hospitality, education, technology, and beyond.
            </p>
          </div>
          <div className="works-grid grid md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="work-card group cursor-pointer img-wrap">
                <div className="aspect-[16/9] overflow-hidden bg-[#0a0a0a] rounded-lg">
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

      {/* ═══ ABOUT — right side flowing description text ═══ */}
      <section ref={aboutRef} id="about" className="relative py-28 md:py-36 px-8 md:px-14 border-t border-white/[0.06] overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="about-left">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">Studio</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/85 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Design that<br />moves people
            </h2>
            <div className="mt-12 flex gap-8">
              {['Concept', 'Design', 'Develop', 'Launch'].map((step, i) => (
                <div key={step} className="about-step">
                  <div className="text-[10px] text-white/15 mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <div className="text-sm font-medium text-white/40 tracking-tight">{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-right relative h-[360px] md:h-[420px] overflow-hidden"
            style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
            <div className="vertical-flow-text">
              {[0, 1].map((copy) => (
                <div key={copy} className="space-y-8 pb-8">
                  <p className="text-lg text-white/35 leading-relaxed">
                    Crafting premium digital experiences where every element serves a purpose and every interaction feels intentional.
                  </p>
                  <p className="text-base text-white/25 leading-relaxed">
                    From concept to launch, we partner with forward-thinking brands to create websites that are as functional as they are beautiful.
                  </p>
                  <p className="text-base text-white/25 leading-relaxed">
                    We believe great design is invisible — it guides without dictating, communicates without noise, and creates space for content to breathe.
                  </p>
                  <p className="text-base text-white/25 leading-relaxed">
                    Every pixel is placed with intent. Every animation timed to feel natural. We obsess over the details most people never notice — because those details are what separate good from unforgettable.
                  </p>
                  <p className="text-base text-white/25 leading-relaxed">
                    Our process starts with listening. Understanding your audience, your goals, and the story you need to tell. Then we distill that into a visual language that speaks louder than words.
                  </p>
                  <p className="text-base text-white/25 leading-relaxed">
                    Performance is not an afterthought. We build fast, accessible, and responsive — because the best design in the world means nothing if nobody waits for it to load.
                  </p>
                  <p className="text-base text-white/25 leading-relaxed">
                    We treat every project as a collaboration, not a transaction. Your ambition drives the work. Our craft shapes the execution.
                  </p>
                  <div className="h-px w-full bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section ref={servicesRef} id="services" className="py-28 md:py-36 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="services-heading text-center mb-20">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">Services</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-white/85" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>What we do</h2>
          </div>
          <div className="services-grid grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {[
              { title: 'Web Design', desc: 'Pixel-perfect interfaces crafted for conversion and delight.' },
              { title: 'Development', desc: 'Clean, performant code that brings designs to life.' },
              { title: 'Brand Identity', desc: 'Visual systems that communicate with clarity.' },
              { title: 'Motion Design', desc: 'Subtle animations that elevate the experience.' },
            ].map((s, i) => (
              <div key={i} className="service-card bg-black p-10 hover:bg-white/[0.02] transition-colors duration-500 group">
                <div className="text-xs text-white/15 mb-8 group-hover:text-white/30 transition-colors">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-lg font-medium text-white/75 tracking-tight">{s.title}</h3>
                <p className="mt-4 text-sm text-white/25 leading-relaxed">{s.desc}</p>
                <div className="mt-6 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} id="contact" className="py-32 lg:py-44 px-6 border-t border-white/[0.06] text-center overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white/85 leading-[1.05]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Ready to stand out?
          </h2>
          <p className="text-lg text-white/30 max-w-xl mx-auto leading-relaxed">
            Get started today and build a digital experience that leaves a lasting impression.
          </p>
          <div className="pt-4 cta-btn">
            <a href="#"
              className="magnetic-btn inline-block px-10 py-5 bg-white text-black text-sm font-semibold tracking-[0.08em] uppercase hover:bg-white/90 transition-colors rounded-sm">
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-14 px-8 md:px-14 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-[0.08em] text-white/50">HARRY CHAN</span>
          <span className="text-xs tracking-wide text-white/20">&copy; 2026 All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

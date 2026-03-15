import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Minimalist Retreat',
    category: 'Architecture',
    description: 'A study in form and context, creating spaces that breathe.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Brand Identity',
    category: 'Design',
    description: 'Crafting thoughtful visual systems for modern companies.',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Digital Platform',
    category: 'Technology',
    description: 'Seamless user experiences that drive engagement and growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
  }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-32">
      
      {/* Navigation Layer */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <a href="#" className="text-xl font-bold tracking-tight">Harry Chan</a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium">
            <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
            <a href="#services" className="hover:opacity-60 transition-opacity">Services</a>
            <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
          </div>

          <div className="hidden md:block">
            <a href="#contact" className="px-6 py-3 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6">
          <div className="flex flex-col space-y-6 text-2xl font-semibold">
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <div className="pt-6">
              <a href="#contact" onClick={() => setMenuOpen(false)} className="inline-block px-8 py-4 bg-black text-white text-lg rounded-sm w-full text-center">
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] max-w-5xl">
          Everything to showcase your project.
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
          Create an impactful, highly-polished presence online with beautiful typography, high-contrast layouts, and seamless performance.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a href="#contact" className="px-8 py-4 text-lg font-medium bg-black text-white rounded-sm hover:bg-gray-800 transition-colors inline-block">
            Start Building
          </a>
          <a href="#work" className="px-8 py-4 text-lg font-medium border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors inline-block">
            View Templates
          </a>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="overflow-hidden whitespace-nowrap py-12 border-y border-gray-100 bg-gray-50 hover-pause flex">
        <div className="animate-marquee inline-block text-4xl md:text-5xl font-bold tracking-tighter uppercase px-4">
          Design • Development • Strategy • Branding • E-commerce • Architecture • 
        </div>
        <div className="animate-marquee inline-block text-4xl md:text-5xl font-bold tracking-tighter uppercase px-4" aria-hidden="true">
          Design • Development • Strategy • Branding • E-commerce • Architecture • 
        </div>
      </div>

      {/* Image / Text Layout 1 */}
      <section id="work" className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              A canvas for your creativity.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Every section is designed to highlight your work without distraction. Ample whitespace, crisp typography, and large imagery bring your vision to life.
            </p>
            <a href="#" className="inline-flex items-center space-x-2 text-lg font-semibold hover:opacity-60 transition-opacity">
              <span>Explore features</span>
              <ArrowRight size={20} />
            </a>
          </div>
          <div className="order-1 lg:order-2 img-container overflow-hidden bg-gray-100 aspect-[4/5] rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
              alt="Creative workspace" 
              className="w-full h-full object-cover img-zoom"
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-24 bg-gray-50 border-y border-gray-100 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:flex md:justify-between md:items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Selected Works</h2>
              <p className="mt-4 text-xl text-gray-600">A showcase of premium project styles.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <div key={project.id} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden bg-gray-200 rounded-sm mb-6 img-container">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover img-zoom" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium tracking-widest text-gray-500 uppercase">{project.category}</p>
                  <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image / Text Layout 2 */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="img-container overflow-hidden bg-gray-100 aspect-square rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
              alt="Architecture detail" 
              className="w-full h-full object-cover img-zoom"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              Built to scale with your ideas.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Start with a simple portfolio, grow into an absolute powerhouse. The modular design approach means you can add layers of complexity anytime without sacrificing aesthetics.
            </p>
            <ul className="space-y-4 pt-4 border-t border-gray-200">
              <li className="flex items-center space-x-4">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                <span className="text-lg">Lightning fast performance</span>
              </li>
              <li className="flex items-center space-x-4">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                <span className="text-lg">SEO optimized structure</span>
              </li>
              <li className="flex items-center space-x-4">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                <span className="text-lg">Responsive across all devices</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Massive CTA */}
      <section id="contact" className="mt-20 py-32 lg:py-48 px-6 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            Ready to stand out?
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Get started today and build a digital experience that leaves a lasting impression.
          </p>
          <div className="pt-8">
            <a href="#" className="inline-block px-10 py-5 bg-white text-black text-lg font-bold rounded-sm hover:scale-105 transition-transform duration-300">
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-16 px-6 lg:px-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Products</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2 text-right md:text-left flex flex-col items-end md:items-start">
            <a href="#" className="text-2xl font-bold text-white tracking-tight mb-4">Harry Chan</a>
            <p className="text-sm max-w-xs">
              Minimal, functional, and beautiful digital experiences for modern brands.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Harry Chan. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

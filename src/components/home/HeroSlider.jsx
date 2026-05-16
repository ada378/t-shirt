import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    title: 'New Collection',
    subtitle: 'Premium Fashion 2026',
    desc: 'Discover bold streetwear crafted for those who define their own style.',
    btnText: 'Explore Collection',
    btn2Text: 'View Lookbook',
    link: '/products',
    link2: '/products/t-shirts',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&q=90',
    badge: 'NEW SEASON',
    accent: '#d4a853',
  },
  {
    title: 'Summer Edit',
    subtitle: 'Up to 40% Off',
    desc: 'Curated summer essentials. Lightweight fabrics, vibrant colors, effortless style.',
    btnText: 'Shop Summer Sale',
    btn2Text: 'All Products',
    link: '/products?sort=bestseller',
    link2: '/products',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=90',
    badge: 'LIMITED TIME',
    accent: '#d4a853',
  },
  {
    title: 'Street Style',
    subtitle: 'T-Shirts & Hoodies',
    desc: 'Bold graphics. Premium comfort. Make a statement with every outfit.',
    btnText: 'Shop the Look',
    btn2Text: 'View Hoodies',
    link: '/products/t-shirts',
    link2: '/products/hoodies',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1600&q=90',
    badge: 'TRENDING NOW',
    accent: '#d4a853',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ height: 'min(90vh, 700px)', minHeight: 520 }}>
      {/* Background image with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-6 h-px bg-[#d4a853]" />
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase px-3 py-1.5"
                  style={{ background: 'rgba(212,168,83,0.15)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.3)' }}
                >
                  {slide.badge}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-[#d4a853] text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-3">
                {slide.subtitle}
              </p>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-6 tracking-tight">
                {slide.title}
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-0.5 bg-[#d4a853]" />
                <div className="w-2 h-2 bg-[#d4a853] rotate-45" />
              </div>

              {/* Description */}
              <p className="text-neutral-300 text-sm md:text-lg leading-relaxed mb-8 max-w-md">
                {slide.desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={slide.link}
                  className="group inline-flex items-center gap-3 bg-[#d4a853] text-black px-8 py-4 font-bold text-sm uppercase tracking-[0.15em] hover:bg-[#e8bc5e] transition-all duration-300 rounded-sm"
                >
                  {slide.btnText}
                  <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <Link
                  to={slide.link2}
                  className="group inline-flex items-center gap-3 border border-white/40 text-white px-8 py-4 font-semibold text-sm uppercase tracking-[0.15em] hover:bg-white/10 hover:border-white/60 transition-all duration-300 rounded-sm backdrop-blur-sm"
                >
                  {slide.btn2Text}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center text-white transition-all duration-200 rounded-sm"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,168,83,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
      >
        <FiChevronLeft className="text-xl" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center text-white transition-all duration-200 rounded-sm"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,168,83,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
      >
        <FiChevronRight className="text-xl" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? '#d4a853' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 text-white/50 text-xs font-mono">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    badge: 'NEW SEASON 2026',
    subtitle: 'Premium Streetwear',
    title: ['Define', 'Your', 'Style'],
    desc: 'Crafted for those who lead. Premium quality, bold designs.',
    btn1: 'Shop Now', btn1Link: '/products',
    btn2: 'New Arrivals', btn2Link: '/products?sort=newest',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1800&q=90',
  },
  {
    badge: 'LIMITED TIME',
    subtitle: 'Summer Sale — Up to 40% Off',
    title: ['Summer', 'Edit', '2026'],
    desc: 'Lightweight fabrics, vibrant colors, effortless style.',
    btn1: 'Shop Sale', btn1Link: '/products?sort=bestseller',
    btn2: 'Hoodies', btn2Link: '/products/hoodies',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1800&q=90',
  },
  {
    badge: 'TRENDING NOW',
    subtitle: 'T-Shirts & Hoodies',
    title: ['Street', 'Culture', 'Wear'],
    desc: 'Bold graphics. Premium comfort. Make a statement.',
    btn1: 'Shop T-Shirts', btn1Link: '/products/t-shirts',
    btn2: 'Explore All', btn2Link: '/products',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1800&q=90',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => { setDir(1); setCurrent(p => (p + 1) % slides.length); }, 6500);
    return () => clearInterval(t);
  }, []);

  const go = (i) => { setDir(i > current ? 1 : -1); setCurrent(i); };
  const prev = () => { setDir(-1); setCurrent(c => (c - 1 + slides.length) % slides.length); };
  const next = () => { setDir(1); setCurrent(c => (c + 1) % slides.length); };
  const s = slides[current];

  return (
    <section className="relative overflow-hidden bg-black hero-section">
      {/* BG */}
      <AnimatePresence mode="sync">
        <motion.div key={current} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: 'easeInOut' }} className="absolute inset-0">
          <img src={s.image} alt="" className="w-full h-full object-cover object-center" loading="eager" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.2) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 45%)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Gold left line — desktop only */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 z-10 hidden md:block" style={{ background: 'linear-gradient(to bottom, transparent, #d4a853, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center md:items-start md:pt-20">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-14 md:py-0">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: dir * 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -30 }} transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }} className="max-w-xl">

              {/* Badge */}
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <div className="w-5 md:w-6 h-px" style={{ background: '#d4a853' }} />
                <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase px-2.5 py-1" style={{ background: 'rgba(212,168,83,0.12)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.3)' }}>
                  {s.badge}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-[11px] md:text-sm font-semibold uppercase tracking-[0.2em] mb-2 md:mb-3" style={{ color: '#d4a853' }}>
                {s.subtitle}
              </p>

              {/* Title */}
              <div className="mb-2 md:mb-4">
                {s.title.map((word, i) => (
                  <motion.span key={i} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                    className="block font-black leading-[0.88] tracking-tight"
                    style={{
                      fontSize: 'clamp(2.6rem, 9vw, 4.8rem)',
                      color: i === 1 ? 'transparent' : 'white',
                      WebkitTextStroke: i === 1 ? '1px rgba(255,255,255,0.35)' : '0',
                    }}>
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-px" style={{ background: '#d4a853' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#d4a853' }} />
              </div>

              {/* Desc */}
              <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-7 max-w-sm" style={{ color: '#bbb' }}>
                {s.desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Link to={s.btn1Link}
                  className="inline-flex items-center gap-2 font-bold text-xs md:text-sm uppercase tracking-[0.12em] px-5 md:px-7 py-2.5 md:py-3.5 transition-all duration-300"
                  style={{ background: '#d4a853', color: '#000' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e8c46a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#d4a853'}>
                  {s.btn1} <FiArrowRight />
                </Link>
                <Link to={s.btn2Link}
                  className="inline-flex items-center gap-2 font-semibold text-xs md:text-sm uppercase tracking-[0.12em] px-5 md:px-7 py-2.5 md:py-3.5 transition-all duration-300 text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {s.btn2}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows — smaller on mobile */}
      <button onClick={prev} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white transition-all duration-200"
        style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,83,0.35)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
        <FiChevronLeft className="text-base md:text-xl" />
      </button>
      <button onClick={next} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white transition-all duration-200"
        style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,83,0.35)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
        <FiChevronRight className="text-base md:text-xl" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)} className="transition-all duration-300 rounded-full"
            style={{ width: i === current ? 24 : 6, height: 6, background: i === current ? '#d4a853' : 'rgba(255,255,255,0.35)' }} />
        ))}
      </div>

      {/* Counter — desktop only */}
      <div className="absolute bottom-5 right-6 z-20 font-mono text-xs hidden md:block" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {String(current + 1).padStart(2, '0')} <span style={{ color: '#d4a853' }}>/</span> {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}

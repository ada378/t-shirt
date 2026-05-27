import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts } from '../features/products/productSlice';
import HeroSlider from '../components/home/HeroSlider';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { useInView } from '../hooks/useInView';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiChevronRight } from 'react-icons/fi';
import { getProductImage, FALLBACK_IMG } from '../utils/imageUrl';

const categories = [
  { name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85', count: '48+ Designs', desc: 'Premium cotton tees' },
  { name: 'Hoodies', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85', count: '24+ Styles', desc: 'Cozy streetwear' },
  { name: 'Jeans', slug: 'jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=85', count: '18+ Fits', desc: 'Perfect fit, timeless' },
];

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'Orders above ₹499' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day policy' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here' },
];

const stats = [
  { value: '10K+', label: 'Customers' },
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Cities' },
  { value: '4.8★', label: 'Rating' },
];

const reviews = [
  { name: 'Priya S.', role: 'Fashion Enthusiast', text: 'Absolutely love the quality! The fabric is super soft and the fit is perfect.', rating: 5 },
  { name: 'Rahul M.', role: 'Verified Buyer', text: 'Fast delivery and amazing quality. The hoodie exceeded my expectations!', rating: 5 },
  { name: 'Ananya K.', role: 'Regular Customer', text: 'Great collection and reasonable prices. Customer service was very helpful.', rating: 5 },
  { name: 'Arjun S.', role: 'Style Enthusiast', text: 'The jeans fit like a dream. Perfect quality and style. Will order again!', rating: 5 },
  { name: 'Neha P.', role: 'Verified Buyer', text: 'Urban Monarch is my go-to for t-shirts. Great prints, fabric lasts long.', rating: 5 },
  { name: 'Vikram R.', role: 'Happy Customer', text: 'Ordered a hoodie for my brother — he loved it! Top-notch embroidery.', rating: 5 },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

function SectionLabel({ text, center }) {
  return (
    <div className={`flex items-center gap-3 mb-2 ${center ? 'justify-center' : ''}`}>
      <div className="w-6 h-px" style={{ background: '#d4a853' }} />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]" style={{ color: '#d4a853' }}>{text}</span>
      {center && <div className="w-6 h-px" style={{ background: '#d4a853' }} />}
    </div>
  );
}

function SectionHeader({ label, title, subtitle, link, center = false }) {
  return (
    <motion.div {...fadeUp} className={`mb-8 md:mb-12 ${center ? 'text-center' : 'flex items-end justify-between'}`}>
      <div>
        <SectionLabel text={label} center={center} />
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs md:text-sm mt-2 max-w-md mx-auto" style={{ color: '#666' }}>{subtitle}</p>}
      </div>
      {link && !center && (
        <Link to={link} className="hidden md:flex items-center gap-1 text-xs font-semibold flex-shrink-0 ml-4 transition-colors" style={{ color: '#666' }}
          onMouseEnter={e => e.currentTarget.style.color = '#d4a853'}
          onMouseLeave={e => e.currentTarget.style.color = '#666'}>
          View All <FiChevronRight />
        </Link>
      )}
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const { featured, bestSellers, newArrivals, loading } = useSelector((s) => s.products);

  // Lazy-load below-fold product sections
  const [newArrivalsRef, newArrivalsInView] = useInView({ rootMargin: '300px' });
  const [bestSellersRef, bestSellersInView] = useInView({ rootMargin: '300px' });

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <div style={{ background: '#0a0a0a' }}>

      {/* HERO */}
      <HeroSlider />

      {/* MOBILE QUICK PICKS */}
      {featured?.length > 0 && !loading && (
        <section className="sm:hidden bg-[#111] border-b border-[#1a1a1a] py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853]">Premium Picks</p>
                <h2 className="text-xl font-black text-white">Shop Best T-Shirts Now</h2>
              </div>
              <Link to="/products/t-shirts" className="text-xs uppercase tracking-[0.2em] text-[#d4a853] font-semibold">
                View All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {featured.slice(0, 3).map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="min-w-[210px] rounded-3xl overflow-hidden border border-white/10 bg-[#111] shadow-lg">
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-900 relative">
                    <img
                      loading="lazy"
                      src={getProductImage(product) || FALLBACK_IMG}
                      alt={product.title}
                      className="w-full h-full object-cover relative z-10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-6 h-6 border-2 border-neutral-600 border-t-neutral-300 rounded-full animate-spin" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#d4a853]">{product.category}</p>
                    <h3 className="text-sm font-semibold text-white leading-5 truncate">{product.title}</h3>
                    <p className="text-xs text-neutral-400 mt-2">₹{(product.discountPrice || product.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MARQUEE */}
      <div className="overflow-hidden py-2" style={{ background: '#d4a853' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="flex whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mx-6 md:mx-10">
              Free Shipping ₹499+ &nbsp;✦&nbsp; New Arrivals &nbsp;✦&nbsp; Premium Quality &nbsp;✦&nbsp; Easy Returns &nbsp;✦
            </span>
          ))}
        </motion.div>
      </div>

      {/* NEW ARRIVALS */}
      <section className="py-10 md:py-20" style={{ background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="New Arrivals" title="Fresh Drops" link="/products?sort=newest" />
          <div ref={newArrivalsRef} />
          {loading ? <ProductSkeleton /> : (
            newArrivals?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {newArrivalsInView && newArrivals?.slice(0, 8).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                {!newArrivalsInView && newArrivals?.slice(0, 8).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : null
          )}
          <div className="text-center mt-6 md:mt-10">
            <Link to="/products?sort=newest"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-[0.15em] px-6 md:px-10 py-3 md:py-4 transition-all duration-300"
              style={{ border: '1px solid #d4a853', color: '#d4a853' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4a853'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4a853'; }}>
              View All <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#111', borderBottom: '1px solid #1e1e1e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 md:gap-4 px-3 md:px-6 py-3 md:py-5 transition-colors"
                style={{
                  borderRight: i % 2 === 0 ? '1px solid #1e1e1e' : 'none',
                  borderBottom: i < 2 ? '1px solid #1e1e1e' : 'none',
                }}>
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0 rounded-sm" style={{ background: 'rgba(212,168,83,0.1)' }}>
                  <f.icon style={{ color: '#d4a853', fontSize: 15 }} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-white">{f.title}</p>
                  <p className="text-[10px] md:text-xs mt-0.5" style={{ color: '#555' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-10 md:py-20" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Collections" title="Shop by Category" subtitle="Curated premium fashion for those who demand the best." center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} {...fadeUp} transition={{ delay: i * 0.08 }}>
                <Link to={`/products/${cat.slug}`} className="group relative block overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img loading="lazy" src={cat.image} alt={cat.name} className="w-full h-full object-cover"
                    style={{ transition: 'transform 0.7s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1" style={{ background: 'rgba(212,168,83,0.92)', color: '#000' }}>{cat.count}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{cat.desc}</p>
                    <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3">{cat.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#d4a853' }}>
                      <span>Shop Now</span>
                      <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ border: '2px solid rgba(212,168,83,0.4)' }} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SALE BANNER */}
      <section style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            <motion.div {...fadeUp} className="flex flex-col justify-center py-8 md:py-14"
              style={{ borderLeft: '3px solid #d4a853', paddingLeft: 20 }}>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#d4a853' }}>⏳ Limited Time</span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-3 tracking-tight">
                Summer<br /><span style={{ color: '#d4a853' }}>Sale</span>
              </h2>
              <p className="text-xs md:text-sm leading-relaxed mb-6 max-w-xs" style={{ color: '#666' }}>
                Premium quality fashion for the season. Handpicked styles that define your vibe.
              </p>
              <div>
                <Link to="/products"
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-[0.15em] px-6 md:px-8 py-3 md:py-4 transition-all duration-300"
                  style={{ background: '#d4a853', color: '#000' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e8c46a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#d4a853'}>
                  Shop Now <FiArrowRight />
                </Link>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="hidden md:block relative overflow-hidden" style={{ minHeight: 380 }}>
              <img loading="lazy" src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=85" alt="Sale" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0a0a0a 0%, transparent 35%)' }} />
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full flex flex-col items-center justify-center" style={{ background: '#d4a853' }}>
                <span className="text-black text-[9px] font-bold uppercase">Up to</span>
                <span className="text-black text-xl font-black leading-none">40%</span>
                <span className="text-black text-[9px] font-bold uppercase">OFF</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-10 md:py-20" style={{ background: '#111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Best Sellers" title="Most Popular" link="/products?sort=bestseller" />
          <div ref={bestSellersRef} />
          {loading ? <ProductSkeleton /> : (
            bestSellers?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {bestSellersInView && bestSellers?.slice(0, 8).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                {!bestSellersInView && bestSellers?.slice(0, 8).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="py-8 md:py-14" style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }}
                className="text-center py-6 md:py-8 px-2"
                style={{ borderRight: i % 2 === 0 ? '1px solid #1a1a1a' : 'none', borderBottom: i < 2 ? '1px solid #1a1a1a' : 'none' }}>
                <p className="text-3xl md:text-5xl font-black mb-1" style={{ color: '#d4a853' }}>{s.value}</p>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.15em]" style={{ color: '#444' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-10 md:py-20" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Testimonials" title="What Customers Say" subtitle="Real reviews from real customers who love Urban Monarch." center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            {reviews.map((r, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                className="p-5 md:p-7 relative transition-all duration-300"
                style={{ background: '#111', border: '1px solid #1e1e1e' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,168,83,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}>
                <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: 'linear-gradient(to bottom, #d4a853, transparent)' }} />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => <FiStar key={j} className="text-xs fill-current" style={{ color: '#d4a853' }} />)}
                </div>
                <p className="text-xs md:text-sm leading-relaxed mb-4 italic" style={{ color: '#888' }}>"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'rgba(212,168,83,0.15)', color: '#d4a853' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{r.name}</p>
                    <p className="text-[10px]" style={{ color: '#444' }}>{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-10 md:py-20" style={{ background: '#111' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Why Choose Us" title="The Urban Monarch Difference" center />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: '✦', title: 'Premium Quality', desc: 'Quality-checked fabrics and expert craftsmanship.' },
              { icon: '✧', title: 'Free Shipping', desc: 'On all orders above ₹499 across India.' },
              { icon: '✦', title: 'Easy Returns', desc: '30-day return policy, no questions asked.' },
              { icon: '✧', title: 'Secure Payments', desc: 'COD, UPI, and cards — always protected.' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }}
                className="p-4 md:p-7 group transition-all duration-300 relative overflow-hidden"
                style={{ background: '#0d0d0d', border: '1px solid #1e1e1e' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,168,83,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}>
                <div className="text-xl md:text-3xl mb-3 md:mb-4" style={{ color: '#d4a853' }}>{item.icon}</div>
                <h3 className="font-bold text-xs md:text-base mb-1 md:mb-2 text-white">{item.title}</h3>
                <p className="text-[10px] md:text-sm leading-relaxed" style={{ color: '#555' }}>{item.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: '#d4a853' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-10 md:py-20 relative overflow-hidden" style={{ background: '#000' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(212,168,83,0.05) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <SectionLabel text="Stay Connected" center />
            <h2 className="text-2xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Join the <span style={{ color: '#d4a853' }}>Monarch</span> Club
            </h2>
            <p className="text-xs md:text-sm mb-6 md:mb-8 leading-relaxed" style={{ color: '#444' }}>
              Exclusive access to new arrivals, limited offers, and fashion inspiration.
            </p>
            <form className="flex max-w-sm mx-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address"
                className="flex-1 px-4 py-3 text-xs md:text-sm focus:outline-none"
                style={{ background: '#111', border: '1px solid #2a2a2a', borderRight: 'none', color: '#fff' }}
                onFocus={e => e.currentTarget.style.borderColor = '#d4a853'}
                onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'} />
              <button type="submit"
                className="px-5 md:px-7 py-3 text-xs font-bold uppercase tracking-wider flex-shrink-0 transition-all duration-300"
                style={{ background: '#d4a853', color: '#000' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e8c46a'}
                onMouseLeave={e => e.currentTarget.style.background = '#d4a853'}>
                Subscribe
              </button>
            </form>
            <p className="text-[10px] mt-3" style={{ color: '#2a2a2a' }}>No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

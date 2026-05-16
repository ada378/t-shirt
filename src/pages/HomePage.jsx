import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts } from '../features/products/productSlice';
import HeroSlider from '../components/home/HeroSlider';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiChevronRight, FiClock, FiChevronLeft, FiShoppingBag } from 'react-icons/fi';
import Slider from 'react-slick';

const categories = [
  { name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', count: '48+ Designs', desc: 'Premium cotton tees with bold prints' },
  { name: 'Hoodies', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', count: '24+ Styles', desc: 'Cozy streetwear essentials' },
  { name: 'Jeans', slug: 'jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', count: '18+ Fits', desc: 'Perfect fit, timeless style' },
];

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹499' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated customer care' },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Cities Served' },
  { value: '4.8', label: 'Average Rating' },
];

function SectionHeader({ label, title, link }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-8 md:mb-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-0.5 bg-accent" />
          <p className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.2em]">{label}</p>
        </div>
        <h2 className="text-2xl md:text-4xl font-display font-bold">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors group">
          View All <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const { featured, bestSellers, newArrivals, premium, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <div>
      <HeroSlider />

      <section className="py-8 md:py-10 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 md:p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-white group-hover:bg-accent/10 transition-colors">
                  <f.icon className="text-lg text-accent" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-neutral-900">{f.title}</p>
                  <p className="text-[10px] md:text-xs text-neutral-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-accent" />
                <p className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.2em]">Categories</p>
                <span className="w-8 h-0.5 bg-accent" />
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Shop by Category</h2>
              <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-lg mx-auto">Explore our curated collection of premium fashion, designed for those who demand the best.</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <Link to={`/products/${cat.slug}`} className="group relative block overflow-hidden aspect-[4/5]">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{cat.desc}</p>
                    <div className="flex items-center gap-2 text-accent text-sm font-medium">
                      <span>{cat.count}</span>
                      <span className="group-hover:translate-x-1.5 transition-transform inline-flex">→</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiArrowRight className="text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {premium?.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,83,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,168,83,0.05),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1.5\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-accent" />
                <p className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.2em]">Premium Collection</p>
                <span className="w-8 h-0.5 bg-accent" />
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Luxury Finish</h2>
              <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-lg mx-auto">Handpicked premium pieces for the discerning fashion enthusiast.</p>
            </motion.div>
            <div className="relative">
              <Slider
                dots={true}
                infinite={false}
                speed={600}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay={false}
                arrows={true}
                prevArrow={<button className="slick-prev-custom"><FiChevronLeft /></button>}
                nextArrow={<button className="slick-next-custom"><FiChevronRight /></button>}
                appendDots={(dots) => (
                  <div className="mt-8">
                    <ul className="flex justify-center gap-2 m-0">{dots}</ul>
                  </div>
                )}
                responsive={[
                  { breakpoint: 1024, settings: { slidesToShow: 2 } },
                  { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
                ]}
                className="premium-carousel -mx-3"
              >
                {loading ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-3">
                    <SkeletonCard />
                  </div>
                )) : premium?.map((product, i) => (
                  <div key={product._id} className="px-3">
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </Slider>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
              <Link to="/products" className="group inline-flex items-center gap-2 border border-accent text-accent px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] hover:bg-accent hover:text-black transition-all duration-300">
                View All Premium <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {newArrivals?.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="New Arrivals" title="Fresh Drops" link="/products" />
            <div className="product-grid">
              {loading ? <ProductGridSkeleton /> : newArrivals?.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link to="/products" className="inline-flex items-center gap-2 border border-black text-black px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition-colors">
                View All <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,168,83,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1.5\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="px-0 md:px-6 py-4 md:py-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 w-fit mb-5">
                <FiClock className="text-accent text-xs" />
                <span className="text-accent text-xs font-medium uppercase tracking-[0.15em]">Limited Time</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                Summer Sale<br />
                <span className="text-accent">Up to 40% Off</span>
              </h2>
              <div className="w-16 h-0.5 bg-accent mb-5" />
              <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                Premium quality fashion for the season. Handpicked styles that define your vibe. Don&apos;t miss out on these exclusive deals.
              </p>
              <Link to="/products" className="group inline-flex items-center gap-3 bg-accent text-black px-8 py-3.5 font-medium text-sm uppercase tracking-[0.15em] hover:bg-accent-light transition-all duration-300">
                Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="hidden md:block h-full min-h-[400px] relative overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80"
                alt="Summer Collection"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-900" />
            </div>
          </motion.div>
        </div>
      </section>

      {bestSellers?.length > 0 && (
        <section className="py-14 md:py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Best Sellers" title="Most Popular" link="/products?sort=bestseller" />
            <div className="product-grid">
              {loading ? <ProductGridSkeleton /> : bestSellers?.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center p-6 bg-neutral-50"
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-accent mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-10 md:mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-accent" />
                <p className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.2em]">Testimonials</p>
                <span className="w-8 h-0.5 bg-accent" />
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold">What Our Customers Say</h2>
              <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-lg mx-auto">Real reviews from real customers who love Urban Monarch.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { name: 'Priya S.', text: 'Absolutely love the quality! The fabric is super soft and the fit is perfect. My go-to store for casual fashion.', rating: 5, role: 'Fashion Enthusiast' },
              { name: 'Rahul M.', text: 'Fast delivery and amazing quality. The hoodie I ordered exceeded my expectations. Highly recommended!', rating: 5, role: 'Verified Buyer' },
              { name: 'Ananya K.', text: 'Great collection and reasonable prices. The customer service team was very helpful with my size query.', rating: 5, role: 'Regular Customer' },
              { name: 'Arjun S.', text: 'The jeans fit like a dream. Perfect quality and the style is exactly what I was looking for. Will order again!', rating: 5, role: 'Style Enthusiast' },
              { name: 'Neha P.', text: 'Urban Monarch has become my go-to brand for t-shirts. Great prints and the fabric lasts wash after wash.', rating: 5, role: 'Verified Buyer' },
              { name: 'Vikram R.', text: 'Ordered a hoodie for my brother and he loved it! The embroidery work is top-notch. Highly recommended.', rating: 5, role: 'Happy Customer' },
            ].map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-6 md:p-8 bg-white border border-neutral-100 hover:border-neutral-200 transition-colors relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => <FiStar key={j} className="text-accent fill-current text-sm" />)}
                </div>
                <p className="text-sm text-neutral-600 mb-5 leading-relaxed italic">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold text-neutral-600">{review.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                    <p className="text-xs text-neutral-400">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featured?.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Featured" title="Editor's Pick" link="/products" />
            <div className="product-grid">
              {loading ? <ProductGridSkeleton /> : featured?.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10 md:mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-accent" />
                <p className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.2em]">Why Choose Us</p>
                <span className="w-8 h-0.5 bg-accent" />
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold">The Urban Monarch Difference</h2>
              <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-lg mx-auto">We believe in quality, craftsmanship, and style that lasts.</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
            {[
              { title: 'Premium Quality', desc: 'Each product is meticulously quality-checked before shipping. Premium fabrics and expert craftsmanship ensure lasting wear.', icon: '✦' },
              { title: 'Free Shipping', desc: 'On all orders above ₹499. Hassle-free delivery across India with real-time tracking and doorstep service.', icon: '✧' },
              { title: 'Easy Returns', desc: '30-day return policy, no questions asked. Free return pickup for defective or incorrect items.', icon: '✦' },
              { title: 'Secure Payments', desc: '100% secure checkout with multiple payment options including COD, UPI, and cards. Your data is always protected.', icon: '✧' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 md:p-8 bg-neutral-50 border border-neutral-100 hover:border-accent/30 transition-colors group"
              >
                <span className="text-2xl text-accent block mb-4">{item.icon}</span>
                <h3 className="font-semibold text-base md:text-lg mb-3 text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(212,168,83,0.08),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1.5\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-accent" />
              <p className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.2em]">Stay Connected</p>
              <span className="w-8 h-0.5 bg-accent" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-3">Join the Monarch Community</h2>
            <p className="text-neutral-400 max-w-lg mx-auto mb-8 text-sm md:text-base leading-relaxed">
              Get exclusive access to new arrivals, limited offers, and fashion inspiration delivered straight to your inbox.
            </p>
            <form className="max-w-md mx-auto flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3.5 bg-neutral-800 border border-neutral-700 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-accent text-black text-sm font-medium uppercase tracking-wider hover:bg-accent-light transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-neutral-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

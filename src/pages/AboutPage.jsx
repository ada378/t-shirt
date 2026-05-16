import { motion } from 'framer-motion';

const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Neha Sharma', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'Vikram Patel', role: 'Operations Head', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent text-sm font-medium uppercase tracking-[0.2em] mb-3">Our Story</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold">About Urban Monarch</h1>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-3">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Premium Fashion for the Bold</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">Urban Monarch was born from a passion for self-expression through fashion. We believe what you wear should be as unique as you are. From graphic tees that start conversations to hoodies that feel like home, every piece is crafted with care.</p>
            <p className="text-neutral-600 leading-relaxed">Our journey began in 2020 with a simple mission: make premium streetwear accessible without compromising on quality or style. Today, we're proud to serve thousands of customers across India.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-[4/5] bg-neutral-100 overflow-hidden rounded-sm">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80" alt="About Urban Monarch" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center p-8 bg-neutral-50 rounded-sm">
            <h3 className="text-5xl font-display font-bold text-accent mb-2">500+</h3>
            <p className="text-sm font-medium">Products</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-center p-8 bg-neutral-50 rounded-sm">
            <h3 className="text-5xl font-display font-bold text-accent mb-2">10K+</h3>
            <p className="text-sm font-medium">Happy Customers</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center p-8 bg-neutral-50 rounded-sm">
            <h3 className="text-5xl font-display font-bold text-accent mb-2">50+</h3>
            <p className="text-sm font-medium">Cities Covered</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-accent text-sm font-medium uppercase tracking-widest mb-3">Our Team</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet the Founders</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
              <div className="aspect-square overflow-hidden bg-neutral-100 rounded-sm mb-4">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-neutral-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

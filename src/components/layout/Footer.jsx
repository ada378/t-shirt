import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import logo from '../../../photos/logo.jpeg';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img loading="lazy" src={logo} alt="Urban Monarch" className="h-14 w-14 rounded-full object-cover mb-4" />
            <p className="text-sm leading-relaxed text-neutral-400">Premium fashion for those who dare to stand out. Quality apparel crafted with passion.</p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-accent hover:text-black transition-all"><FiInstagram /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-accent hover:text-black transition-all"><FiFacebook /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-accent hover:text-black transition-all"><FiTwitter /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-accent hover:text-black transition-all"><FiYoutube /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-sm hover:text-accent transition-colors">Shop All</Link></li>
              <li><Link to="/products/t-shirts" className="text-sm hover:text-accent transition-colors">T-Shirts</Link></li>
              <li><Link to="/about" className="text-sm hover:text-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm hover:text-accent transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-sm hover:text-accent transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-sm hover:text-accent transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-sm hover:text-accent transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-sm hover:text-accent transition-colors">FAQs</a></li>
              <li><a href="#" className="text-sm hover:text-accent transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm"><FiMapPin className="mt-0.5 text-accent flex-shrink-0" /> 16/1033,Indiranagar Lucknow, India</li>
              <li className="flex items-center gap-3 text-sm"><FiPhone className="text-accent flex-shrink-0" /> +91 7355735325</li>
              <li className="flex items-center gap-3 text-sm"><FiMail className="text-accent flex-shrink-0" /> support@urbanmonarch.in</li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-neutral-400 mb-2">Subscribe to our newsletter</p>
              <form className="flex">
                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent" />
                <button type="submit" className="px-4 py-2.5 bg-accent text-black text-sm font-medium hover:bg-accent-light transition-colors">Join</button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">© 2026 Urban Monarch. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

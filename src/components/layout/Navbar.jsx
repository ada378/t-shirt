import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX,
  FiLogOut, FiPackage, FiChevronDown, FiMapPin, FiTag
} from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import logo from '../../../photos/logo.jpeg';

const categories = [
  { name: 'T-Shirts', path: '/products/t-shirts', icon: '👕' },
  { name: 'New Arrivals', path: '/products?sort=newest', icon: '✨' },
  { name: 'Best Sellers', path: '/products?sort=bestseller', icon: '🔥' },
  { name: 'Sale', path: '/products/t-shirts', icon: '🏷️' },
];

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'T-Shirts', path: '/products/t-shirts' },
  { name: 'New Arrivals', path: '/products?sort=newest' },
  { name: 'Sale', path: '/products/t-shirts' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const megaRef = useRef(null);
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 shadow-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top announcement bar */}
      <div className="bg-[#d4a853] text-black text-center py-1.5 text-xs font-semibold tracking-wide">
        🎉 FREE SHIPPING on orders above ₹499 &nbsp;|&nbsp; Use code <span className="underline font-bold">WELCOME10</span> for 10% off
      </div>

      {/* Main navbar */}
      <div className="bg-[#0f1111]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-2 md:gap-4 h-[60px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <img loading="lazy" src={logo} alt="Urban Monarch" className="h-11 w-11 rounded-full object-cover ring-2 ring-[#d4a853]/40 group-hover:ring-[#d4a853] transition-all" />
              <div className="hidden lg:block">
                <p className="text-white font-bold text-sm leading-tight tracking-wide">URBAN</p>
                <p className="text-[#d4a853] font-bold text-sm leading-tight tracking-widest">MONARCH</p>
              </div>
            </Link>

            {/* Mobile search */}
            <div className="flex-1 md:hidden">
              <form onSubmit={handleSearch} className="flex rounded-full overflow-hidden border border-white/10 bg-white shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tees"
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="px-3 bg-[#d4a853] text-black">
                  <FiSearch />
                </button>
              </form>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded transition-colors flex-shrink-0"
            >
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>

            {/* Delivery location - desktop */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer transition-colors flex-shrink-0 border border-transparent hover:border-white/20">
              <FiMapPin className="text-[#d4a853] text-sm flex-shrink-0" />
              <div>
                <p className="text-neutral-400 text-[10px] leading-none">Deliver to</p>
                <p className="text-white text-xs font-semibold leading-tight mt-0.5">India</p>
              </div>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className={`relative w-full flex rounded-md overflow-hidden transition-all duration-200 ${searchFocused ? 'ring-2 ring-[#d4a853]' : ''}`}>
                <select style={{ background: '#f3f3f3', color: '#333', border: 'none', borderRight: '1px solid #ccc', height: 42, padding: '0 8px', fontSize: 12, outline: 'none', cursor: 'pointer' }} className="hidden lg:block">
                  <option>All</option>
                  <option>T-Shirts</option>
                  <option>Hoodies</option>
                  <option>Jeans</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search Urban Monarch..."
                  style={{ flex: 1, padding: '0 16px', height: 42, background: '#ffffff', color: '#111111', fontSize: 14, outline: 'none', border: 'none' }}
                />
                <button
                  type="submit"
                  style={{ background: '#d4a853', color: '#111111', height: 42, padding: '0 16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#c49843'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#d4a853'}
                >
                  <FiSearch style={{ fontSize: 18 }} />
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="hidden md:flex items-center gap-1 ml-auto md:ml-0">

              {/* Account */}
              {user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex flex-col items-start px-2 py-1.5 hover:bg-white/10 rounded transition-colors border border-transparent hover:border-white/20"
                  >
                    <span className="text-neutral-400 text-[10px] leading-none">Hello, {user.name?.split(' ')[0]}</span>
                    <span className="text-white text-xs font-semibold leading-tight mt-0.5 flex items-center gap-1">
                      Account <FiChevronDown className={`text-[10px] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-60 bg-white border border-neutral-200 shadow-2xl rounded-lg overflow-hidden z-50"
                        style={{ background: '#1a1a1a', borderColor: '#333' }}
                      >
                        <div className="px-4 py-3 border-b" style={{ borderColor: '#2a2a2a', background: '#111' }}>
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setDropdownOpen(false)}>
                            <FiPackage className="text-[#d4a853]" /> My Orders
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setDropdownOpen(false)}>
                            <FiHeart className="text-[#d4a853]" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setDropdownOpen(false)}>
                              <span className="text-[#d4a853]">⚙️</span> Admin Panel
                            </Link>
                          )}
                        </div>
                        <div className="border-t" style={{ borderColor: '#2a2a2a' }}>
                          <button
                            onClick={() => { handleLogout(); setDropdownOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                          >
                            <FiLogOut /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex flex-col items-start px-2 py-1.5 hover:bg-white/10 rounded transition-colors border border-transparent hover:border-white/20"
                >
                  <span className="text-neutral-400 text-[10px] leading-none">Hello, Guest</span>
                  <span className="text-white text-xs font-semibold leading-tight mt-0.5 flex items-center gap-1">
                    Sign In <FiChevronDown className="text-[10px]" />
                  </span>
                </Link>
              )}

              {/* Returns & Orders */}
              <Link
                to="/orders"
                className="hidden lg:flex flex-col items-start px-2 py-1.5 hover:bg-white/10 rounded transition-colors border border-transparent hover:border-white/20"
              >
                <span className="text-neutral-400 text-[10px] leading-none">Returns</span>
                <span className="text-white text-xs font-semibold leading-tight mt-0.5">& Orders</span>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 hover:bg-white/10 rounded transition-colors hidden sm:flex flex-col items-center">
                <FiHeart className="text-xl text-white" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#d4a853] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/10 rounded transition-colors border border-transparent hover:border-white/20">
                <div className="relative">
                  <FiShoppingBag className="text-2xl text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#d4a853] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-white text-xs font-semibold hidden lg:block">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu overlay */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-[88vw] max-w-xs bg-[#111] shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div>
                      <p className="text-xs font-semibold text-white">Menu</p>
                      <p className="text-[10px] text-neutral-400">Quick access to categories</p>
                    </div>
                    <button className="p-2 text-white hover:bg-white/10 rounded" onClick={() => setIsOpen(false)}>
                      <FiX className="text-xl" />
                    </button>
                  </div>
                  <div className="px-5 py-4 space-y-4">
                    <div className="space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#d4a853]">Your account</p>
                      {user ? (
                        <>
                          <Link to="/orders" onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">Orders</Link>
                          <Link to="/wishlist" onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">Wishlist</Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">Admin</Link>
                          )}
                          <button
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                            className="w-full text-left rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">Sign In</Link>
                      )}
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#d4a853]">Quick links</p>
                      <Link to="/cart" onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">My Cart ({cartCount})</Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Secondary nav */}
      <div className="hidden md:block bg-[#232f3e]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
          <div className="flex items-center h-10 gap-1">

            {/* All categories mega menu */}
            <div className="relative" ref={megaRef}>
              <button
                onClick={() => setMegaOpen(!megaOpen)}
                className="flex items-center gap-2 h-10 px-3 text-xs font-semibold text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 rounded-sm"
              >
                <FiMenu className="text-sm" />
                <span>All Categories</span>
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 shadow-2xl rounded-sm overflow-hidden z-50"
                    style={{ background: '#1a1a1a', border: '1px solid #333' }}
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setMegaOpen(false)}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                    <div className="border-t" style={{ borderColor: '#2a2a2a' }}>
                      <Link
                        to="/products"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#d4a853] hover:bg-white/5 transition-colors"
                        onClick={() => setMegaOpen(false)}
                      >
                        <FiTag /> View All Products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav links */}
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative h-10 px-3 text-xs font-medium text-white/80 hover:text-white transition-colors flex items-center whitespace-nowrap
                    after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-[#d4a853] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200
                    ${location.pathname === link.path ? 'text-white after:scale-x-100' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side promo */}
            <div className="ml-auto flex items-center gap-1 flex-shrink-0">
              <Link to="/products?sort=discount" className="flex items-center gap-1.5 h-10 px-3 text-xs font-semibold text-[#d4a853] hover:bg-white/10 transition-colors rounded-sm">
                🏷️ Today's Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}

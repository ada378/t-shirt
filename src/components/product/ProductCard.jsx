import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.wishlist);
  const isWishlisted = items?.some((id) => id === product._id || id?._id === product._id);
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error('Please login first');
    dispatch(addToCart({ productId: product._id, quantity: 1, size: product.sizes[0] }));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error('Please login first');
    dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group product-card bg-white"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400x500/f5f5f5/999?text=Product'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="badge">
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}
          {product.isNewArrival && !hasDiscount && (
            <span className="badge bg-black text-white">New</span>
          )}

          <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-all duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="text-sm" /> Add to Cart
            </button>
          </div>

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all ${isWishlisted ? 'text-red-500' : 'text-neutral-600'}`}
          >
            <FiHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <Link
            to={`/product/${product._id}`}
            className="absolute top-3 right-14 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all text-neutral-600 opacity-0 group-hover:opacity-100"
          >
            <FiEye className="text-sm" />
          </Link>
        </div>

        <div className="p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-medium text-sm text-neutral-900 truncate">{product.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {product.rating > 0 && (
              <span className="text-xs text-accent">★ {product.rating.toFixed(1)}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-sm">₹{price.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          {product.sizes?.length > 0 && (
            <div className="flex gap-1 mt-2">
              {product.sizes.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 border border-neutral-200 text-neutral-500">{s}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

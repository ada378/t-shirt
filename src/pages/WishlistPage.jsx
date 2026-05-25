import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchWishlist, toggleWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/common/Loader';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, loading } = useSelector((s) => s.wishlist);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
    window.scrollTo(0, 0);
  }, [dispatch, user]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1, size: product.sizes?.[0] }));
    dispatch(toggleWishlist(product._id));
    toast.success('Moved to cart');
  };

  if (!user) return (
    <div className="text-center py-20">
      <FiHeart className="text-6xl mx-auto mb-4 text-neutral-300" />
      <h2 className="text-2xl font-display font-bold mb-2">Login to view wishlist</h2>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  );

  if (loading) return <Loader />;

  if (!items || items.length === 0) return (
    <div className="text-center py-20">
      <FiHeart className="text-6xl mx-auto mb-4 text-neutral-300" />
      <h2 className="text-2xl font-display font-bold mb-2">Your wishlist is empty</h2>
      <p className="text-neutral-500 mb-6">Save your favorite items here.</p>
      <Link to="/products" className="btn-primary">Explore Products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((product, i) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
            <Link to={`/product/${product._id}`} className="block">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                <img loading="lazy" src={product.images?.[0]?.url || 'https://via.placeholder.com/300'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium truncate">{product.title}</h3>
                <p className="text-sm font-semibold mt-1">₹{(product.discountPrice || product.price).toLocaleString()}</p>
              </div>
            </Link>
            <div className="flex gap-2 px-3 pb-3">
              <button onClick={() => handleAddToCart(product)} className="flex-1 text-xs py-2 bg-black text-white font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1">
                <FiShoppingBag /> Add to Cart
              </button>
              <button onClick={() => { dispatch(toggleWishlist(product._id)); toast.success('Removed'); }} className="p-2 border border-neutral-200 hover:border-red-300 transition-colors text-neutral-400 hover:text-red-500">
                <FiTrash2 className="text-xs" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProduct, clearProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import Loader from '../components/common/Loader';
import { FiHeart, FiShare2, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';


export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    window.scrollTo(0, 0);
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0]?.name || '');
    }
  }, [product]);

  if (loading) return <Loader size="lg" />;
  if (!product) return <div className="text-center py-20"><p className="text-lg">Product not found</p></div>;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const isWishlisted = wishlistItems?.some((id) => id === product._id || id?._id === product._id);
  const inStock = product.stock > 0;
  const validImages = product.images?.filter(i => i?.url) || [];

  const handleAddToCart = () => {
    if (!user) return toast.error('Please login first');
    dispatch(addToCart({ productId: product._id, quantity, size: selectedSize, color: selectedColor }));
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!user) return toast.error('Please login first');
    dispatch(addToCart({ productId: product._id, quantity, size: selectedSize, color: selectedColor }));
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!user) return toast.error('Please login first');
    dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to={`/products/${product.category}`} className="hover:text-black capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-[1/1] overflow-hidden bg-neutral-100 mb-4 max-w-md mx-auto relative">
            {!mainImgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 z-10">
                <span className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={validImages[activeImg]?.url || 'https://via.placeholder.com/600x750/f5f5f5/999?text=Product'}
              alt={product.title}
              onLoad={() => setMainImgLoaded(true)}
              onError={() => setMainImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${mainImgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
            />
          </div>
          {validImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {validImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 flex-shrink-0 border-2 overflow-hidden ${activeImg === i ? 'border-black' : 'border-transparent'}`}
                >
                  <img loading="lazy" src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
            <span className="uppercase tracking-wider">{product.category}</span>
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-accent">★ {product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-neutral-400 line-through">₹{product.price.toLocaleString()}</span>
                <span className="text-sm text-green-600 font-medium">
                  Save ₹{(product.price - product.discountPrice).toLocaleString()}
                </span>
              </>
            )}
          </div>

          <p className="text-neutral-600 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Size: <span className="text-neutral-500">{selectedSize}</span></p>
                <div className="flex gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 text-sm border ${selectedSize === s ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'} transition-colors`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Color: <span className="text-neutral-500">{selectedColor}</span></p>
                <div className="flex gap-2">
                  {product.colors.map(c => (
                    <button key={c.name} onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.name ? 'border-black' : 'border-neutral-200'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border border-neutral-200 hover:border-black transition-colors"><FiMinus /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 border border-neutral-200 hover:border-black transition-colors"><FiPlus /></button>
                <span className="text-xs text-neutral-500">{product.stock} in stock</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button onClick={handleAddToCart} disabled={!inStock} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={!inStock} className="flex-1 btn-accent disabled:opacity-50 disabled:cursor-not-allowed">
              Buy Now
            </button>
            <button onClick={handleWishlist} className={`p-3 border ${isWishlisted ? 'border-red-200 text-red-500' : 'border-neutral-200 hover:border-black'} transition-colors`}>
              <FiHeart className={isWishlisted ? 'fill-current' : ''} />
            </button>
            <button className="p-3 border border-neutral-200 hover:border-black transition-colors">
              <FiShare2 />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-neutral-100">
            <div className="text-center"><FiTruck className="mx-auto mb-1 text-accent" /><p className="text-xs font-medium">Free Shipping</p><p className="text-[10px] text-neutral-500">On ₹499+</p></div>
            <div className="text-center"><FiShield className="mx-auto mb-1 text-accent" /><p className="text-xs font-medium">Secure</p><p className="text-[10px] text-neutral-500">Payment</p></div>
            <div className="text-center"><FiRefreshCw className="mx-auto mb-1 text-accent" /><p className="text-xs font-medium">Easy Returns</p><p className="text-[10px] text-neutral-500">30 days</p></div>
          </div>

          <div className="border-t border-neutral-100 pt-6 mt-2">
            <p className="text-sm text-neutral-500"><strong className="text-neutral-800">Material:</strong> {product.material}</p>
            {product.careInstructions && <p className="text-sm text-neutral-500 mt-1"><strong className="text-neutral-800">Care:</strong> {product.careInstructions}</p>}
          </div>
        </motion.div>
      </div>

      {product.reviews?.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="text-2xl font-display font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-4 max-w-2xl">
            {product.reviews.map((review, i) => (
              <div key={i} className="p-4 border border-neutral-100 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">{review.name?.[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{review.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => <FiStar key={j} className="text-accent fill-current text-xs" />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

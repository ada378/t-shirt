import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchCart, updateCartItem, removeFromCart, applyCoupon, clearCart } from '../features/cart/cartSlice';
import Loader from '../components/common/Loader';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, couponCode, discount, loading } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const [couponInput, setCouponInput] = useState('');

  useEffect(() => {
    if (user) dispatch(fetchCart());
    window.scrollTo(0, 0);
  }, [dispatch, user]);

  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shippingCharge = subtotal >= 499 ? 0 : 49;
  const total = Math.max(0, subtotal + shippingCharge - (discount || 0));

  const handleQuantity = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId: item._id, data: { quantity: newQty } }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed');
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return toast.error('Enter coupon code');
    dispatch(applyCoupon(couponInput.trim()))
      .unwrap()
      .then(() => { toast.success('Coupon applied!'); setCouponInput(''); })
      .catch((err) => toast.error(err || 'Invalid coupon'));
  };

  if (!user) return (
    <div className="text-center py-20">
      <FiShoppingBag className="text-6xl mx-auto mb-4 text-neutral-300" />
      <h2 className="text-2xl font-display font-bold mb-2">Login to view your cart</h2>
      <p className="text-neutral-500 mb-6">Please sign in to see the items you've added.</p>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  );

  if (loading) return <Loader />;

  if (!items || items.length === 0) return (
    <div className="text-center py-20">
      <FiShoppingBag className="text-6xl mx-auto mb-4 text-neutral-300" />
      <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
      <p className="text-neutral-500 mb-6">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Shopping Cart</h1>
        <span className="text-sm text-neutral-500">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 border border-neutral-100 rounded-sm"
            >
              <Link to={`/product/${item.product?._id || item.product}`} className="w-24 h-28 flex-shrink-0 bg-neutral-100 overflow-hidden">
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product?._id || item.product}`} className="text-sm font-medium hover:underline block truncate">{item.title}</Link>
                <p className="text-xs text-neutral-500 mt-0.5">{item.size} {item.color && `/ ${item.color}`}</p>
                <p className="text-sm font-semibold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantity(item, -1)} className="p-1.5 border border-neutral-200 hover:border-black transition-colors"><FiMinus className="text-xs" /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item, 1)} className="p-1.5 border border-neutral-200 hover:border-black transition-colors"><FiPlus className="text-xs" /></button>
                  </div>
                  <button onClick={() => handleRemove(item._id)} className="text-neutral-400 hover:text-red-500 transition-colors p-1">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-neutral-100 rounded-sm p-6 sticky top-28">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Shipping</span><span className="font-medium">{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount ({couponCode})</span><span>-₹{discount.toLocaleString()}</span></div>
              )}
              <div className="border-t pt-3 flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-bold">₹{total.toLocaleString()}</span></div>
            </div>

            {subtotal < 499 && (
              <p className="text-xs text-accent mt-3">Add ₹{(499 - subtotal).toLocaleString()} more for free shipping!</p>
            )}

            {discount === 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex gap-2">
                  <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" className="flex-1 px-3 py-2.5 border border-neutral-200 text-sm focus:border-black focus:outline-none" />
                  <button onClick={handleApplyCoupon} className="px-4 py-2.5 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors">Apply</button>
                </div>
              </div>
            )}

            <button onClick={() => navigate('/checkout')} className="w-full btn-accent mt-6 text-center">
              Proceed to Checkout
            </button>

            <Link to="/products" className="flex items-center justify-center gap-1 text-sm text-neutral-500 hover:text-black mt-4 transition-colors">
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

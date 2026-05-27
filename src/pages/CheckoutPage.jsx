import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart, fetchCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';
import API from '../services/api';
import { getImageUrl, FALLBACK_IMG } from '../utils/imageUrl';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, couponCode, discount } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '', street: '', city: '', state: '', zip: '', country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) dispatch(fetchCart());
    window.scrollTo(0, 0);
  }, [dispatch, user]);

  const subtotal = items?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0;
  const shippingCharge = 0;
  const total = Math.max(0, subtotal + shippingCharge - (discount || 0));

  const validateAddress = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = 'Name is required';
    if (!address.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{8,}$/.test(address.phone)) errs.phone = 'Invalid phone number';
    if (!address.street.trim()) errs.street = 'Address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'State is required';
    if (!address.zip.trim()) errs.zip = 'ZIP code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      if (paymentMethod === 'razorpay') {
        const { data } = await API.post('/payment/create-order', { amount: total });

        if (data.devMode) {
          const orderData = { shippingAddress: address, paymentMethod: 'razorpay' };
          const order = await dispatch(createOrder(orderData)).unwrap();
          await API.post('/payment/verify', {
            razorpay_order_id: data.order.id,
            razorpay_payment_id: 'pay_dev_' + Date.now(),
            razorpay_signature: 'dev_signature',
            orderId: order._id,
          });
          dispatch(clearCart());
          toast.success('Payment successful! (Dev Mode) Order confirmed.');
          navigate('/orders');
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) { toast.error('Razorpay failed to load. Try again.'); return; }

        await new Promise((resolve, reject) => {
          let settled = false;
          let rzp = null;
          const PAYMENT_TIMEOUT = 5 * 60 * 1000;
          const timeoutId = setTimeout(() => {
            if (settled) return;
            settled = true;
            if (rzp) rzp.close();
            reject(new Error('timeout'));
          }, PAYMENT_TIMEOUT);

          rzp = new window.Razorpay({
            key: data.key,
            amount: data.order.amount,
            currency: data.order.currency,
            name: 'Urban Monarch',
            description: 'Fashion Store Payment',
            order_id: data.order.id,
            prefill: { name: user?.name || '', email: user?.email || '', contact: address.phone || '' },
            theme: { color: '#d4a853' },
            handler: async (response) => {
              if (settled) return;
              settled = true;
              clearTimeout(timeoutId);
              try {
                const orderData = { shippingAddress: address, paymentMethod: 'razorpay' };
                const order = await dispatch(createOrder(orderData)).unwrap();
                await API.post('/payment/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order._id,
                });
                dispatch(clearCart());
                toast.success('Payment successful! Order confirmed.');
                navigate('/orders');
                resolve();
              } catch (e) {
                reject(new Error(e?.message || 'Order creation failed after payment'));
              }
            },
            modal: {
              ondismiss: () => {
                if (settled) return;
                settled = true;
                clearTimeout(timeoutId);
                reject(new Error('cancelled'));
              },
            },
          });
          rzp.open();
        });
      } else {
        const orderData = { shippingAddress: address, paymentMethod };
        await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (err) {
      if (err?.message === 'cancelled') {
        toast.error('Payment cancelled — you can try again');
      } else if (err?.message === 'timeout') {
        toast.error('Payment timed out. Please try again.');
      } else {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to place order');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!items || items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        {['Shipping', 'Payment', 'Confirm'].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step >= i + 1 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'}`}>{i + 1}</div>
            <span className={step >= i + 1 ? 'font-medium' : 'text-neutral-400'}>{s}</span>
            {i < 2 && <span className="text-neutral-300 mx-1">—</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="border border-neutral-100 rounded-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              {step === 1 ? 'Shipping Address' : step === 2 ? 'Payment Method' : 'Review Order'}
            </h2>

            {/* Step 1 - Address */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={address.name} onChange={(e) => { setAddress({ ...address, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                  className={`input-field md:col-span-2 ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="text-xs text-red-500 md:col-span-2 -mt-2">{errors.name}</p>}
                <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => { setAddress({ ...address, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                  className={`input-field ${errors.phone ? 'border-red-400' : ''}`} />
                {errors.phone && <p className="text-xs text-red-500 -mt-2">{errors.phone}</p>}
                <input type="text" placeholder="Street Address" value={address.street} onChange={(e) => { setAddress({ ...address, street: e.target.value }); setErrors({ ...errors, street: '' }); }}
                  className={`input-field md:col-span-2 ${errors.street ? 'border-red-400' : ''}`} />
                {errors.street && <p className="text-xs text-red-500 md:col-span-2 -mt-2">{errors.street}</p>}
                <input type="text" placeholder="City" value={address.city} onChange={(e) => { setAddress({ ...address, city: e.target.value }); setErrors({ ...errors, city: '' }); }}
                  className={`input-field ${errors.city ? 'border-red-400' : ''}`} />
                {errors.city && <p className="text-xs text-red-500 -mt-2">{errors.city}</p>}
                <input type="text" placeholder="State" value={address.state} onChange={(e) => { setAddress({ ...address, state: e.target.value }); setErrors({ ...errors, state: '' }); }}
                  className={`input-field ${errors.state ? 'border-red-400' : ''}`} />
                {errors.state && <p className="text-xs text-red-500 -mt-2">{errors.state}</p>}
                <input type="text" placeholder="ZIP Code" value={address.zip} onChange={(e) => { setAddress({ ...address, zip: e.target.value }); setErrors({ ...errors, zip: '' }); }}
                  className={`input-field ${errors.zip ? 'border-red-400' : ''}`} />
                {errors.zip && <p className="text-xs text-red-500 -mt-2">{errors.zip}</p>}
                <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="input-field" />
              </div>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <div className="space-y-3">
                {[
                  {
                    value: 'razorpay',
                    label: 'Pay Online (Razorpay)',
                    desc: 'UPI, Credit/Debit Card, Net Banking — Secure & Instant',
                    icon: '💳',
                    badge: 'RECOMMENDED',
                  }
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`block p-4 border cursor-pointer transition-all rounded-sm ${paymentMethod === method.value ? 'border-[#d4a853] bg-[#d4a853]/5' : 'border-neutral-200 hover:border-neutral-400'}`}
                  >
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="accent-black" />
                      <span className="text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{method.label}</p>
                          {method.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#d4a853', color: '#000' }}>{method.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{method.desc}</p>
                      </div>
                    </div>

                    {/* Razorpay info box */}
                    {method.value === 'razorpay' && paymentMethod === 'razorpay' && (
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <div className="flex flex-wrap gap-2">
                          {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'Wallets'].map((p) => (
                            <span key={p} className="text-[11px] px-2.5 py-1 border border-neutral-200 rounded text-neutral-600">{p}</span>
                          ))}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-2">🔒 Secured by Razorpay. You'll be redirected to complete payment.</p>
                        <div className="mt-2 p-2 rounded text-[11px]" style={{ background: '#fff8e6', color: '#7a5c00', border: '1px solid #f0d080' }}>
                          <strong>Test Mode:</strong> Use card 4111 1111 1111 1111, any future expiry, any CVV, OTP: 1234
                        </div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="p-4 bg-neutral-50 rounded-sm">
                  <p className="text-sm font-medium mb-1">Shipping To:</p>
                  <p className="text-sm text-neutral-600">{address.name} — {address.phone}</p>
                  <p className="text-sm text-neutral-600">{address.street}, {address.city}, {address.state} — {address.zip}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-sm">
                  <p className="text-sm font-medium mb-1">Payment Method:</p>
                  <p className="text-sm text-neutral-600">
                    {paymentMethod === 'razorpay' ? '💳 Razorpay (Online Payment)' : paymentMethod === 'qr' ? '🔗 UPI QR Payment' : paymentMethod}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="btn-outline text-sm">Back</button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => { if (step === 1) { if (validateAddress()) setStep(2); } else setStep(3); }}
                  className="btn-primary text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="btn-accent text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing...</>
                  ) : (
                    `${paymentMethod === 'razorpay' ? '💳 Pay' : '📦 Place Order'} • ₹${total.toLocaleString()}`
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-neutral-100 rounded-sm p-6 sticky top-28">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3">
                    <div className="w-14 h-16 bg-neutral-100 flex-shrink-0 overflow-hidden">
                    <img loading="lazy" src={getImageUrl(item.image) || FALLBACK_IMG} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.title}</p>
                    <p className="text-[10px] text-neutral-500">{item.size} × {item.quantity}</p>
                    <p className="text-xs font-semibold mt-0.5">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm mt-4 pt-4 border-t border-neutral-100">
              <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

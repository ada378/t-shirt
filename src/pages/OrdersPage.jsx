import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMyOrders, cancelOrder } from '../features/orders/orderSlice';
import Loader from '../components/common/Loader';
import { FiPackage, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getImageUrl, FALLBACK_IMG } from '../utils/imageUrl';

const orderStatusStyles = {
  pending:    { bg: '#fff8e6', color: '#92600a', label: 'Pending' },
  confirmed:  { bg: '#e6f0ff', color: '#1a4db3', label: 'Confirmed' },
  processing: { bg: '#ede9fe', color: '#5b21b6', label: 'Processing' },
  shipped:    { bg: '#f3e8ff', color: '#7c3aed', label: 'Shipped' },
  delivered:  { bg: '#dcfce7', color: '#166534', label: 'Delivered' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

const paymentStatusStyles = {
  paid:    { bg: '#dcfce7', color: '#166534', icon: FiCheckCircle, label: 'Payment Done' },
  pending: { bg: '#fff8e6', color: '#92600a', icon: FiClock,       label: 'Payment Pending' },
  failed:  { bg: '#fee2e2', color: '#991b1b', icon: FiXCircle,     label: 'Payment Failed' },
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
    window.scrollTo(0, 0);
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(id));
      toast.success('Order cancelled');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="text-6xl mx-auto mb-4 text-neutral-300" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-neutral-500 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const orderStyle = orderStatusStyles[order.orderStatus] || orderStatusStyles.pending;
            const payStyle = paymentStatusStyles[order.paymentStatus] || paymentStatusStyles.pending;
            const PayIcon = payStyle.icon;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border rounded-sm overflow-hidden"
                style={{ borderColor: '#2a2a2a' }}
              >
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-6 py-3" style={{ background: '#141414', borderBottom: '1px solid #2a2a2a' }}>
                  <div>
                    <p className="text-xs text-neutral-400">Order <span className="font-mono font-semibold text-white">#{order._id.slice(-8).toUpperCase()}</span></p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Order status badge */}
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: orderStyle.bg, color: orderStyle.color }}
                    >
                      {orderStyle.label}
                    </span>

                    {/* Payment status badge */}
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                      style={{ background: payStyle.bg, color: payStyle.color }}
                    >
                      <PayIcon className="text-xs" />
                      {payStyle.label}
                    </span>

                    <span className="text-sm font-bold text-white">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Order items */}
                <div className="px-4 md:px-6 py-4 space-y-3">
                  {order.items?.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-neutral-800 overflow-hidden flex-shrink-0 rounded-sm">
                        <img loading="lazy" src={getImageUrl(item.image) || FALLBACK_IMG} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate text-neutral-200">{item.title}</p>
                        <p className="text-xs text-neutral-500">{item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-neutral-300">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-3" style={{ borderTop: '1px solid #2a2a2a', background: '#111' }}>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Payment:</span>
                    <span className="font-medium text-neutral-300 capitalize">
                      {order.paymentMethod === 'razorpay' ? '💳 Razorpay' : order.paymentMethod === 'cod' ? '💵 COD' : order.paymentMethod}
                    </span>
                  </div>

                  {order.trackingId && (
                    <span className="text-xs text-neutral-500">
                      Tracking: <span className="font-mono text-neutral-300">{order.trackingId}</span>
                    </span>
                  )}

                  {['pending', 'confirmed'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="text-xs text-red-400 hover:text-red-300 hover:underline ml-auto transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

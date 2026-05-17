import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAdminOrders, updateOrderStatus, refundOrder } from '../../features/admin/adminSlice';
import toast from 'react-hot-toast';
import { FiChevronDown, FiSearch, FiCheckCircle, FiTruck, FiMapPin, FiPhone, FiMail, FiUser, FiShoppingBag, FiRotateCcw } from 'react-icons/fi';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.admin);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { dispatch(fetchAdminOrders({ status: statusFilter || undefined })); }, [dispatch, statusFilter]);

  const handleStatusUpdate = (id, orderStatus) => {
    dispatch(updateOrderStatus({ id, data: { orderStatus } }));
    toast.success('Order updated');
  };

  const handleTrackingUpdate = (id, trackingId) => {
    dispatch(updateOrderStatus({ id, data: { trackingId } }));
    toast.success('Tracking ID updated');
  };

  const handleVerifyPayment = (id) => {
    dispatch(updateOrderStatus({ id, data: { paymentStatus: 'paid', orderStatus: 'confirmed' } }));
    toast.success('Payment verified successfully');
  };

  const handleRefund = (id) => {
    if (!window.confirm('Are you sure you want to refund this order? Stock will be restored.')) return;
    dispatch(refundOrder(id));
    toast.success('Order refunded');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold">Orders</h1>
        <div className="flex items-center gap-3">
          <FiSearch className="text-neutral-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none bg-white">
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 font-medium">Customer</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Total</th>
                <th className="text-left py-3 px-4 font-medium">Payment</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <>
                  <tr key={order._id} className="border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <td className="py-3 px-4 font-mono text-xs">#{order._id?.slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.user?.name || 'Guest'}</td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4 font-semibold">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${order.paymentMethod === 'qr' ? 'bg-purple-100 text-purple-700' : order.paymentMethod === 'razorpay' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-700'}`}>
                          {order.paymentMethod?.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <FiChevronDown className={`inline text-neutral-400 transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} />
                    </td>
                  </tr>
                  {expanded === order._id && (
                    <tr key={`${order._id}-details`}>
                      <td colSpan={7} className="px-4 py-4 bg-neutral-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1"><FiShoppingBag /> Items</h4>
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm py-1">
                                <div className="w-8 h-10 bg-neutral-200 overflow-hidden flex-shrink-0">
                                  <img src={item.image || ''} alt="" className="w-full h-full object-cover" />
                                </div>
                                <span className="truncate">{item.title} × {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1"><FiMapPin /> Shipping Address</h4>
                            {order.shippingAddress ? (
                              <div className="text-sm space-y-1 bg-white p-3 rounded-sm border border-neutral-100">
                                <p className="font-medium flex items-center gap-1"><FiUser className="text-neutral-400" /> {order.shippingAddress.name}</p>
                                <p className="flex items-center gap-1"><FiPhone className="text-neutral-400" /> {order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-400">No address data</p>
                            )}
                          </div>
                          <div className="space-y-4">
                            {(order.paymentMethod === 'qr' || order.paymentMethod === 'cod') && order.paymentStatus === 'pending' && (
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
                                <p className="text-xs font-semibold mb-1">
                                  {order.paymentMethod === 'qr' ? 'QR Payment - Pending Verification' : 'COD - Payment Pending'}
                                </p>
                                {order.paymentInfo?.utr && (
                                  <p className="text-xs text-neutral-600 mb-2">UTR: <strong>{order.paymentInfo.utr}</strong></p>
                                )}
                                <button onClick={() => handleVerifyPayment(order._id)}
                                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors">
                                  <FiCheckCircle /> Mark as Paid
                                </button>
                              </div>
                            )}
                            {order.paymentStatus === 'paid' && order.orderStatus !== 'refunded' && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                                <button onClick={() => handleRefund(order._id)}
                                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors w-full justify-center">
                                  <FiRotateCcw /> Refund Order
                                </button>
                              </div>
                            )}
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1"><FiTruck /> Update Status</h4>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {statuses.map((s) => (
                                  <button key={s} onClick={() => handleStatusUpdate(order._id, s)}
                                    className={`text-xs px-3 py-1.5 border rounded-sm ${order.orderStatus === s ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'} transition-colors`}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Tracking ID" id={`tracking-${order._id}`}
                                  className="flex-1 px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none" />
                                <button onClick={() => {
                                  const input = document.getElementById(`tracking-${order._id}`);
                                  if (input.value) handleTrackingUpdate(order._id, input.value);
                                }} className="px-4 py-2 bg-black text-white text-sm font-medium">Update</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-sm">
                            <span className="font-semibold text-xs">Notes:</span> {order.notes}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={7} className="py-12 text-center text-neutral-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
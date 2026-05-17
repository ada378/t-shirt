import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchDashboard } from '../../features/admin/adminSlice';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiClock, FiAlertCircle } from 'react-icons/fi';

const cards = [
  { key: 'totalOrders', label: 'Total Orders', icon: FiShoppingBag, color: 'bg-blue-500' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: FiClock, color: 'bg-yellow-500' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: FiDollarSign, color: 'bg-green-500', prefix: '₹' },
  { key: 'totalCustomers', label: 'Customers', icon: FiUsers, color: 'bg-purple-500' },
  { key: 'productsSold', label: 'Products Sold', icon: FiPackage, color: 'bg-orange-500' },
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, revenueData, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-sm p-4 md:p-6 border border-neutral-100 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-sm ${card.color}`}><card.icon className="text-white text-sm" /></span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{card.prefix || ''}{stats?.[card.key]?.toLocaleString() || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
            {card.key === 'pendingOrders' && stats?.pendingOrders > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {stats.pendingOrders}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="text-sm font-medium">#{order._id?.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-neutral-500">{order.user?.name || 'User'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{order.totalAmount?.toLocaleString()}</p>
                  <p className={`text-xs ${order.orderStatus === 'delivered' ? 'text-green-600' : order.orderStatus === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {order.orderStatus}
                  </p>
                </div>
              </div>
            ))}
            {(!recentOrders || recentOrders.length === 0) && <p className="text-sm text-neutral-400">No orders yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          {revenueData?.length > 0 ? (
            <div className="space-y-2">
              {revenueData.map((r) => (
                <div key={r._id} className="flex items-center justify-between py-2 border-b border-neutral-50">
                  <span className="text-sm">{r._id}</span>
                  <span className="text-sm font-semibold">₹{r.revenue?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No revenue data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
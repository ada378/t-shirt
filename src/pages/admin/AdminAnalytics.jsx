import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchDashboard } from '../../features/admin/adminSlice';
import { fetchProducts } from '../../features/products/productSlice';
import { fetchAdminOrders } from '../../features/admin/adminSlice';
import { FiTrendingUp, FiDollarSign, FiPackage, FiShoppingBag } from 'react-icons/fi';

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const { stats, orders, loading } = useSelector((s) => s.admin);
  const { products } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchProducts({ limit: 100 }));
    dispatch(fetchAdminOrders({ limit: 100 }));
  }, [dispatch]);

  const categoryStats = useMemo(() => {
    const cats = { 't-shirts': 0 };
    products?.forEach(p => { if (cats[p.category] !== undefined) cats[p.category]++; });
    return cats;
  }, [products]);

  const orderStatusStats = useMemo(() => {
    const statuses = {};
    orders?.forEach(o => { statuses[o.orderStatus] = (statuses[o.orderStatus] || 0) + 1; });
    return statuses;
  }, [orders]);

  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-500' },
          { label: 'Total Orders', value: totalOrders, icon: FiShoppingBag, color: 'bg-blue-500' },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toLocaleString()}`, icon: FiTrendingUp, color: 'bg-purple-500' },
          { label: 'Products', value: products?.length || 0, icon: FiPackage, color: 'bg-orange-500' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-sm p-4 md:p-6 border border-neutral-100"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-sm ${card.color}`}><card.icon className="text-white text-sm" /></span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Products by Category</h2>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm capitalize">{cat}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 md:w-48 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (count / Math.max(1, Object.values(categoryStats).reduce((a, b) => a + b, 0))) * 100)}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(orderStatusStats).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status === 'delivered' ? 'bg-green-500' : status === 'cancelled' ? 'bg-red-500' : status === 'shipped' ? 'bg-purple-500' : status === 'processing' ? 'bg-indigo-500' : status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm capitalize">{status}</span>
                </div>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(orderStatusStats).length === 0 && <p className="text-sm text-neutral-400">No orders yet</p>}
          </div>
        </div>

        {stats?.revenueData?.length > 0 && (
          <div className="bg-white rounded-sm border border-neutral-100 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
            <div className="flex items-end gap-3 h-40">
              {stats.revenueData.map((r, i) => {
                const maxRevenue = Math.max(...stats.revenueData.map(d => d.revenue || 0));
                const height = maxRevenue > 0 ? ((r.revenue || 0) / maxRevenue) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-neutral-500 font-medium">₹{(r.revenue || 0) > 999 ? `${((r.revenue || 0) / 1000).toFixed(1)}k` : r.revenue || 0}</span>
                    <div className="w-full bg-accent/20 rounded-t-sm" style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}>
                      <div className="w-full bg-accent rounded-t-sm transition-all duration-500" style={{ height: '100%' }} />
                    </div>
                    <span className="text-[10px] text-neutral-400">{r._id?.slice(-2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

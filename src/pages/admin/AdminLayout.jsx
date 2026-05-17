import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import API from '../../services/api';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiPercent, FiTrendingUp, FiLogOut, FiArrowLeft, FiBell } from 'react-icons/fi';

const sidebarLinks = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/analytics', icon: FiTrendingUp, label: 'Analytics' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/coupons', icon: FiPercent, label: 'Coupons' },
];

export default function AdminLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const checkNewOrders = useCallback(async () => {
    try {
      const lastCheck = localStorage.getItem('adminLastOrderCheck') || new Date(0).toISOString();
      const res = await API.get(`/admin/orders/new?since=${lastCheck}`);
      if (res.data.success && res.data.count > 0) {
        setNewOrdersCount((prev) => prev + res.data.count);
        if (Notification.permission === 'granted') {
          new Notification('New Order Received!', {
            body: `${res.data.count} new order${res.data.count > 1 ? 's' : ''} placed`,
            icon: '/favicon.ico'
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  }, []);

  useEffect(() => {
    checkNewOrders();
    const interval = setInterval(checkNewOrders, 30000);
    return () => clearInterval(interval);
  }, [checkNewOrders]);

  useEffect(() => {
    localStorage.setItem('adminLastOrderCheck', new Date().toISOString());
    setNewOrdersCount(0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <Link to="/admin" className="text-xl font-display font-bold">Urban Monarch</Link>
          <p className="text-xs text-neutral-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-colors ${location.pathname === link.to ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <link.icon className="text-base" />
              {link.label}
              {link.to === '/admin/orders' && newOrdersCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {newOrdersCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-100 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-100 rounded-sm transition-colors">
            <FiArrowLeft className="text-base" /> Back to Store
          </Link>
          <button onClick={() => dispatch(logout())} className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-sm transition-colors w-full">
            <FiLogOut className="text-base" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-neutral-200 px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="text-lg font-display font-bold">Urban Monarch</Link>
            <div className="flex gap-2">
              {sidebarLinks.map((link) => (
                <Link key={link.to} to={link.to} className={`p-2 rounded-sm ${location.pathname === link.to ? 'bg-black text-white' : 'text-neutral-600'}`}>
                  <link.icon className="text-sm" />
                  {link.to === '/admin/orders' && newOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">{newOrdersCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
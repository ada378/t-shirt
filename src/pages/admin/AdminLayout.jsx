import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiPercent, FiTrendingUp, FiLogOut, FiArrowLeft } from 'react-icons/fi';

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

import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { logout } from './features/auth/authSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = () => dispatch(logout());
    window.addEventListener('auth-error', handler);
    return () => window.removeEventListener('auth-error', handler);
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          <Route path="*" element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:category" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

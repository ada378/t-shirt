import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser, clearError, logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else { localStorage.clear(); navigate('/admin/login'); }
    }
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  useEffect(() => { if (error) toast.error(error); }, [error]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setErrors({});
    if (!validate()) return;
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      if (result.payload?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setLoginError('This account is not authorized as admin');
        toast.error('Admin access only');
        dispatch(logout());
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="bg-white p-8 rounded-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold">Urban Monarch</h1>
            <p className="text-neutral-500 text-xs mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }} className={`w-full px-3 py-2.5 border text-sm focus:border-black focus:outline-none ${errors.email ? 'border-red-400' : 'border-neutral-200'}`} placeholder="admin@urbanmonarch.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }} className={`w-full px-3 py-2.5 border text-sm focus:border-black focus:outline-none ${errors.password ? 'border-red-400' : 'border-neutral-200'}`} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
            <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => { if (user) navigate('/'); return () => dispatch(clearError()); }, [user, navigate, dispatch]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (validate()) dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-display font-bold">Urban Monarch</Link>
          <p className="text-neutral-500 text-sm mt-2">Welcome back! Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }} className={`input-field ${errors.email ? 'border-red-400' : ''}`} placeholder="your@email.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }} className={`input-field ${errors.password ? 'border-red-400' : ''}`} placeholder="••••••••" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-neutral-500">Don't have an account? <Link to="/register" className="text-black font-medium hover:underline">Create one</Link></p>
        </div>

      </motion.div>
    </div>
  );
}

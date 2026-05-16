import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser, clearError } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => { if (user) navigate('/'); return () => dispatch(clearError()); }, [user, navigate, dispatch]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (form.phone && !/^\+?[\d\s-]{10,}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) dispatch(registerUser({ name: form.name, email: form.email, password: form.password, phone: form.phone }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-display font-bold">Urban Monarch</Link>
          <p className="text-neutral-500 text-sm mt-2">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }} className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} className={`input-field ${errors.email ? 'border-red-400' : ''}`} placeholder="your@email.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }} className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="+91 98765 43210" />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} className={`input-field ${errors.password ? 'border-red-400' : ''}`} placeholder="Min 6 characters" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }} className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`} placeholder="Re-enter password" />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-neutral-500">Already have an account? <Link to="/login" className="text-black font-medium hover:underline">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
}

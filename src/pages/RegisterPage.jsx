import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { registerUser, clearError, sendOtp, resetOtp } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

// 6-box OTP input component
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      const next = [...digits];
      next[i] = '';
      onChange(next.join(''));
      return;
    }
    // handle paste of full OTP
    if (val.length > 1) {
      const pasted = val.slice(0, 6);
      onChange(pasted.padEnd(6, '').slice(0, 6).replace(/ /g, ''));
      inputs.current[Math.min(pasted.length - 1, 5)]?.focus();
      return;
    }
    const next = [...digits];
    next[i] = val[0];
    onChange(next.join(''));
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-lg outline-none transition-all duration-200 ${
            d ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-black focus:border-black'
          }`}
        />
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, otpLoading, otpSent, otpError } = useSelector((s) => s.auth);

  // redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
    return () => { dispatch(clearError()); dispatch(resetOtp()); };
  }, [user, navigate, dispatch]);

  // show auth errors
  useEffect(() => { if (error) toast.error(error); }, [error]);
  useEffect(() => { if (otpError) toast.error(otpError); }, [otpError]);

  // countdown timer for resend
  useEffect(() => {
    if (!countdown) return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

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

  const handleSendOtp = async () => {
    if (!validate()) return;
    const result = await dispatch(sendOtp(form.email));
    if (sendOtp.fulfilled.match(result)) {
      toast.success(`OTP sent to ${form.email}`);
      setCountdown(60);
      setOtp('');
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const result = await dispatch(sendOtp(form.email));
    if (sendOtp.fulfilled.match(result)) {
      toast.success('OTP resent successfully');
      setCountdown(60);
      setOtp('');
    }
  };

  const handleVerifyAndRegister = (e) => {
    e.preventDefault();
    if (otp.replace(/\s/g, '').length < 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    dispatch(registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      otp: otp.trim(),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
    } else {
      handleVerifyAndRegister(e);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        className={`input-field ${errors[key] ? 'border-red-400' : ''}`}
        placeholder={placeholder}
        disabled={otpSent}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-display font-bold">Urban Monarch</Link>
          <p className="text-neutral-500 text-sm mt-2">Create your account</p>
        </div>

        <AnimatePresence mode="wait">
          {!otpSent ? (
            /* ── STEP 1: Registration Form ── */
            <motion.form
              key="register-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleFormSubmit}
              className="space-y-4"
            >
              {field('name', 'Full Name', 'text', 'John Doe')}
              {field('email', 'Email', 'email', 'your@email.com')}
              {field('phone', 'Phone (optional)', 'tel', '+91 98765 43210')}
              {field('password', 'Password', 'password', 'Min 6 characters')}
              {field('confirmPassword', 'Confirm Password', 'password', 'Re-enter password')}

              <button
                type="submit"
                disabled={otpLoading}
                className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <FiMail className="text-sm" />
                    Send Verification Code
                    <FiArrowRight className="text-sm" />
                  </>
                )}
              </button>

              <div className="text-center text-sm mt-4">
                <p className="text-neutral-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-black font-medium hover:underline">Sign in</Link>
                </p>
              </div>
            </motion.form>
          ) : (
            /* ── STEP 2: OTP Verification ── */
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Email confirmation banner */}
              <div className="flex items-center gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-lg mb-6">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-white text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Verification code sent to</p>
                  <p className="text-sm font-semibold truncate">{form.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { dispatch(resetOtp()); setOtp(''); }}
                  className="text-xs text-neutral-400 hover:text-black underline flex-shrink-0"
                >
                  Change
                </button>
              </div>

              <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                <div>
                  <label className="text-sm font-medium block mb-3 text-center">
                    Enter 6-digit OTP
                  </label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.replace(/\s/g, '').length < 6}
                  className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="text-sm" />
                      Verify &amp; Create Account
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-xs text-neutral-500">
                      Resend OTP in <span className="font-semibold text-black">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpLoading}
                      className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 mx-auto disabled:opacity-50"
                    >
                      <FiRefreshCw className={`text-xs ${otpLoading ? 'animate-spin' : ''}`} />
                      {otpLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

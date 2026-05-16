import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    try {
      await API.post('/contact', form);
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch {
      toast.error('Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Get In Touch</h1>
        <p className="text-neutral-500 max-w-md mx-auto">Have a question, feedback, or just want to say hello? We'd love to hear from you.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }} className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
              <input type="email" placeholder="Your Email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
            </div>
            {errors.name && <p className="text-xs text-red-500 -mt-2">{errors.name}</p>}
            {errors.email && <p className="text-xs text-red-500 -mt-2">{errors.email}</p>}
            <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => { setForm({ ...form, subject: e.target.value }); setErrors({ ...errors, subject: '' }); }} className={`input-field ${errors.subject ? 'border-red-400' : ''}`} />
            {errors.subject && <p className="text-xs text-red-500 -mt-2">{errors.subject}</p>}
            <textarea placeholder="Your Message" rows={5} value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }} className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`} />
            {errors.message && <p className="text-xs text-red-500 -mt-2">{errors.message}</p>}
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <FiSend /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-sm">
            <FiMapPin className="text-accent mt-1 text-xl" />
            <div>
              <h3 className="font-semibold text-sm">Our Location</h3>
              <p className="text-sm text-neutral-500">123 Fashion Street,<br />Mumbai, Maharashtra 400001, India</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-sm">
            <FiMail className="text-accent mt-1 text-xl" />
            <div>
              <h3 className="font-semibold text-sm">Email Us</h3>
              <p className="text-sm text-neutral-500">hello@urbanmonarch.com<br />support@urbanmonarch.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-sm">
            <FiPhone className="text-accent mt-1 text-xl" />
            <div>
              <h3 className="font-semibold text-sm">Call Us</h3>
              <p className="text-sm text-neutral-500">+91 98765 43210<br />+91 98765 43211</p>
            </div>
          </div>
          <div className="h-48 bg-neutral-200 rounded-sm overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.2!2d72.8!3d19.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAwJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Location"></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

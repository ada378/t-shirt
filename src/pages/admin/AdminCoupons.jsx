import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchDashboard } from '../../features/admin/adminSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

export default function AdminCoupons() {
  const dispatch = useDispatch();
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'percentage', discountValue: '',
    minOrderAmount: '', maxDiscount: '', usageLimit: 100, expiryDate: ''
  });

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    try {
      const res = await API.get('/admin/coupons');
      setCoupons(res.data.coupons);
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/coupons', form);
      toast.success('Coupon created');
      setShowModal(false);
      setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: 100, expiryDate: '' });
      loadCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await API.delete(`/admin/coupons/${id}`);
        toast.success('Coupon deleted');
        loadCoupons();
      } catch { toast.error('Failed to delete'); }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Coupons</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors">
          <FiPlus /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <motion.div key={coupon._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-100 rounded-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-lg font-bold tracking-wider">{coupon.code}</span>
              <button onClick={() => handleDelete(coupon._id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 mb-3">{coupon.description || 'No description'}</p>
            <div className="space-y-1 text-xs text-neutral-500">
              <p>Discount: <strong className="text-neutral-800">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</strong></p>
              <p>Min Order: <strong className="text-neutral-800">₹{coupon.minOrderAmount?.toLocaleString() || 0}</strong></p>
              <p>Expires: <strong className="text-neutral-800">{new Date(coupon.expiryDate).toLocaleDateString('en-IN')}</strong></p>
              <p>Used: <strong className="text-neutral-800">{coupon.usedCount || 0}/{coupon.usageLimit}</strong></p>
            </div>
            <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {coupon.isActive ? 'Active' : 'Inactive'}
            </span>
          </motion.div>
        ))}
        {coupons.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-400">No coupons yet</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-sm">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 rounded"><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1">Coupon Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field uppercase" required />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Discount Value</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field" required min="1" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Min Order Amount (₹)</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="input-field" min="1" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input-field" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">Create Coupon</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

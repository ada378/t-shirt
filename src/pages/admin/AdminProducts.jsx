import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { createProduct, updateProductAdmin, deleteProductAdmin, bulkCreateProducts, fetchAdminProducts } from '../../features/admin/adminSlice';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiUpload, FiFileText } from 'react-icons/fi';
import { getProductImage, FALLBACK_IMG } from '../../utils/imageUrl';

const categories = ['t-shirts', 'hoodies', 'jeans'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const getEmptyProduct = () => ({
  title: '', description: '', price: '', discountPercent: '', category: 't-shirts',
  sizes: [], colors: [], stock: '', isFeatured: false, isBestSeller: false,
  isNewArrival: false, isPremium: false, material: 'Cotton',
  images: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }]
});

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.admin);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(getEmptyProduct());
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  useEffect(() => { dispatch(fetchAdminProducts()); }, [dispatch]);

  const openCreate = () => { setForm(getEmptyProduct()); setEditing(null); setShowModal(true); };
  const openEdit = (product) => {
    const imgs = product.images?.length ? [...product.images] : [{ url: '' }, { url: '' }, { url: '' }, { url: '' }];
    while (imgs.length < 4) imgs.push({ url: '' });
    const pct = product.price > 0 && product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : '';
    setForm({
      title: product.title, description: product.description, price: product.price,
      discountPercent: pct, category: product.category,
      sizes: product.sizes, colors: product.colors || [], stock: product.stock,
      isFeatured: product.isFeatured, isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival, isPremium: product.isPremium || false, material: product.material || 'Cotton',
      images: imgs
    });
    setEditing(product._id);
    setShowModal(true);
  };

  const addColor = () => {
    setForm({ ...form, colors: [...form.colors, { name: '', hex: '#000000' }] });
  };
  const removeColor = (i) => {
    setForm({ ...form, colors: form.colors.filter((_, idx) => idx !== i) });
  };
  const updateColor = (i, field, value) => {
    const colors = [...form.colors];
    colors[i] = { ...colors[i], [field]: value };
    setForm({ ...form, colors });
  };

  const handleImageUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const formData = new FormData();
      formData.append('images', file);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      if (res.data.success && res.data.files.length > 0) {
        const imgs = [...form.images];
        imgs[idx] = { url: res.data.files[0].url };
        setForm({ ...form, images: imgs });
        toast.success('Image uploaded');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkJson);
      const products = Array.isArray(parsed) ? parsed : [parsed];
      if (products.length === 0) return toast.error('No products found in JSON');
      setBulkImporting(true);
      const result = await dispatch(bulkCreateProducts(products)).unwrap();
      toast.success(`${result.count} products imported successfully`);
      setShowBulkModal(false);
      setBulkJson('');
      dispatch(fetchAdminProducts());
    } catch (err) {
      if (err instanceof SyntaxError) toast.error('Invalid JSON format');
      else toast.error(err?.message || 'Bulk import failed');
    } finally {
      setBulkImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (!form.price || Number(form.price) <= 0) return toast.error('Price must be greater than 0');
    if (!form.stock || Number(form.stock) < 0) return toast.error('Stock is required');
    if (form.sizes.length === 0) return toast.error('Select at least one size');
    const { discountPercent, ...rest } = form;
    const data = {
      ...rest,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: discountPercent ? Number(form.price) - (Number(form.price) * Number(discountPercent) / 100) : 0,
      stock: Number(form.stock),
      images: form.images?.filter(img => img.url?.trim()),
    };
    try {
      if (editing) {
        await dispatch(updateProductAdmin({ id: editing, data })).unwrap();
        toast.success('Product updated');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created');
      }
      setShowModal(false);
      dispatch(fetchAdminProducts());
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to save product');
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setConfirmDeleteLoading(true);
    try {
      await dispatch(deleteProductAdmin(confirmDeleteId)).unwrap();
      toast.success('Product deleted');
      dispatch(fetchAdminProducts());
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to delete');
    } finally {
      setConfirmDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Products</h1>
        <div className="flex gap-2">
          <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors">
            <FiPlus /> Add Product
          </button>
          <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 border border-black text-black px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors">
            <FiFileText /> Bulk Import
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Product</th>
                <th className="text-left py-3 px-4 font-medium">Category</th>
                <th className="text-left py-3 px-4 font-medium">Price</th>
                <th className="text-left py-3 px-4 font-medium">Stock</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p._id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-neutral-100 overflow-hidden flex-shrink-0">
                        <img loading="lazy" src={getProductImage(p) || FALLBACK_IMG} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize">{p.category}</td>
                  <td className="py-3 px-4">₹{(p.discountPrice || p.price).toLocaleString()}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-neutral-400 hover:text-blue-600 transition-colors"><FiEdit2 className="text-sm" /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors ml-1"><FiTrash2 className="text-sm" /></button>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr><td colSpan={6} className="py-12 text-center text-neutral-400">No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-sm">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 rounded"><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium block mb-1">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium block mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} required />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required min="0" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Discount (%)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="input-field" min="0" max="100" placeholder="0" />
                    <span className="text-xs text-neutral-400 whitespace-nowrap">% off</span>
                  </div>
                  {form.price && form.discountPercent ? (
                    <p className="text-xs mt-1 text-accent font-medium">
                      Final: ₹{Math.round(Number(form.price) - (Number(form.price) * Number(form.discountPercent) / 100)).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-xs mt-1 text-neutral-300">Enter % to see final price</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" required min="0" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Material</label>
                  <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium block mb-1">Sizes</label>
                  <div className="flex gap-2">
                    {sizes.map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, sizes: form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s] })}
                        className={`px-4 py-2 text-sm border ${form.sizes.includes(s) ? 'bg-black text-white' : 'border-neutral-200 hover:border-black'} transition-colors`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium block mb-1">Colors</label>
                  {form.colors?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input type="text" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} placeholder="Color name" className="input-field flex-1" />
                      <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} className="w-10 h-10 border border-neutral-200 cursor-pointer" />
                      <button type="button" onClick={() => removeColor(i)} className="p-2 text-red-400 hover:text-red-600"><FiX className="text-sm" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addColor} className="text-xs text-accent font-medium hover:underline">+ Add Color</button>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium block mb-2">Product Images (up to 4) — Click to upload</label>
                  <div className="grid grid-cols-4 gap-3">
                    {form.images?.map((img, i) => (
                      <div key={i}>
                        <label className={`aspect-square flex items-center justify-center border border-dashed overflow-hidden cursor-pointer relative group ${img.url ? 'border-neutral-300' : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-50'}`}>
                          {uploadingIdx === i ? (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">Uploading...</div>
                          ) : img.url ? (
                            <div className="w-full h-full relative">
                              <img loading="lazy" src={img.url} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                                <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-neutral-300">
                              <FiUpload className="text-xl" />
                              <span className="text-[10px]">Upload</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, i)} />
                        </label>
                        {img.url && (
                          <button type="button" onClick={() => {
                            const imgs = [...form.images];
                            imgs[i] = { url: '' };
                            setForm({ ...form, images: imgs });
                          }} className="w-full text-[10px] text-red-500 hover:text-red-700 mt-1">Remove</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-black" /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="accent-black" /> Best Seller</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="accent-black" /> New Arrival</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} className="accent-black" /> Premium</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">Save Product</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
              <p className="text-sm text-neutral-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setConfirmDeleteId(null)} className="btn-outline text-sm">Cancel</button>
                <button type="button" onClick={confirmDelete} disabled={confirmDeleteLoading} className="btn-primary text-sm">
                  {confirmDeleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-sm">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-semibold">Bulk Import Products</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Paste JSON array of products below</p>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="p-1 hover:bg-neutral-100 rounded"><FiX /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium block mb-2">Product JSON</label>
                <textarea
                  value={bulkJson}
                  onChange={(e) => setBulkJson(e.target.value)}
                  className="w-full border border-neutral-200 p-3 text-xs font-mono focus:border-black focus:outline-none resize-none"
                  rows={14}
                  placeholder={`[\n  {\n    "title": "Classic Black Tee",\n    "description": "Premium cotton t-shirt",\n    "price": 799,\n    "category": "t-shirts",\n    "sizes": ["S","M","L","XL"],\n    "stock": 50,\n    "material": "Cotton",\n    "images": [{ "url": "https://example.com/image1.jpg" }],\n    "isFeatured": true\n  }\n]`}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowBulkModal(false)} className="btn-outline text-sm">Cancel</button>
                <button onClick={handleBulkImport} disabled={bulkImporting || !bulkJson.trim()} className="btn-primary text-sm disabled:opacity-50">
                  {bulkImporting ? 'Importing...' : 'Import Products'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

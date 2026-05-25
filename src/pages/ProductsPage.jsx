import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { useInView } from '../hooks/useInView';
import { FiFilter, FiGrid, FiSliders, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const categories = [
  { name: 'All', slug: '' },
  { name: 'T-Shirts', slug: 't-shirts' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestseller', label: 'Best Selling' },
];

export default function ProductsPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, pagination, loading } = useSelector((s) => s.products);

  // Lazy-load the products grid section when it enters viewport
  const [gridRef, gridInView] = useInView({ rootMargin: '400px', triggerOnce: false });

  const [filters, setFilters] = useState({
    category: category || searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    page: Number(searchParams.get('page')) || 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    else if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.size) params.size = filters.size;
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;
    if (filters.page > 1) params.page = filters.page;
    dispatch(fetchProducts(params));
    window.scrollTo(0, 0);
  }, [dispatch, category, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', size: '', sort: 'newest', search: '', page: 1 });
  };

  const hasFilters = filters.minPrice || filters.maxPrice || filters.size || filters.category || filters.search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-medium capitalize">{category || 'All Products'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold capitalize">{category || 'All Products'}</h1>
        <p className="text-neutral-500 text-sm mt-1">{pagination.total || 0} products found</p>
      </motion.div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            to={cat.slug ? `/products/${cat.slug}` : '/products'}
            className={`px-5 py-2 text-sm font-medium transition-colors ${(category || '') === cat.slug ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-sm hover:bg-neutral-50 transition-colors">
            <FiSliders /> Filters
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-neutral-500 hover:text-black flex items-center gap-1">
              <FiX /> Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={(e) => { e.preventDefault(); updateFilter('search', e.target.search.value); }} className="hidden md:flex">
            <input name="search" type="text" placeholder="Search..." defaultValue={filters.search} className="w-40 px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none" />
          </form>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none bg-white">
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: showFilters ? 260 : 0, opacity: showFilters ? 1 : 0 }}
          className={`overflow-hidden flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          style={{ width: showFilters ? 260 : 0 }}
        >
          {showFilters && (
            <div className="w-[260px] space-y-6 pr-4">
              <div>
                <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none" />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button key={s} onClick={() => updateFilter('size', filters.size === s ? '' : s)}
                      className={`w-10 h-10 text-sm border ${filters.size === s ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'} transition-colors`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.aside>

        <div className="flex-1">
          {/* Sentinel div — grid renders when this enters viewport */}
          <div ref={gridRef} />
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-neutral-500 mb-6">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-outline text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {products?.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          {pagination?.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateFilter('page', pagination.page - 1)}
                className="p-2 border border-neutral-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter('page', i + 1)}
                  className={`w-10 h-10 text-sm border ${pagination.page === i + 1 ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'} transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => updateFilter('page', pagination.page + 1)}
                className="p-2 border border-neutral-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

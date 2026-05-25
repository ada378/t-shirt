import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await API.get('/products', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/products/featured');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured products');
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
  }
});

const initialState = {
  products: [],
  featured: [],
  bestSellers: [],
  newArrivals: [],
  premium: [],
  product: null,
  pagination: { total: 0, page: 1, pages: 1 },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: (state) => { state.product = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload.products; state.pagination = action.payload.pagination; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeaturedProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.loading = false; state.featured = action.payload.featured || []; state.bestSellers = action.payload.bestSellers || []; state.newArrivals = action.payload.newArrivals || []; state.premium = action.payload.premium || []; })
      .addCase(fetchFeaturedProducts.rejected, (state) => { state.loading = false; })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.product = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearProduct, clearError } = productSlice.actions;
export const selectProducts = (state) => state.products;
export default productSlice.reducer;

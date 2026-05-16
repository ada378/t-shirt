import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/admin/dashboard');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAdminOrders = createAsyncThunk('admin/orders', async (params, { rejectWithValue }) => {
  try {
    const res = await API.get('/admin/orders', { params });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrder', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/admin/orders/${id}`, data);
    return res.data.order;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAdminUsers = createAsyncThunk('admin/users', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/admin/users');
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/admin/products', data);
    return res.data.product;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateProductAdmin = createAsyncThunk('admin/updateProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/admin/products/${id}`, data);
    return res.data.product;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const bulkCreateProducts = createAsyncThunk('admin/bulkCreateProducts', async (products, { rejectWithValue }) => {
  try {
    const res = await API.post('/admin/products/bulk', { products });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Bulk import failed');
  }
});

export const deleteProductAdmin = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/admin/products/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAdminProducts = createAsyncThunk('admin/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/admin/products');
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const initialState = {
  stats: null,
  recentOrders: [],
  revenueData: [],
  orders: [],
  users: [],
  totalOrders: 0,
  products: [],
  totalProducts: 0,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.stats = action.payload.stats; state.recentOrders = action.payload.recentOrders; state.revenueData = action.payload.revenueData; })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => { state.orders = action.payload.orders; state.totalOrders = action.payload.total; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx > -1) state.orders[idx] = action.payload;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.users = action.payload.users; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.products = action.payload.products; state.totalProducts = action.payload.total; })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.loading = false; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default adminSlice.reducer;

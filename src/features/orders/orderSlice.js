import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/orders/create', data);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/orders/my-orders');
    return res.data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await API.put(`/orders/cancel/${id}`);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
  }
});

const initialState = { orders: [], currentOrder: null, loading: false, error: null };

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: { clearCurrentOrder: (state) => { state.currentOrder = null; }, },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => { state.currentOrder = action.payload; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx > -1) state.orders[idx] = action.payload;
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.loading = false; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;

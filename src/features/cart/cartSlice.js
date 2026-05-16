import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/cart');
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/cart/add', data);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/cart/${itemId}`, data);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const res = await API.delete(`/cart/remove/${itemId}`);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
  }
});

export const applyCoupon = createAsyncThunk('cart/coupon', async (code, { rejectWithValue }) => {
  try {
    const res = await API.post('/cart/coupon', { code });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid coupon');
  }
});

const initialState = { items: [], couponCode: null, discount: 0, loading: false, error: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => { state.items = []; state.couponCode = null; state.discount = 0; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload.items; state.couponCode = action.payload.couponCode; state.discount = action.payload.discount; })
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload.items; state.couponCode = action.payload.couponCode; state.discount = action.payload.discount; })
      .addCase(updateCartItem.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.items = action.payload.items; state.couponCode = action.payload.couponCode; state.discount = action.payload.discount; })
      .addCase(applyCoupon.fulfilled, (state, action) => { state.couponCode = action.payload.cart.couponCode; state.discount = action.payload.discount; })
      .addCase(applyCoupon.rejected, (state, action) => { state.error = action.payload; })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.loading = false; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state) => { state.loading = false; });
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export const selectCart = (state) => state.cart;
export default cartSlice.reducer;

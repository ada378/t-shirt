import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/wishlist');
    return res.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try {
    const res = await API.post('/wishlist/add', { productId });
    return res.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update wishlist');
  }
});

const initialState = { items: [], loading: false, error: null };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(toggleWishlist.fulfilled, (state, action) => { state.items = action.payload; })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.loading = false; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectWishlist = (state) => state.wishlist;
export default wishlistSlice.reducer;

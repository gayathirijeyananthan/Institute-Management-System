import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export default function createResourceSlice(name, endpoint) {
  const fetchItems = createAsyncThunk(`${name}/fetch`, async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoint, { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Unable to load ${name}`);
    }
  });

  const createItem = createAsyncThunk(`${name}/create`, async (payload, { rejectWithValue }) => {
    try {
      const config = payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const { data } = await api.post(endpoint, payload, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Unable to create ${name}`);
    }
  });

  const updateItem = createAsyncThunk(`${name}/update`, async ({ id, values }, { rejectWithValue }) => {
    try {
      const config = values instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const { data } = await api.put(`${endpoint}/${id}`, values, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Unable to update ${name}`);
    }
  });

  const deleteItem = createAsyncThunk(`${name}/delete`, async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Unable to delete ${name}`);
    }
  });

  const slice = createSlice({
    name,
    initialState: { items: [], loading: false, error: null, page: 1, pages: 1, total: 0 },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchItems.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload.items || [];
          state.page = action.payload.page || 1;
          state.pages = action.payload.pages || 1;
          state.total = action.payload.total || 0;
        })
        .addCase(createItem.fulfilled, (state, action) => {
          state.items.unshift(action.payload);
          state.total += 1;
        })
        .addCase(updateItem.fulfilled, (state, action) => {
          state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
          state.items = state.items.filter((item) => item._id !== action.payload);
          state.total = Math.max(state.total - 1, 0);
        })
        .addMatcher((action) => action.type.startsWith(`${name}/`) && action.type.endsWith('/rejected'), (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });

  return { reducer: slice.reducer, actions: { fetchItems, createItem, updateItem, deleteItem } };
}

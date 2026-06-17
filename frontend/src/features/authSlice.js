import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

const storedUser = JSON.parse(localStorage.getItem('ims_user') || 'null');

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('ims_token', data.token);
    localStorage.setItem('ims_user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerInstitute = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    localStorage.setItem('ims_token', data.token);
    localStorage.setItem('ims_user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loadMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('ims_user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: storedUser, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('ims_token');
      localStorage.removeItem('ims_user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/fulfilled'), (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

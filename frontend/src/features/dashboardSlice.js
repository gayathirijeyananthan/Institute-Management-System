import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/dashboard');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to load dashboard');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    totals: { students: 0, cohorts: 0, centers: 0, staff: 0 },
    attendanceSummary: [],
    studentGrowth: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.totals = action.payload.totals;
        state.attendanceSummary = action.payload.attendanceSummary;
        state.studentGrowth = action.payload.studentGrowth;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;

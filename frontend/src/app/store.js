import { configureStore } from '@reduxjs/toolkit';
import activitySlice from '../features/activitySlice.js';
import announcementSlice from '../features/announcementSlice.js';
import authReducer from '../features/authSlice.js';
import centerSlice from '../features/centerSlice.js';
import clubSlice from '../features/clubSlice.js';
import cohortSlice from '../features/cohortSlice.js';
import dashboardReducer from '../features/dashboardSlice.js';
import attendanceSlice from '../features/attendanceSlice.js';
import instituteSlice from '../features/instituteSlice.js';
import moduleSlice from '../features/moduleSlice.js';
import staffSlice from '../features/staffSlice.js';
import studentSlice from '../features/studentSlice.js';
import submissionSlice from '../features/submissionSlice.js';

export const resourceActions = {
  centers: centerSlice.actions,
  cohorts: cohortSlice.actions,
  students: studentSlice.actions,
  staff: staffSlice.actions,
    activities: activitySlice.actions,
    attendance: attendanceSlice.actions,
    announcements: announcementSlice.actions,
    modules: moduleSlice.actions,
    clubs: clubSlice.actions,
    submissions: submissionSlice.actions,
    institutes: instituteSlice.actions
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    centers: centerSlice.reducer,
    cohorts: cohortSlice.reducer,
    students: studentSlice.reducer,
    staff: staffSlice.reducer,
    activities: activitySlice.reducer,
    attendance: attendanceSlice.reducer,
    announcements: announcementSlice.reducer,
    modules: moduleSlice.reducer,
    clubs: clubSlice.reducer,
    submissions: submissionSlice.reducer,
    institutes: instituteSlice.reducer
  }
});

import { configureStore } from '@reduxjs/toolkit';
import activitySlice from '../features/activitySlice.js';
import announcementSlice from '../features/announcementSlice.js';
import authReducer from '../features/authSlice.js';
import centerSlice from '../features/centerSlice.js';
import cohortSlice from '../features/cohortSlice.js';
import dashboardReducer from '../features/dashboardSlice.js';
import attendanceSlice from '../features/attendanceSlice.js';
import staffSlice from '../features/staffSlice.js';
import studentSlice from '../features/studentSlice.js';

export const resourceActions = {
  centers: centerSlice.actions,
  cohorts: cohortSlice.actions,
  students: studentSlice.actions,
  staff: staffSlice.actions,
  activities: activitySlice.actions,
  attendance: attendanceSlice.actions,
  announcements: announcementSlice.actions
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
    announcements: announcementSlice.reducer
  }
});

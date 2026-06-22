import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import { LoginPage, RegisterPage } from './pages/AuthPages.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ResourcePage from './pages/ResourcePage.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/centers" element={<ResourcePage resource="centers" />} />
            <Route path="/cohorts" element={<ResourcePage resource="cohorts" />} />
            <Route path="/students" element={<ResourcePage resource="students" />} />
            <Route path="/staff" element={<ResourcePage resource="staff" />} />
            <Route path="/activities" element={<ResourcePage resource="activities" />} />
            <Route path="/attendance" element={<ResourcePage resource="attendance" />} />
            <Route path="/announcements" element={<ResourcePage resource="announcements" />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

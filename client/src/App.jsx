import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import PropertiesPage from './pages/Properties/PropertiesPage';
import PropertyDetailsPage from './pages/Properties/PropertyDetailsPage';
import CreatePropertyPage from './pages/Properties/CreatePropertyPage';
import EditPropertyPage from './pages/Properties/EditPropertyPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AgentDashboard from './pages/Dashboard/AgentDashboard';
import AgentList from './pages/Agents/AgentList';
import AgentProfile from './pages/Agents/AgentProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import AgentOwnerList from './pages/Admin/AgentOwnerList';
import PropertyStatistics from './pages/Admin/PropertyStatistics';
import PropertyManagement from './pages/Admin/PropertyManagement';
import AdminProfile from './pages/Admin/AdminProfile';
import AccountSettings from './pages/Admin/AccountSettings';
import ActivityLog from './pages/Admin/ActivityLog';
import Notifications from './pages/Admin/Notifications';
import Security from './pages/Admin/Security';
import Preferences from './pages/Admin/Preferences';
import HelpSupport from './pages/Admin/HelpSupport';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
          {/* Admin Routes - Separate from main layout (no header/footer) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="properties" element={<PropertyManagement />} />
            <Route path="agents-owners" element={<AgentOwnerList />} />
            <Route path="statistics" element={<PropertyStatistics />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="security" element={<Security />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="help" element={<HelpSupport />} />
          </Route>

          {/* Main Website Routes - With header and footer */}
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Agent Routes */}
            <Route path="/agents" element={<AgentList />} />
            <Route path="/agents/:id" element={<AgentProfile />} />

            {/* Protected Routes */}
            <Route
              path="/properties/create"
              element={
                <PrivateRoute>
                  <CreatePropertyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/properties/:id/edit"
              element={
                <PrivateRoute>
                  <EditPropertyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/agent"
              element={
                <PrivateRoute>
                  <AgentDashboard />
                </PrivateRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Club Pages
import ClubDashboard from './pages/Club/Dashboard';
import CreateEvent from './pages/Club/CreateEvent';
import MyEvents from './pages/Club/MyEvents';
import ClubCalendar from './pages/Club/Calendar';
import ClubNotifications from './pages/Club/Notifications';

// Faculty Pages
import FacultyDashboard from './pages/Faculty/Dashboard';
import FacultyEvents from './pages/Faculty/Events';
import PendingEvents from './pages/Faculty/PendingEvents';
import FacultyCalendar from './pages/Faculty/Calendar';
import FacultyVenues from './pages/Faculty/Venues';
import FacultyStatistics from './pages/Faculty/Statistics';
import FacultySettings from './pages/Faculty/Settings';
import FacultyNotifications from './pages/Faculty/Notifications';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AllEvents from './pages/Admin/AllEvents';
import AdminVenues from './pages/Admin/Venues';
import AdminCalendar from './pages/Admin/Calendar';
import AdminClubs from './pages/Admin/Clubs';
import AdminApprovals from './pages/Admin/Approvals';
import AdminNotifications from './pages/Admin/Notifications';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminSettings from './pages/Admin/Settings';

// Principal Pages
import PrincipalDashboard from './pages/Principal/Dashboard';
import FinalApprovals from './pages/Principal/FinalApprovals';
import MajorEvents from './pages/Principal/MajorEvents';
import BudgetOversight from './pages/Principal/BudgetOversight';
import PrincipalCalendar from './pages/Principal/Calendar';
import PrincipalAnalytics from './pages/Principal/Analytics';
import PrincipalNotifications from './pages/Admin/Notifications'; // Reusing notification component
import PrincipalSettings from './pages/Admin/Settings'; // Reusing settings component

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'club') return <Navigate to="/club/dashboard" replace />;
  if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'principal') return <Navigate to="/principal/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes (No Sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Club Routes (With Sidebar) */}
          <Route path="/club/*" element={
            <ProtectedRoute allowedRoles={['club']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<ClubDashboard />} />
                  <Route path="create-event" element={<CreateEvent />} />
                  <Route path="my-events" element={<MyEvents />} />
                  <Route path="calendar" element={<ClubCalendar />} />
                  <Route path="notifications" element={<ClubNotifications />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Faculty Routes (With Sidebar) */}
          <Route path="/faculty/*" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<FacultyDashboard />} />
                  <Route path="events" element={<FacultyEvents />} />
                  <Route path="pending-events" element={<PendingEvents />} />
                  <Route path="calendar" element={<FacultyCalendar />} />
                  <Route path="venues" element={<FacultyVenues />} />
                  <Route path="statistics" element={<FacultyStatistics />} />
                  <Route path="notifications" element={<FacultyNotifications />} />
                  <Route path="settings" element={<FacultySettings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes (With Sidebar) */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="events" element={<AllEvents />} />
                  <Route path="venues" element={<AdminVenues />} />
                  <Route path="calendar" element={<AdminCalendar />} />
                  <Route path="clubs" element={<AdminClubs />} />
                  <Route path="approvals" element={<AdminApprovals />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Principal Routes (With Sidebar) */}
          <Route path="/principal/*" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<PrincipalDashboard />} />
                  <Route path="final-approvals" element={<FinalApprovals />} />
                  <Route path="major-events" element={<MajorEvents />} />
                  <Route path="budget" element={<BudgetOversight />} />
                  <Route path="calendar" element={<PrincipalCalendar />} />
                  <Route path="analytics" element={<PrincipalAnalytics />} />
                  <Route path="notifications" element={<PrincipalNotifications />} />
                  <Route path="settings" element={<PrincipalSettings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

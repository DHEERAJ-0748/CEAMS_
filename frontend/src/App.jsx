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

// Faculty Pages
import FacultyDashboard from './pages/Faculty/Dashboard';
import PendingEvents from './pages/Faculty/PendingEvents';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AllEvents from './pages/Admin/AllEvents';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'club') return <Navigate to="/club/dashboard" replace />;
  if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
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
                  <Route path="pending-events" element={<PendingEvents />} />
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

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  List, 
  Clock, 
  CheckSquare, 
  LogOut,
  Building
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive(to) 
          ? 'bg-brand-800 text-white' 
          : 'text-surface-300 hover:bg-brand-800/50 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );

  return (
    <div className="w-64 bg-brand-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-brand-800 shrink-0">
        <Building className="w-6 h-6 text-brand-300 mr-2" />
        <span className="font-bold text-xl tracking-wider">CEAMS</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4 px-4">
          Menu
        </div>
        
        {user.role === 'club' && (
          <>
            <NavItem to="/club/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/club/create-event" icon={CalendarPlus} label="Create Event" />
            <NavItem to="/club/my-events" icon={List} label="My Events" />
          </>
        )}

        {user.role === 'faculty' && (
          <>
            <NavItem to="/faculty/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/faculty/pending-events" icon={Clock} label="Pending Reviews" />
          </>
        )}

        {user.role === 'admin' && (
          <>
            <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/events" icon={CheckSquare} label="All Events" />
          </>
        )}
      </div>

      {/* User Area */}
      <div className="p-4 border-t border-brand-800 shrink-0">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-brand-400 capitalize">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  List, 
  Clock, 
  CheckSquare, 
  LogOut,
  Building,
  MapPin,
  CalendarDays,
  Users,
  Activity,
  Bell,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative ${
        isActive(to) 
          ? 'bg-white/10 text-white shadow-inner-brand' 
          : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
      }`}
    >
      {isActive(to) && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-400 rounded-r-full" />
      )}
      <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive(to) ? 'text-brand-300' : ''}`} />
      <span className="truncate">{label}</span>
      {isActive(to) && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
      )}
    </Link>
  );

  const SectionLabel = ({ children }) => (
    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2 mt-6 first:mt-0 px-3.5">
      {children}
    </div>
  );

  return (
    <div className="w-64 bg-gradient-to-b from-brand-900 via-brand-900 to-brand-800 text-white flex flex-col h-screen fixed left-0 top-0 overflow-hidden z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">CEAMS</span>
          <span className="text-[9px] font-bold bg-brand-500/30 text-brand-200 px-1.5 py-0.5 rounded-md ml-0.5">v2</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {user.role === 'club' && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavItem to="/club/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SectionLabel>Events</SectionLabel>
            <NavItem to="/club/create-event" icon={CalendarPlus} label="Create Event" />
            <NavItem to="/club/my-events" icon={List} label="My Events" />
            <SectionLabel>Activity</SectionLabel>
            <NavItem to="/club/notifications" icon={Bell} label="Notifications" />
          </>
        )}

        {user.role === 'faculty' && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavItem to="/faculty/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SectionLabel>Review</SectionLabel>
            <NavItem to="/faculty/events" icon={List} label="Events" />
            <NavItem to="/faculty/pending-events" icon={Clock} label="Requests" />
            <SectionLabel>Resources</SectionLabel>
            <NavItem to="/faculty/calendar" icon={CalendarDays} label="Calendar" />
            <NavItem to="/faculty/venues" icon={MapPin} label="Venues" />
            <NavItem to="/faculty/statistics" icon={BarChart3} label="Statistics" />
            <SectionLabel>Activity</SectionLabel>
            <NavItem to="/faculty/notifications" icon={Bell} label="Notifications" />
            <NavItem to="/faculty/settings" icon={Settings} label="Settings" />
          </>
        )}

        {user.role === 'admin' && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SectionLabel>Management</SectionLabel>
            <NavItem to="/admin/events" icon={CheckSquare} label="Event Requests" />
            <NavItem to="/admin/venues" icon={MapPin} label="Venues" />
            <NavItem to="/admin/calendar" icon={CalendarDays} label="Calendar" />
            <NavItem to="/admin/clubs" icon={Users} label="Clubs" />
            <SectionLabel>Insights</SectionLabel>
            <NavItem to="/admin/approvals" icon={Activity} label="Approvals" />
            <NavItem to="/admin/notifications" icon={Bell} label="Notifications" />
            <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/admin/settings" icon={Settings} label="Settings" />
          </>
        )}
      </div>

      {/* User Area */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-white/40 capitalize">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2.5 px-3.5 py-2 w-full rounded-xl text-[13px] font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

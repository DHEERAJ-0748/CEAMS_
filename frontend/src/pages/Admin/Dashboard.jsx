import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  Loader2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, eventsRes] = await Promise.all([
          axios.get('/api/analytics'),
          axios.get('/api/admin/events')
        ]);
        setData(analyticsRes.data.stats);
        setRecentEvents(eventsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Total Events', value: data?.totalEvents || 0, icon: CalendarCheck, color: 'from-brand-500 to-brand-600', bg: 'bg-brand-50', text: 'text-brand-600' },
    { title: 'Pending Approvals', value: data?.pendingApprovals || 0, icon: Clock, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    { title: 'Venues Booked', value: data?.bookedVenuesToday || 0, icon: MapPin, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { title: 'Active Clubs', value: data?.activeClubs || 0, icon: Users, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white rounded-2xl p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-brand-400 rounded-full blur-[80px] opacity-10 translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-brand-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Admin Control Center
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back</h1>
            <p className="text-brand-200/80 max-w-lg text-sm leading-relaxed">
              Monitor institutional event flow, manage facilities, and oversee club activities from your central dashboard.
            </p>
          </div>
          <Link to="/admin/events" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 border-none font-semibold px-6 shadow-elevated shrink-0">
            Review Requests
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-surface-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-surface-900 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Event Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-surface-900">Recent Requests</h3>
            <Link to="/admin/events" className="text-brand-600 text-xs font-semibold hover:text-brand-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                      {event.users?.club_name?.charAt(0) || 'E'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-surface-800 text-[13px] truncate">{event.title}</p>
                      <p className="text-[11px] text-surface-400 truncate">{event.users?.club_name}</p>
                    </div>
                  </div>
                  <span className={`badge shrink-0 ml-3 ${
                    event.status === 'faculty_approved' ? 'badge-pending' : 
                    event.status === 'approved' || event.status === 'admin_approved' ? 'badge-approved' : 'badge-rejected'
                  }`}>
                    {event.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state py-12">
                <CalendarCheck className="empty-state-icon" />
                <p className="empty-state-title">No requests</p>
                <p className="empty-state-desc">No event requests found at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-surface-900">Upcoming Events</h3>
            <Link to="/admin/calendar" className="text-brand-600 text-xs font-semibold hover:text-brand-700 flex items-center gap-1 transition-colors">
              Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentEvents.filter(e => e.status === 'approved' || e.status === 'admin_approved').slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className="bg-brand-50 p-2 rounded-xl text-brand-600 flex flex-col items-center justify-center min-w-[48px]">
                  <span className="text-[9px] font-bold uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-extrabold leading-none">{new Date(event.event_date).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-surface-800 text-[13px] truncate">{event.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-surface-400 shrink-0" />
                    <p className="text-[11px] text-surface-400 truncate">{event.venue}</p>
                  </div>
                </div>
              </div>
            ))}
            {recentEvents.filter(e => e.status === 'approved' || e.status === 'admin_approved').length === 0 && (
              <div className="empty-state py-12">
                <CalendarCheck className="empty-state-icon" />
                <p className="empty-state-title">No upcoming events</p>
                <p className="empty-state-desc">Approved events will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

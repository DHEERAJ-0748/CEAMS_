import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  Loader2,
  CalendarDays
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

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="card flex items-center gap-4 relative overflow-hidden group">
      <div className={`p-4 rounded-xl ${colorClass} transition-transform group-hover:scale-110 duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-surface-500">{title}</p>
        <h3 className="text-2xl font-bold text-surface-900">{value}</h3>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full py-20">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-brand-900 text-white rounded-2xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-50"></div>
        <div className="z-10">
          <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
          <p className="text-brand-200 max-w-xl">
            Monitor institutional event flow, manage facilities, and oversee club activities from one central dashboard.
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Events This Semester" 
          value={data?.totalEvents || 0} 
          icon={CalendarCheck} 
          colorClass="bg-brand-50 text-brand-600" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={data?.pendingApprovals || 0} 
          icon={Clock} 
          colorClass="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="Venues Booked Today" 
          value={data?.bookedVenuesToday || 0} 
          icon={MapPin} 
          colorClass="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Active Clubs" 
          value={data?.activeClubs || 0} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Event Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-surface-900">Recent Event Requests</h3>
            <Link to="/admin/events" className="text-brand-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:bg-surface-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold">
                      {event.users?.club_name?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 text-sm">{event.title}</p>
                      <p className="text-xs text-surface-500">{event.users?.club_name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    event.status.includes('pending') ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {event.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-surface-500 py-10">No recent requests found.</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-surface-900">Upcoming Events</h3>
            <Link to="/admin/calendar" className="text-brand-600 text-sm font-semibold hover:underline flex items-center gap-1">
              Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentEvents.filter(e => e.status === 'approved').slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-surface-100">
                <div className="bg-brand-50 p-2 rounded-lg text-brand-700 flex flex-col items-center justify-center min-w-[50px]">
                  <span className="text-[10px] font-bold uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-bold">{new Date(event.event_date).getDate()}</span>
                </div>
                <div>
                  <p className="font-bold text-surface-900 text-sm">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-surface-400" />
                    <p className="text-xs text-surface-500 truncate">{event.venue}</p>
                  </div>
                </div>
              </div>
            ))}
            {recentEvents.filter(e => e.status === 'approved').length === 0 && (
              <p className="text-center text-surface-500 py-10">No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

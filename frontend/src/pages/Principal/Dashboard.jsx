import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CalendarCheck, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Loader2,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          axios.get('/api/principal/stats'),
          axios.get('/api/principal/events')
        ]);
        setData(statsRes.data);
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
    { title: 'Total Events', value: data?.totalEvents || 0, icon: CalendarCheck, bg: 'bg-brand-50', text: 'text-brand-600' },
    { title: 'Pending Final Approvals', value: data?.pendingApprovals || 0, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
    { title: 'Total Budget Approved', value: `$${data?.totalBudgetApproved?.toLocaleString() || 0}`, icon: DollarSign, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { title: 'Upcoming Major Events', value: data?.upcomingMajorEvents || 0, icon: Sparkles, bg: 'bg-purple-50', text: 'text-purple-600' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading principal insights...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white rounded-2xl p-8 lg:p-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-brand-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/10">
              <TrendingUp className="w-3.5 h-3.5" />
              Institutional Overview
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-white">Welcome back, Principal</h1>
            <p className="text-brand-200/80 max-w-lg text-sm leading-relaxed">
              Review institutional event flow, manage final authorizations, and oversee budget distribution across all campus activities.
            </p>
          </div>
          <Link to="/principal/final-approvals" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 border-none font-semibold px-6 shadow-elevated shrink-0">
            Authorizations
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
                <p className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-xl font-extrabold text-surface-900 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recently Approved */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-surface-900">Recently Authorized</h3>
            <Link to="/principal/final-approvals" className="text-brand-600 text-xs font-semibold hover:text-brand-700 flex items-center gap-1 transition-colors">
              View catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.filter(e => e.status === 'principal_approved').length > 0 ? (
              recentEvents.filter(e => e.status === 'principal_approved').map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-surface-800 text-[13px] truncate">{event.title}</p>
                      <p className="text-[11px] text-surface-400 truncate">{event.users?.club_name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                     <p className="text-[11px] font-bold text-surface-900">${event.budget}</p>
                     <p className="text-[10px] text-surface-400">{new Date(event.event_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-surface-400">
                 <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                 <p className="text-sm">No recently authorized events.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Major Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-surface-900">Upcoming Events</h3>
            <Link to="/principal/calendar" className="text-brand-600 text-xs font-semibold hover:text-brand-700 flex items-center gap-1 transition-colors">
              Academic Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.filter(e => e.status === 'principal_approved' || e.status === 'approved').slice(0, 5).map((event) => (
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
            {recentEvents.filter(e => e.status === 'principal_approved' || e.status === 'approved').length === 0 && (
              <div className="py-10 text-center text-surface-400">
                <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No scheduled events found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  CalendarDays, 
  MapPin, 
  BarChart3, 
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pending } = await axios.get('/api/faculty/pending-events');
        setPendingCount(pending.length);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const modules = [
    { to: '/faculty/pending-events', icon: Clock, label: 'Proposals', desc: 'Review and recommend club events.', color: 'amber' },
    { to: '/faculty/calendar', icon: CalendarDays, label: 'Calendar', desc: 'View academic schedule and blocked dates.', color: 'brand' },
    { to: '/faculty/venues', icon: MapPin, label: 'Venues', desc: 'Check space availability across campus.', color: 'emerald' },
    { to: '/faculty/statistics', icon: BarChart3, label: 'Analytics', desc: 'Visual reports on event distributions.', color: 'blue' },
  ];

  const colorMap = {
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white rounded-2xl p-8 lg:p-10 relative overflow-hidden">
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
              Faculty Portal
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Greetings, {user?.name}</h1>
            <p className="text-brand-200/80 max-w-lg text-sm leading-relaxed">
              You have <span className="font-bold text-white">{pendingCount} pending proposals</span> requiring your expert review today.
            </p>
          </div>
          <Link to="/faculty/pending-events" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 border-none font-semibold px-6 shadow-elevated shrink-0">
            Start Reviews
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-[3px] border-l-amber-500">
          <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Queue</p>
          <h3 className="text-3xl font-extrabold text-surface-900 tracking-tight">{pendingCount}</h3>
          <p className="text-xs text-surface-400 mt-1">Pending student requests</p>
        </div>
        <div className="card border-l-[3px] border-l-emerald-500">
          <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Reviewed</p>
          <h3 className="text-3xl font-extrabold text-surface-900 tracking-tight">—</h3>
          <p className="text-xs text-surface-400 mt-1">Total proposals processed</p>
        </div>
        <div className="card border-l-[3px] border-l-blue-500">
          <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Activity</p>
          <h3 className="text-3xl font-extrabold text-surface-900 tracking-tight">—</h3>
          <p className="text-xs text-surface-400 mt-1">Events this month</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-surface-900 mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod) => {
            const c = colorMap[mod.color];
            return (
              <Link key={mod.label} to={mod.to} className="card-hover flex flex-col group">
                <div className={`p-3 rounded-xl ${c.bg} ${c.text} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <mod.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-surface-900 text-sm">{mod.label}</h3>
                <p className="text-surface-400 text-xs mt-1 mb-4">{mod.desc}</p>
                <div className="mt-auto flex items-center text-brand-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  MapPin, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Loader2,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pending } = await axios.get('/api/faculty/pending-events');
        setPendingCount(pending.length);
        // Using a basic stat block for faculty
        setStats({
          totalReviewed: 12, // Mock for now or fetch if available
          upcomingEvents: 5,
          activeVenues: 8
        });
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const QuickAction = ({ to, icon: Icon, label, desc, colorClass }) => (
    <Link to={to} className="card-hover flex flex-col group p-6">
      <div className={`p-4 rounded-xl ${colorClass} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-surface-900 text-lg">{label}</h3>
      <p className="text-surface-500 text-sm mt-1 mb-4">{desc}</p>
      <div className="mt-auto flex items-center text-brand-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
        Explore <ArrowRight className="ml-1 w-4 h-4" />
      </div>
    </Link>
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-brand-900 text-white rounded-2xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-50"></div>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-brand-800 text-brand-100 text-[10px] font-bold px-3 py-1 rounded-full border border-brand-700 uppercase tracking-widest">Faculty Portal</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Greetings, {user?.name}</h1>
          <p className="text-brand-200 max-w-xl">
            You have <span className="font-bold text-white underline decoration-brand-400 decoration-2">{pendingCount} pending proposals</span> requiring your expert review today.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <Link to="/faculty/pending-events" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 border-none font-bold px-8 shadow-xl">
            Start Reviews
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-amber-500">
           <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Queue</p>
           <h3 className="text-3xl font-black text-surface-900">{pendingCount}</h3>
           <p className="text-xs text-surface-500 mt-1">Pending student requests</p>
        </div>
        <div className="card border-l-4 border-l-emerald-500">
           <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Reviewed</p>
           <h3 className="text-3xl font-black text-surface-900">{stats?.totalReviewed}</h3>
           <p className="text-xs text-surface-500 mt-1">Total proposals processed</p>
        </div>
        <div className="card border-l-4 border-l-blue-500">
           <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Activity</p>
           <h3 className="text-3xl font-black text-surface-900">{stats?.upcomingEvents}</h3>
           <p className="text-xs text-surface-500 mt-1">Events this month</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 mb-6">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickAction 
            to="/faculty/pending-events" 
            icon={Clock} 
            label="Proposals" 
            desc="Review and recommend club events." 
            colorClass="bg-amber-50 text-amber-600" 
          />
          <QuickAction 
            to="/faculty/calendar" 
            icon={CalendarDays} 
            label="Calendar" 
            desc="View academic schedule and blocked dates." 
            colorClass="bg-brand-50 text-brand-600" 
          />
          <QuickAction 
            to="/faculty/venues" 
            icon={MapPin} 
            label="Venues" 
            desc="Check space availability across campus." 
            colorClass="bg-emerald-50 text-emerald-600" 
          />
          <QuickAction 
            to="/faculty/statistics" 
            icon={BarChart3} 
            label="Analytics" 
            desc="Visual reports on event distributions." 
            colorClass="bg-blue-50 text-blue-600" 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

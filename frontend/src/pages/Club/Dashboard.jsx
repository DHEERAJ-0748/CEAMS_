import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CalendarPlus, List, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Section */}
      <div className="bg-brand-900 text-white rounded-2xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-50"></div>
        <div className="z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.club_name}!</h1>
          <p className="text-brand-200 max-w-xl">
            This is your central hub for managing club events. Track proposals, create new ones, and monitor your approval statuses.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <Link to="/club/create-event" className="inline-flex items-center gap-2 bg-white text-brand-900 px-6 py-3 rounded-lg font-semibold hover:bg-surface-100 transition-colors shadow-sm">
            <CalendarPlus className="w-5 h-5" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Stats / Quick Links */}
      <h2 className="text-xl font-bold text-surface-900 mt-8 mb-4">Quick Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/club/my-events" className="card-hover flex flex-col group relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500"></div>
          <div className="p-3 bg-brand-50 rounded-lg text-brand-600 mb-4 w-fit group-hover:bg-brand-100 transition-colors">
            <List className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-surface-900 text-lg">All Events</h3>
          <p className="text-surface-500 text-sm mb-4">View your complete proposal history.</p>
          <div className="mt-auto flex items-center text-brand-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View catalog <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </Link>

        <Link to="/club/my-events" className="card-hover flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600 mb-4 w-fit group-hover:bg-amber-100 transition-colors">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-surface-900 text-lg">Pending</h3>
          <p className="text-surface-500 text-sm mb-4">Track proposals waiting for review.</p>
          <div className="mt-auto flex items-center text-amber-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            Check status <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </Link>

        <Link to="/club/my-events" className="card-hover flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 mb-4 w-fit group-hover:bg-emerald-100 transition-colors">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-surface-900 text-lg">Approved</h3>
          <p className="text-surface-500 text-sm mb-4">Access details for authorized events.</p>
          <div className="mt-auto flex items-center text-emerald-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View approved <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

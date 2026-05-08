import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-brand-900 text-white rounded-2xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-800 rounded-full blur-[60px] -z-10 -translate-x-1/2 translate-y-1/2 mix-blend-screen opacity-50"></div>
        
        <div className="z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-brand-800 text-brand-100 text-xs font-bold px-3 py-1 rounded-full border border-brand-700">Faculty Portal</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-brand-200 max-w-xl">
            Review and manage incoming club event proposals to ensure they align with institutional guidelines before administrative approval.
          </p>
        </div>
        <div className="z-10 shrink-0 opacity-20 hidden md:block">
           <ShieldAlert className="w-32 h-32" />
        </div>
      </div>

      {/* Action Cards */}
      <h2 className="text-xl font-bold text-surface-900 mt-8 mb-4">Your Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/faculty/pending-events" className="card-hover flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-bold text-surface-900 text-xl mb-2">Pending Reviews</h3>
          <p className="text-surface-500 mb-6">Review new event proposals submitted by clubs. Approve or request changes.</p>
          <div className="mt-auto flex items-center text-amber-600 font-medium group-hover:translate-x-1 transition-transform">
            Start reviewing <ArrowRight className="ml-1 w-5 h-5" />
          </div>
        </Link>

        {/* Placeholder for future functionality */}
        <div className="card flex flex-col opacity-60 cursor-not-allowed">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-surface-300"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-100 rounded-lg text-surface-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-surface-500 bg-surface-200 px-2 py-1 rounded">Coming Soon</span>
          </div>
          <h3 className="font-bold text-surface-900 text-xl mb-2">Review History</h3>
          <p className="text-surface-500 mb-6">Access an archive of events you have previously approved or rejected.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

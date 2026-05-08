import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CalendarCheck, ArrowRight, BarChart3, Users, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-brand-900 text-white rounded-2xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-50"></div>
        
        <div className="z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-brand-800 text-brand-100 text-xs font-bold px-3 py-1 rounded-full border border-brand-700">Administration Portal</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">System Overview</h1>
          <p className="text-brand-200 max-w-xl">
            Welcome, {user?.name}. Provide final authorization for faculty-approved events and oversee all institutional activities.
          </p>
        </div>
        <div className="z-10 shrink-0 opacity-20 hidden md:block">
           <ShieldCheck className="w-32 h-32" />
        </div>
      </div>

      {/* Analytics Preview (Placeholder Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card flex items-center gap-4">
            <div className="p-4 bg-brand-50 rounded-xl text-brand-600">
               <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-medium text-surface-500">Total Events This Year</p>
               <h3 className="text-2xl font-bold text-surface-900">142</h3>
            </div>
         </div>
         <div className="card flex items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-medium text-surface-500">Active Clubs</p>
               <h3 className="text-2xl font-bold text-surface-900">28</h3>
            </div>
         </div>
         <div className="card flex items-center gap-4">
            <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
               <DollarSign className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-medium text-surface-500">Pending Budget Approvals</p>
               <h3 className="text-2xl font-bold text-surface-900">$12,450</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/events" className="card-hover flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500"></div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-brand-50 rounded-lg text-brand-600 group-hover:bg-brand-100 transition-colors">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Action Required</span>
          </div>
          <h3 className="font-bold text-surface-900 text-xl mb-2">Final Approvals</h3>
          <p className="text-surface-500 mb-6">Review events that have passed faculty checks and require administrative sign-off.</p>
          <div className="mt-auto flex items-center text-brand-600 font-medium group-hover:translate-x-1 transition-transform">
            Go to approval queue <ArrowRight className="ml-1 w-5 h-5" />
          </div>
        </Link>

        <Link to="/admin/events" className="card-hover flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 mb-4 w-fit group-hover:bg-emerald-100 transition-colors">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-surface-900 text-xl mb-2">All Events Master</h3>
          <p className="text-surface-500 mb-6">System-wide event repository and status tracking.</p>
          <div className="mt-auto flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
            View directory <ArrowRight className="ml-1 w-5 h-5" />
          </div>
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;

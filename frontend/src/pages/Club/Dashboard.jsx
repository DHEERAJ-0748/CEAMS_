import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarPlus, 
  List, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  XCircle,
  AlertCircle,
  Activity,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const { data } = await axios.get('/api/events/my-events');
        setRecentEvents(data.slice(0, 3)); // Only show top 3 for monitoring
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentEvents();
  }, []);

  const getWorkflowStages = (status) => {
    const s = status.toLowerCase();
    const stages = [
      { name: 'Submission', status: 'completed', icon: CheckCircle, color: 'text-emerald-500' },
      { name: 'Faculty Review', status: 'pending', icon: Clock, color: 'text-amber-500' },
      { name: 'Admin Approval', status: 'pending', icon: Clock, color: 'text-amber-500' }
    ];

    if (s === 'faculty_pending') {
      stages[1].status = 'in-progress';
    } else if (s === 'faculty_approved' || s === 'admin_pending') {
      stages[1].status = 'completed';
      stages[1].icon = CheckCircle;
      stages[1].color = 'text-emerald-500';
      stages[2].status = 'in-progress';
    } else if (s === 'approved' || s === 'admin_approved') {
      stages[1].status = 'completed';
      stages[1].color = 'text-emerald-500';
      stages[1].icon = CheckCircle;
      stages[2].status = 'completed';
      stages[2].color = 'text-emerald-500';
      stages[2].icon = CheckCircle;
    } else if (s.includes('rejected')) {
      if (s.includes('faculty')) {
        stages[1].status = 'failed';
        stages[1].icon = XCircle;
        stages[1].color = 'text-red-500';
        stages[2].status = 'cancelled';
        stages[2].icon = AlertCircle;
        stages[2].color = 'text-surface-300';
      } else {
        stages[1].status = 'completed';
        stages[1].icon = CheckCircle;
        stages[1].color = 'text-emerald-500';
        stages[2].status = 'failed';
        stages[2].icon = XCircle;
        stages[2].color = 'text-red-500';
      }
    }

    return stages;
  };

  const quickLinks = [
    { to: '/club/my-events', icon: List, title: 'All Events', desc: 'View your complete proposal history.', color: 'brand', link: 'View catalog' },
    { to: '/club/my-events', icon: Clock, title: 'Pending', desc: 'Track proposals waiting for review.', color: 'amber', link: 'Check status' },
    { to: '/club/my-events', icon: CheckCircle, title: 'Approved', desc: 'Access details for authorized events.', color: 'emerald', link: 'View approved' },
  ];

  const colorMap = {
    brand: { border: 'border-l-brand-500', bg: 'bg-brand-50', text: 'text-brand-600', hover: 'group-hover:bg-brand-100', linkText: 'text-brand-600' },
    amber: { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', hover: 'group-hover:bg-amber-100', linkText: 'text-amber-600' },
    emerald: { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-100', linkText: 'text-emerald-600' },
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
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-brand-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Club Portal
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
              Welcome back, {user?.club_name}!
            </h1>
            <p className="text-brand-200/80 max-w-lg text-sm leading-relaxed">
              Your central hub for managing club events. Track proposals, create new ones, and monitor your approval statuses.
            </p>
          </div>
          <Link 
            to="/club/create-event" 
            className="inline-flex items-center gap-2 bg-white text-brand-900 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-all shadow-elevated shrink-0 text-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-bold text-surface-900 mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((item) => {
            const c = colorMap[item.color];
            return (
              <Link key={item.title} to={item.to} className={`card-hover flex flex-col group relative overflow-hidden border-l-[3px] ${c.border}`}>
                <div className={`p-2.5 rounded-xl ${c.bg} ${c.text} mb-4 w-fit ${c.hover} transition-colors`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-surface-900 text-base">{item.title}</h3>
                <p className="text-surface-500 text-sm mb-4 mt-1">{item.desc}</p>
                <div className={`mt-auto flex items-center ${c.linkText} font-semibold text-xs group-hover:translate-x-1 transition-transform`}>
                  {item.link} <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Approval Monitoring */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-surface-900">Approval Monitoring</h2>
          <Link to="/club/my-events" className="text-brand-600 text-xs font-semibold hover:text-brand-700 flex items-center gap-1">
            View all proposals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {recentEvents.length > 0 ? (
          <div className="space-y-4">
            {recentEvents.map((event) => {
              const stages = getWorkflowStages(event.status);
              return (
                <div key={event.id} className="card p-5 group">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="max-w-xs">
                      <h3 className="font-bold text-surface-900 text-sm mb-1 group-hover:text-brand-600 transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-3 text-[11px] text-surface-400 font-medium">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.event_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 uppercase tracking-wider text-brand-600/80"><Activity className="w-3 h-3" /> {event.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-between relative max-w-lg px-2">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-100 -translate-y-1/2 -z-10" />
                      {stages.map((stage, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 bg-white px-2">
                          <div className={`p-1.5 rounded-full border-2 ${
                            stage.status === 'completed' ? 'border-emerald-500 bg-emerald-50' : 
                            stage.status === 'in-progress' ? 'border-amber-500 bg-amber-50' :
                            stage.status === 'failed' ? 'border-red-500 bg-red-50' : 'border-surface-200 bg-white'
                          }`}>
                            <stage.icon className={`w-3.5 h-3.5 ${stage.color}`} />
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-tight ${
                            stage.status === 'completed' ? 'text-emerald-700' :
                            stage.status === 'in-progress' ? 'text-amber-700' :
                            stage.status === 'failed' ? 'text-red-700' : 'text-surface-400'
                          }`}>{stage.name}</span>
                        </div>
                      ))}
                    </div>

                    {event.rejection_reason && (
                      <div className="lg:w-48 shrink-0 flex items-start gap-2 p-2.5 bg-red-50 rounded-xl border border-red-100">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-700 leading-tight">
                          <span className="font-bold">Rejected:</span> {event.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card py-12 text-center text-surface-400">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No recent proposals to track.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

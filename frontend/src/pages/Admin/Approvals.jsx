import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Loader2,
  Activity,
  AlertCircle
} from 'lucide-react';

const Approvals = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/admin/events');
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getWorkflowStages = (event) => {
    const status = event.status;
    const stages = [
      { name: 'Submission', status: 'completed', icon: CheckCircle, color: 'text-emerald-500' },
      { name: 'Faculty Review', status: 'pending', icon: Clock, color: 'text-amber-500' },
      { name: 'Admin Approval', status: 'pending', icon: Clock, color: 'text-amber-500' }
    ];

    if (status === 'submitted') {
      stages[1].status = 'pending';
    } else if (status === 'faculty_pending') {
      stages[1].status = 'in-progress';
      stages[1].icon = Clock;
    } else if (status === 'faculty_approved' || status === 'admin_pending') {
      stages[1].status = 'completed';
      stages[1].icon = CheckCircle;
      stages[1].color = 'text-emerald-500';
      stages[2].status = 'in-progress';
    } else if (status === 'approved' || status === 'admin_approved') {
      stages[1].status = 'completed';
      stages[1].color = 'text-emerald-500';
      stages[1].icon = CheckCircle;
      stages[2].status = 'completed';
      stages[2].color = 'text-emerald-500';
      stages[2].icon = CheckCircle;
    } else if (status.includes('rejected')) {
      if (status.includes('faculty')) {
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Approvals Monitoring</h1>
        <p className="text-surface-500 mt-1">Track the progress of all active event proposals through the institutional workflow.</p>
      </div>

      <div className="space-y-6">
        {events.map((event) => {
          const stages = getWorkflowStages(event);
          return (
            <div key={event.id} className="card p-6 border-l-4 border-l-brand-600">
              <div className="flex flex-col xl:flex-row justify-between gap-6">
                {/* Event Info */}
                <div className="max-w-md">
                  <h3 className="text-xl font-bold text-surface-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-surface-500 mb-4">Proposed by <span className="font-semibold text-brand-700">{event.users?.club_name}</span></p>
                  <div className="flex items-center gap-4 text-xs font-medium text-surface-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.event_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Stage: {event.status.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Workflow Visualization */}
                <div className="flex-1 flex items-center justify-between relative max-w-2xl px-4">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-100 -translate-y-1/2 -z-10"></div>
                  
                  {stages.map((stage, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`p-2 rounded-full border-2 ${
                        stage.status === 'completed' ? 'border-emerald-500 bg-emerald-50' : 
                        stage.status === 'in-progress' ? 'border-amber-500 bg-amber-50' :
                        stage.status === 'failed' ? 'border-red-500 bg-red-50' : 'border-surface-200 bg-white'
                      }`}>
                        <stage.icon className={`w-5 h-5 ${stage.color}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        stage.status === 'completed' ? 'text-emerald-700' :
                        stage.status === 'in-progress' ? 'text-amber-700' :
                        stage.status === 'failed' ? 'text-red-700' : 'text-surface-400'
                      }`}>{stage.name}</span>
                    </div>
                  ))}
                </div>

                {/* Status Detail */}
                <div className="xl:text-right shrink-0">
                   <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Current Action</p>
                   <p className="text-sm font-bold text-surface-900">
                     {event.status === 'approved' ? 'Authorization Granted' : 
                      event.status.includes('pending') ? 'Awaiting Review' : 
                      event.status.includes('rejected') ? 'Request Declined' : 'Processing'}
                   </p>
                   <p className="text-xs text-surface-500 mt-1">
                     Last updated: {new Date(event.updated_at || event.created_at).toLocaleTimeString()}
                   </p>
                </div>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <div className="card py-20 text-center text-surface-500">
             <Activity className="w-12 h-12 mx-auto mb-4 opacity-10" />
             <p>No active approval workflows found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;

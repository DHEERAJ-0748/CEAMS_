import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  DollarSign, 
  Clock, 
  MapPin, 
  Loader2, 
  ShieldCheck,
  Inbox
} from 'lucide-react';

const PendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeModal, setActiveModal] = useState(null); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/faculty/pending-events');
      setEvents(data);
    } catch (err) {
      setError('Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAction = async () => {
    if (!selectedEvent) return;
    setActionLoading(true);
    try {
      if (activeModal === 'approve') {
        await axios.put(`/api/faculty/${selectedEvent.id}/approve`, { remarks });
      } else if (activeModal === 'reject') {
        await axios.put(`/api/faculty/${selectedEvent.id}/reject`, { reason: remarks });
      }
      setActiveModal(null);
      setSelectedEvent(null);
      setRemarks('');
      fetchEvents();
    } catch (err) {
      alert('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading requests...</p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Review Queue</h1>
          <p className="text-surface-400 text-sm mt-0.5">Review club proposals and provide recommendations.</p>
        </div>
        {events.length > 0 && (
          <div className="badge-pending px-3 py-1.5 text-xs shrink-0">
            {events.length} pending review{events.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="empty-state-title">Queue is clear</p>
            <p className="empty-state-desc">All student event proposals have been processed.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="card p-0 overflow-hidden flex flex-col xl:flex-row hover:shadow-card-hover transition-all duration-300">
              <div className="flex-1 p-5 lg:p-6 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-info">{event.category}</span>
                  <span className="text-xs font-semibold text-brand-600">
                    {event.users?.club_name}
                  </span>
                </div>
                
                <h3 className="text-lg font-extrabold text-surface-900 leading-tight">{event.title}</h3>
                
                <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-1.5">Proposal Abstract</p>
                  <p className="text-sm text-surface-600 leading-relaxed line-clamp-3">{event.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Clock, label: 'Date', value: new Date(event.event_date).toLocaleDateString() },
                    { icon: MapPin, label: 'Venue', value: event.venue },
                    { icon: DollarSign, label: 'Budget', value: `$${event.budget}` },
                    { icon: Users, label: 'Expected', value: `${event.expected_participants}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-surface-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-surface-400 uppercase">{item.label}</p>
                        <span className="text-xs font-semibold text-surface-700 truncate block">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-50 border-t xl:border-t-0 xl:border-l border-surface-100 p-5 lg:p-6 flex flex-col justify-center items-center gap-3 shrink-0 xl:w-56">
                <ShieldCheck className="w-7 h-7 text-brand-400 mb-1" />
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider text-center mb-2">Faculty Review</p>
                <button 
                  onClick={() => { setSelectedEvent(event); setActiveModal('approve'); }}
                  className="btn-success w-full flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Recommend
                </button>
                <button 
                  onClick={() => { setSelectedEvent(event); setActiveModal('reject'); }}
                  className="btn-danger w-full flex items-center justify-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-elevated animate-scale-in">
            <h2 className="text-lg font-extrabold text-surface-900 mb-1 capitalize">{activeModal} Proposal</h2>
            <p className="text-sm text-surface-400 mb-5">Reviewing: {selectedEvent?.title}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-surface-700 mb-2">
                  {activeModal === 'approve' ? 'Faculty Remarks (Optional)' : 'Rejection Reason'}
                </label>
                <textarea 
                  className="input-field min-h-[100px] resize-none" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={activeModal === 'approve' ? 'Looks good, aligns with curriculum...' : 'Insufficient planning for safety...'}
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActiveModal(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button 
                  onClick={handleAction} 
                  disabled={actionLoading || (activeModal === 'reject' && !remarks)}
                  className={`flex-1 text-sm flex items-center justify-center gap-2 ${
                    activeModal === 'reject' ? 'btn-danger' : 'btn-success'
                  }`}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingEvents;

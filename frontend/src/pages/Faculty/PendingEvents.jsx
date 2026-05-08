import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  DollarSign, 
  Clock, 
  MapPin, 
  Building, 
  Loader2, 
  ArrowRight,
  ShieldAlert,
  MessageSquare
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="animate-fade-in py-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Pending Review Queue</h1>
          <p className="text-surface-500 mt-1">Review club proposals and provide faculty recommendations.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold text-sm shrink-0 border border-amber-200">
          {events.length} Action{events.length !== 1 ? 's' : ''} Needed
        </div>
      </div>

      {events.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-surface-900">Queue is Clear</h3>
          <p className="text-surface-500 mt-2">All student event proposals have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card p-0 overflow-hidden border-l-4 border-l-amber-500 flex flex-col xl:flex-row">
              <div className="flex-1 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-surface-100 text-surface-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {event.category}
                  </span>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                    {event.users?.club_name}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-surface-900 mb-4">{event.title}</h3>
                
                <div className="bg-surface-50 rounded-xl p-5 mb-6 border border-surface-200">
                  <p className="text-surface-700 text-sm leading-relaxed">
                    <span className="font-bold block mb-1 uppercase text-[10px] text-surface-400">Proposal Abstract:</span>
                    {event.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center text-surface-700 gap-3">
                    <Clock className="w-5 h-5 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-surface-400 uppercase">Event Date</p>
                      <span className="text-sm font-bold">{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-surface-700 gap-3">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-surface-400 uppercase">Venue</p>
                      <span className="text-sm font-bold truncate">{event.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-surface-700 gap-3">
                    <DollarSign className="w-5 h-5 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-surface-400 uppercase">Budget</p>
                      <span className="text-sm font-bold">${event.budget}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-surface-700 gap-3">
                    <Users className="w-5 h-5 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-surface-400 uppercase">Expected</p>
                      <span className="text-sm font-bold">{event.expected_participants} px</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-50 border-t xl:border-t-0 xl:border-l border-surface-200 p-8 flex flex-col justify-center items-center gap-3 shrink-0 xl:w-72">
                 <ShieldAlert className="w-8 h-8 text-amber-500 mb-2" />
                 <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest text-center mb-4">Faculty Review</p>
                <button 
                  onClick={() => { setSelectedEvent(event); setActiveModal('approve'); }}
                  className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Recommended
                </button>
                <button 
                  onClick={() => { setSelectedEvent(event); setActiveModal('reject'); }}
                  className="btn-primary w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
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
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-surface-900 mb-2 capitalize">{activeModal} Proposal</h2>
            <p className="text-sm text-surface-500 mb-6">Reviewing: {selectedEvent?.title}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">
                  {activeModal === 'approve' ? 'Faculty Remarks (Optional)' : 'Rejection Reason (Required)'}
                </label>
                <textarea 
                  className="input-field min-h-[120px]" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={activeModal === 'approve' ? 'Looks good, aligns with curriculum...' : 'Insufficient planning for safety...'}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setActiveModal(null)} className="btn-secondary flex-1">Cancel</button>
                <button 
                  onClick={handleAction} 
                  disabled={actionLoading || (activeModal === 'reject' && !remarks)}
                  className={`btn-primary flex-1 flex items-center justify-center gap-2 ${activeModal === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
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

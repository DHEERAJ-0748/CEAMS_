import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Users, DollarSign, Clock, MapPin, Building, Loader2, ArrowRight } from 'lucide-react';

const PendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'approve' | 'reject' | null
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

  const openModal = (type, event) => {
    setActiveModal(type);
    setSelectedEvent(event);
    setRemarks('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedEvent(null);
    setRemarks('');
  };

  const handleAction = async () => {
    if (!selectedEvent) return;
    setActionLoading(true);
    try {
      if (activeModal === 'approve') {
        await axios.put(`/api/faculty/${selectedEvent.id}/approve`, { remarks });
      } else if (activeModal === 'reject') {
        await axios.put(`/api/faculty/${selectedEvent.id}/reject`, { reason: remarks });
      }
      closeModal();
      fetchEvents(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="animate-fade-in py-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Pending Approvals</h1>
          <p className="text-surface-500 mt-1">Review new event proposals from student clubs.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold text-sm shrink-0">
          {events.length} Action{events.length !== 1 ? 's' : ''} Required
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

      {events.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-surface-900">All caught up!</h3>
          <p className="text-surface-500 mt-1">There are no pending events to review at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="card p-0 overflow-hidden flex flex-col md:flex-row border-l-4 border-l-amber-500 hover:shadow-card-hover transition-shadow">
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-surface-100 text-surface-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-surface-900 mb-2">{event.title}</h3>
                
                <div className="flex items-center gap-2 mb-6">
                  <Building className="w-4 h-4 text-surface-400" />
                  <p className="text-sm text-surface-600">
                    Organized by <span className="font-semibold text-brand-700">{event.users?.club_name}</span>
                  </p>
                </div>
                
                <div className="bg-surface-50 rounded-lg p-4 mb-6 border border-surface-200">
                  <p className="text-surface-700 text-sm">
                    <span className="font-bold block mb-1">Proposal Description:</span>
                    {event.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-white border border-surface-100 p-4 rounded-lg">
                  <div className="flex items-center text-surface-700 gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-surface-700 gap-2">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span className="font-medium truncate" title={event.venue}>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-surface-700 gap-2">
                    <DollarSign className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">${event.budget}</span>
                  </div>
                  <div className="flex items-center text-surface-700 gap-2">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">{event.expected_participants}</span>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="bg-surface-50 border-t md:border-t-0 md:border-l border-surface-200 p-6 flex flex-row md:flex-col justify-center items-center gap-4 shrink-0 md:w-56">
                <button 
                  onClick={() => openModal('approve', event)}
                  className="btn-success w-full flex items-center justify-center gap-2 py-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
                <button 
                  onClick={() => openModal('reject', event)}
                  className="btn-danger w-full flex items-center justify-center gap-2 py-3"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 animate-fade-in">
          <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
          
          <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all sm:max-w-lg w-full animate-slide-up border border-surface-200">
            <div className={`h-2 w-full ${activeModal === 'approve' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            
            <div className="px-6 py-8">
              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${activeModal === 'approve' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {activeModal === 'approve' ? (
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-xl font-bold text-surface-900 mb-2">
                    {activeModal === 'approve' ? 'Approve Proposal' : 'Reject Proposal'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-surface-500 mb-4">
                      {activeModal === 'approve' 
                        ? `You are about to approve "${selectedEvent?.title}". It will be forwarded to the administration. Add any notes below.`
                        : `You are about to reject "${selectedEvent?.title}". A reason is required so the club can understand why.`}
                    </p>
                    
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      {activeModal === 'approve' ? 'Remarks (Optional)' : 'Rejection Reason (Required)'}
                    </label>
                    <textarea
                      className="input-field"
                      rows="4"
                      placeholder={activeModal === 'approve' ? 'Looks good, approved for budget review...' : 'The budget requested is too high...'}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      required={activeModal === 'reject'}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-surface-200">
               <button
                type="button"
                onClick={closeModal}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || (activeModal === 'reject' && !remarks.trim())}
                className={`w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  activeModal === 'approve' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:opacity-50' 
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50'
                }`}
                onClick={handleAction}
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Confirm ${activeModal === 'approve' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingEvents;

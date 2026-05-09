import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Eye, 
  Loader2,
  Calendar,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

const FinalApprovals = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'approve', 'reject', 'clarify'
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/principal/events');
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleAction = async () => {
    if (!selectedEvent) return;
    setActionLoading(true);
    try {
      let endpoint = '';
      let payload = {};
      let updatedStatus = '';

      if (actionModal === 'approve') {
        endpoint = `/api/principal/${selectedEvent.id}/approve`;
        payload = { remarks };
        updatedStatus = 'principal_approved';
      } else if (actionModal === 'reject') {
        endpoint = `/api/principal/${selectedEvent.id}/reject`;
        payload = { reason: remarks };
        updatedStatus = 'principal_rejected';
      } else if (actionModal === 'clarify') {
        endpoint = `/api/principal/${selectedEvent.id}/clarify`;
        payload = { message: remarks };
        updatedStatus = selectedEvent.status; // status doesn't change for clarification, just remarks
      }

      const { data: updatedEvent } = await axios.put(endpoint, payload);
      
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...updatedEvent } : e));
      setActionModal(null);
      setSelectedEvent(null);
      setRemarks('');
    } catch (err) {
      console.error('Action failed', err);
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.users?.club_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading authorizations...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Final Authorizations</h1>
          <p className="text-surface-400 text-sm mt-0.5">Review and grant final approval for institutionally approved events.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search proposals..." 
              className="input-field pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="table-container">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="table-header">Proposal Details</th>
              <th className="table-header text-center">Resources</th>
              <th className="table-header text-center">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-surface-50/50 transition-colors group">
                <td className="table-cell">
                   <div className="flex flex-col">
                      <span className="font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{event.title}</span>
                      <span className="text-[11px] text-surface-400 font-medium">by <span className="text-brand-600 font-semibold">{event.users?.club_name}</span></span>
                   </div>
                </td>
                <td className="table-cell">
                   <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-surface-900">
                         <DollarSign className="w-3 h-3 text-emerald-500" /> ${event.budget}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-surface-400">
                         <Calendar className="w-3 h-3" /> {new Date(event.event_date).toLocaleDateString()}
                      </div>
                   </div>
                </td>
                <td className="table-cell text-center">
                   <span className={`badge ${
                     event.status === 'principal_approved' ? 'badge-approved' : 
                     event.status === 'principal_rejected' ? 'badge-rejected' : 'badge-pending'
                   }`}>
                     {event.status.replace(/_/g, ' ')}
                   </span>
                </td>
                <td className="table-cell text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {event.status === 'principal_pending' && (
                        <>
                          <button 
                            onClick={() => { setSelectedEvent(event); setActionModal('approve'); }}
                            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedEvent(event); setActionModal('clarify'); }}
                            className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                            title="Clarify"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedEvent(event); setActionModal('reject'); }}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEvents.length === 0 && (
          <div className="py-20 text-center text-surface-400">
             <Filter className="w-12 h-12 mx-auto mb-4 opacity-10" />
             <p className="font-medium">No matching proposals found.</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className={`px-6 py-4 border-b border-surface-100 flex items-center gap-3 ${
              actionModal === 'approve' ? 'bg-emerald-50 text-emerald-700' :
              actionModal === 'reject' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {actionModal === 'approve' && <CheckCircle className="w-5 h-5" />}
              {actionModal === 'reject' && <XCircle className="w-5 h-5" />}
              {actionModal === 'clarify' && <HelpCircle className="w-5 h-5" />}
              <h3 className="font-bold">
                {actionModal === 'approve' ? 'Grant Final Approval' : 
                 actionModal === 'reject' ? 'Decline Proposal' : 'Request Clarification'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-50 p-3 rounded-xl border border-surface-100">
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Proposal</p>
                <p className="text-sm font-bold text-surface-900">{selectedEvent?.title}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-500 uppercase tracking-widest mb-2">
                  {actionModal === 'approve' ? 'Principal Remarks (Optional)' : 
                   actionModal === 'reject' ? 'Rejection Reason (Required)' : 'Clarification Message'}
                </label>
                <textarea 
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Type your message here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-surface-50 border-t border-surface-100 flex gap-3">
              <button 
                onClick={() => { setActionModal(null); setRemarks(''); }}
                className="btn-secondary flex-1 py-2"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                disabled={actionLoading || (actionModal !== 'approve' && !remarks)}
                className={`flex-1 py-2 font-bold text-white rounded-xl transition-all ${
                  actionModal === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' :
                  actionModal === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 
                  'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                } shadow-lg disabled:opacity-50`}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal (Selected Event) */}
      {selectedEvent && !actionModal && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-md animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
              <div className="p-8 overflow-y-auto scrollbar-thin flex-1">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <span className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em] mb-2 block">Proposal Details</span>
                       <h2 className="text-2xl font-extrabold text-surface-900 leading-tight">{selectedEvent.title}</h2>
                       <p className="text-surface-500 mt-1">Proposed by <span className="text-brand-700 font-semibold">{selectedEvent.users?.club_name}</span></p>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
                       <XCircle className="w-6 h-6 text-surface-300" />
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100">
                       <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Schedule</p>
                       <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-brand-500" />
                          <span className="font-bold text-surface-900">{new Date(selectedEvent.event_date).toLocaleDateString()}</span>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100">
                       <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Location</p>
                       <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-brand-500" />
                          <span className="font-bold text-surface-900">{selectedEvent.venue}</span>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100">
                       <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Financials</p>
                       <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-emerald-500" />
                          <span className="font-bold text-surface-900">${selectedEvent.budget}</span>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100">
                       <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Impact</p>
                       <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-brand-500" />
                          <span className="font-bold text-surface-900">{selectedEvent.expected_participants} attendees</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h4 className="text-xs font-bold text-surface-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-brand-500" /> Description
                       </h4>
                       <p className="text-sm text-surface-600 leading-relaxed bg-surface-50 p-5 rounded-2xl">
                          {selectedEvent.description}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-surface-100">
                       <div>
                          <h4 className="text-[11px] font-bold text-surface-400 uppercase mb-3">Admin Remarks</h4>
                          <p className="text-xs text-surface-700 italic">"{selectedEvent.admin_remarks || 'No remarks provided'}"</p>
                       </div>
                       <div>
                          <h4 className="text-[11px] font-bold text-surface-400 uppercase mb-3">Faculty Remarks</h4>
                          <p className="text-xs text-surface-700 italic">"{selectedEvent.faculty_remarks || 'No remarks provided'}"</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-surface-50 border-t border-surface-100 flex justify-end">
                 <button 
                   onClick={() => setSelectedEvent(null)}
                   className="btn-primary px-8"
                 >
                    Close Review
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinalApprovals;

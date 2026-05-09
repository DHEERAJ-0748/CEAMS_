import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Loader2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  AlignLeft,
  FileText,
  Info,
  X,
  Inbox
} from 'lucide-react';

const selectArrow = "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")";
const selectStyle = { backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.6rem auto' };

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.users?.club_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async () => {
    if (!selectedEvent) return;
    setActionLoading(true);
    try {
      let updatedStatus = '';
      if (actionModal === 'approve') {
        await axios.put(`/api/admin/${selectedEvent.id}/approve`, { remarks });
        updatedStatus = 'principal_pending';
      } else if (actionModal === 'reject') {
        await axios.put(`/api/admin/${selectedEvent.id}/reject`, { reason: remarks });
        updatedStatus = 'rejected';
      }
      
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, status: updatedStatus } : e));
      setActionModal(null);
      setSelectedEvent(null);
      setRemarks('');
      // Show success toast logic could go here if a toast library existed
    } catch (err) {
      console.error('Admin action error:', err);
      const msg = err.response?.data?.message || 'Action failed';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      'approved': 'badge-approved',
      'principal_approved': 'badge-approved',
      'principal_pending': 'badge-info',
      'faculty_approved': 'badge-pending',
      'rejected': 'badge-rejected',
      'admin_rejected': 'badge-rejected',
    };
    return (
      <span className={styles[status] || 'badge-info'}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading events...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Event Requests</h1>
          <p className="text-surface-400 text-sm mt-0.5">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="input-field pl-9 w-full sm:w-56 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none" />
            <select 
              className="input-field pl-9 appearance-none pr-10 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Statuses</option>
              <option value="faculty_approved">Review Pending</option>
              <option value="principal_pending">Sent to Principal</option>
              <option value="principal_approved">Authorized</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Cards */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-state-icon" />
          <p className="empty-state-title">No events found</p>
          <p className="empty-state-desc">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              onClick={() => { setSelectedEvent(event); setDetailsModal(true); }}
              className="card p-0 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-5">
                  {/* Info */}
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-info">{event.category}</span>
                      <StatusBadge status={event.status} />
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-surface-900 leading-tight group-hover:text-brand-700 transition-colors">{event.title}</h3>
                    <p className="text-sm text-surface-500 line-clamp-1">{event.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-100">
                      <div className="flex items-center gap-2 text-surface-500">
                        <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                        <span className="text-xs font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-surface-500">
                        <MapPin className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                        <span className="text-xs font-medium truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-surface-500">
                        <Users className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                        <span className="text-xs font-medium">{event.expected_participants}</span>
                      </div>
                      <div className="flex items-center gap-2 text-surface-500">
                        <DollarSign className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                        <span className="text-xs font-semibold text-surface-800">${event.budget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="lg:w-56 space-y-4 flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {event.users?.club_name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Organizer</p>
                        <p className="text-sm font-semibold text-surface-800 truncate">{event.users?.club_name}</p>
                      </div>
                    </div>

                    {event.status === 'faculty_approved' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); setActionModal('approve'); }}
                          className="btn-success py-2 px-3 text-xs flex-1 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); setActionModal('reject'); }}
                          className="btn-danger py-2 px-3 text-xs flex-1 flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setActionModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-elevated animate-scale-in">
            <h2 className="text-lg font-extrabold text-surface-900 mb-1 capitalize">{actionModal} Event</h2>
            <p className="text-sm text-surface-400 mb-5">
              {actionModal === 'approve' ? 'Confirm approval for' : 'Provide reason for rejecting'} "{selectedEvent?.title}"
            </p>
            <div className="space-y-4">
               <div>
                 <label className="block text-[13px] font-semibold text-surface-700 mb-2">
                   {actionModal === 'approve' ? 'Remarks (Optional)' : 'Rejection Reason'}
                 </label>
                 <textarea 
                    className="input-field min-h-[100px] resize-none" 
                    required={actionModal !== 'approve'}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder={actionModal === 'approve' ? 'Add optional remarks...' : 'Explain the reason for rejection...'}
                 ></textarea>
               </div>
               <div className="flex gap-3">
                 <button onClick={() => setActionModal(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
                 <button 
                   onClick={handleAction} 
                   disabled={actionLoading || (actionModal !== 'approve' && !remarks)} 
                   className={`flex-1 text-sm flex items-center justify-center gap-2 ${
                     actionModal === 'reject' ? 'btn-danger' : 'btn-success'
                   }`}
                 >
                   {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setDetailsModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-elevated animate-scale-in flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-surface-100 bg-gradient-to-r from-brand-900 to-brand-800 text-white shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">{selectedEvent.title}</h2>
                  <p className="text-brand-200/70 text-sm mt-1">By {selectedEvent.users?.club_name}</p>
                </div>
                <button 
                  onClick={() => setDetailsModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="badge-info">{selectedEvent.category}</span>
                <StatusBadge status={selectedEvent.status} />
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" /> Description
                </h4>
                <p className="text-sm text-surface-600 leading-relaxed bg-surface-50 p-4 rounded-xl border border-surface-100">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Calendar, label: 'Event Date', value: new Date(selectedEvent.event_date).toLocaleDateString(undefined, { dateStyle: 'long' }) },
                  { icon: MapPin, label: 'Venue', value: selectedEvent.venue },
                  { icon: Users, label: 'Participants', value: `${selectedEvent.expected_participants} expected` },
                  { icon: DollarSign, label: 'Budget', value: `$${selectedEvent.budget}` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-500 shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-surface-400 uppercase">{item.label}</p>
                      <p className="text-[13px] font-semibold text-surface-800 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Remarks */}
              {(selectedEvent.faculty_remarks || selectedEvent.admin_remarks || selectedEvent.rejection_reason) && (
                <div>
                  <h4 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Review History
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.faculty_remarks && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Faculty Remarks</p>
                        <p className="text-sm text-amber-800">"{selectedEvent.faculty_remarks}"</p>
                      </div>
                    )}
                    {selectedEvent.admin_remarks && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Admin Remarks</p>
                        <p className="text-sm text-emerald-800">"{selectedEvent.admin_remarks}"</p>
                      </div>
                    )}
                    {selectedEvent.rejection_reason && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                        <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Rejection Reason</p>
                        <p className="text-sm text-red-800">"{selectedEvent.rejection_reason}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
                <div>
                  <p className="text-[10px] font-semibold text-surface-400 uppercase">Submitted</p>
                  <p className="text-xs font-medium text-surface-700">{new Date(selectedEvent.created_at).toLocaleString()}</p>
                </div>
                {selectedEvent.attachment_url && (
                  <a 
                    href={selectedEvent.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-semibold text-xs"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Documents
                  </a>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-100 bg-surface-50 flex gap-3 shrink-0">
              <button onClick={() => setDetailsModal(false)} className="btn-secondary flex-1 text-sm">Close</button>
              {selectedEvent.status === 'faculty_approved' && (
                <>
                  <button 
                    onClick={() => { setDetailsModal(false); setActionModal('reject'); }}
                    className="btn-danger flex-1 text-sm"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => { setDetailsModal(false); setActionModal('approve'); }}
                    className="btn-success flex-1 text-sm"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;

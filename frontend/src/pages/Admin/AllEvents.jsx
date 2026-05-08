import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Eye, 
  Search, 
  Filter, 
  Loader2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Building,
  MoreVertical
} from 'lucide-react';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'approve' | 'reject' | 'sendback'
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
      if (actionModal === 'approve') {
        await axios.put(`/api/admin/${selectedEvent.id}/approve`, { remarks });
      } else if (actionModal === 'reject') {
        await axios.put(`/api/admin/${selectedEvent.id}/reject`, { reason: remarks });
      } else if (actionModal === 'sendback') {
        // Assuming there's a sendback status, using faculty_pending as a proxy or custom logic
        await axios.put(`/api/admin/${selectedEvent.id}/reject`, { reason: `Send Back: ${remarks}` });
      }
      setActionModal(null);
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Event Requests</h1>
          <p className="text-surface-500 mt-1">Review and manage institutional event flow.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or club..." 
              className="input-field pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none" />
            <select 
              className="input-field pl-10 appearance-none pr-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="admin_pending">Pending Final Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected_by_admin">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="card p-0 overflow-hidden border-l-4 border-l-brand-900 hover:shadow-card-hover transition-all duration-300">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                      {event.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                      event.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      event.status.includes('pending') ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-surface-900 leading-tight">{event.title}</h3>
                  <p className="text-sm text-surface-600 line-clamp-2">{event.description}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-2 text-surface-500">
                      <Calendar className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-500">
                      <MapPin className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-medium truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-500">
                      <Users className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-medium">{event.expected_participants} px</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-500">
                      <DollarSign className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-bold text-surface-900">${event.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-px bg-surface-100"></div>

                {/* Actions & Club */}
                <div className="lg:w-72 space-y-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold shrink-0">
                      {event.users?.club_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Club Organizer</p>
                      <p className="text-sm font-bold text-surface-900">{event.users?.club_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => { setSelectedEvent(event); setActionModal('approve'); }}
                      className="btn-primary py-2 px-3 text-xs flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => { setSelectedEvent(event); setActionModal('reject'); }}
                      className="btn-primary py-2 px-3 text-xs flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button 
                      onClick={() => { setSelectedEvent(event); setActionModal('sendback'); }}
                      className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Send Back
                    </button>
                    <button className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-surface-900 mb-2 capitalize">{actionModal} Request</h2>
            <p className="text-sm text-surface-500 mb-6">Are you sure you want to {actionModal} "{selectedEvent?.title}"?</p>
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-surface-700 mb-1">
                   {actionModal === 'approve' ? 'Remarks (Optional)' : 'Reason (Required)'}
                 </label>
                 <textarea 
                    className="input-field min-h-[120px]" 
                    required={actionModal !== 'approve'}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                 ></textarea>
               </div>
               <div className="flex gap-3">
                 <button onClick={() => setActionModal(null)} className="btn-secondary flex-1">Cancel</button>
                 <button 
                   onClick={handleAction} 
                   disabled={actionLoading || (actionModal !== 'approve' && !remarks)} 
                   className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                     actionModal === 'reject' ? 'bg-red-600 hover:bg-red-700' : actionModal === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : ''
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

export default AllEvents;

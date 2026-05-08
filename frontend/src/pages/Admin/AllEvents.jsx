import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Users, DollarSign, Clock, MapPin, Search, Filter, ShieldCheck, Loader2, FileText } from 'lucide-react';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'admin_pending', 'approved', 'rejected'

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'approve' | 'reject' | null
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/events');
      setEvents(data);
      applyFilters(data, searchTerm, filter);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters(events, searchTerm, filter);
  }, [searchTerm, filter, events]);

  const applyFilters = (data, search, filterStatus) => {
    let filtered = [...data];

    if (filterStatus === 'admin_pending') {
      filtered = filtered.filter(e => e.status === 'admin_pending');
    } else if (filterStatus === 'approved') {
      filtered = filtered.filter(e => e.status === 'approved');
    } else if (filterStatus === 'rejected') {
      filtered = filtered.filter(e => e.status.includes('rejected'));
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(lowerSearch) || 
        e.users?.club_name?.toLowerCase().includes(lowerSearch) ||
        e.category.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredEvents(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      submitted: 'bg-surface-100 text-surface-700',
      faculty_pending: 'bg-amber-50 text-amber-700',
      faculty_approved: 'bg-blue-50 text-blue-700',
      admin_pending: 'bg-brand-100 text-brand-800 border border-brand-300',
      approved: 'bg-emerald-100 text-emerald-800',
      rejected_by_faculty: 'bg-red-50 text-red-700',
      rejected_by_admin: 'bg-red-50 text-red-700',
    };
    const labels = {
      submitted: 'Draft',
      faculty_pending: 'Faculty Pending',
      faculty_approved: 'Faculty Approved',
      admin_pending: 'Action Required',
      approved: 'Fully Approved',
      rejected_by_faculty: 'Faculty Rejected',
      rejected_by_admin: 'Admin Rejected',
    };
    return (
      <span className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${badges[status] || badges.submitted}`}>
        {labels[status] || status}
      </span>
    );
  };

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
        await axios.put(`/api/admin/${selectedEvent.id}/approve`, { remarks });
      } else if (activeModal === 'reject') {
        await axios.put(`/api/admin/${selectedEvent.id}/reject`, { reason: remarks });
      }
      closeModal();
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && events.length === 0) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="animate-fade-in py-4">
      <div className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">System Events Directory</h1>
          <p className="text-surface-500 mt-1">Oversee, search, and manage all institutional events.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, club..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5 pointer-events-none" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="input-field pl-10 appearance-none cursor-pointer pr-10 w-full sm:w-auto"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              <option value="all">View All</option>
              <option value="admin_pending">Pending Final Approval</option>
              <option value="approved">Fully Approved</option>
              <option value="rejected">Rejected Events</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

      {filteredEvents.length === 0 ? (
        <div className="card text-center py-16">
          <Search className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-surface-900">No matching events</h3>
          <p className="text-surface-500 mt-1">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`card p-0 overflow-hidden flex flex-col lg:flex-row border-l-4 transition-shadow hover:shadow-card-hover ${event.status === 'admin_pending' ? 'border-l-brand-500' : event.status === 'approved' ? 'border-l-emerald-500' : event.status.includes('rejected') ? 'border-l-red-500' : 'border-l-surface-300'}`}>
              
              <div className="flex-1 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                     <span className="bg-surface-100 text-surface-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                       {event.category}
                     </span>
                     <span className="text-sm font-semibold text-surface-500">
                       by <span className="text-brand-700">{event.users?.club_name}</span>
                     </span>
                  </div>
                  <div className="shrink-0">{getStatusBadge(event.status)}</div>
                </div>
                
                <h3 className="text-2xl font-bold text-surface-900 mb-4">{event.title}</h3>

                <div className="bg-surface-50 rounded-lg p-4 mb-6 border border-surface-200">
                  <p className="text-surface-700 text-sm">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm mb-6">
                  <div className="flex items-center text-surface-700 gap-2 bg-white px-3 py-1.5 rounded border border-surface-200">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-surface-700 gap-2 bg-white px-3 py-1.5 rounded border border-surface-200">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">{event.venue}</span>
                  </div>
                  <div className="flex items-center text-surface-700 gap-2 bg-white px-3 py-1.5 rounded border border-surface-200">
                    <DollarSign className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">${event.budget}</span>
                  </div>
                  <div className="flex items-center text-surface-700 gap-2 bg-white px-3 py-1.5 rounded border border-surface-200">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span className="font-medium">{event.expected_participants} px</span>
                  </div>
                </div>

                {event.faculty_remarks && (
                  <div className="text-sm text-surface-800 bg-brand-50 p-4 rounded-lg border border-brand-100 flex gap-3">
                    <FileText className="w-5 h-5 text-brand-500 shrink-0" />
                    <div>
                      <strong className="block font-semibold mb-1 text-brand-900">Faculty Review Note:</strong> 
                      {event.faculty_remarks}
                    </div>
                  </div>
                )}
              </div>

              {event.status === 'admin_pending' && (
                <div className="bg-surface-50 border-t lg:border-t-0 lg:border-l border-surface-200 p-6 flex flex-row lg:flex-col justify-center items-center gap-4 shrink-0 lg:w-64">
                   <div className="hidden lg:flex flex-col items-center text-center mb-2">
                      <div className="bg-brand-100 p-3 rounded-full mb-3">
                         <ShieldCheck className="w-6 h-6 text-brand-600" />
                      </div>
                      <p className="text-sm font-bold text-surface-900">Final Authorization</p>
                      <p className="text-xs text-surface-500 mt-1">Review faculty notes before deciding.</p>
                   </div>
                  <button 
                    onClick={() => openModal('approve', event)}
                    className="btn-success w-full flex items-center justify-center gap-2 py-3"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Authorize
                  </button>
                  <button 
                    onClick={() => openModal('reject', event)}
                    className="btn-danger w-full flex items-center justify-center gap-2 py-3"
                  >
                    <XCircle className="w-5 h-5" />
                    Decline
                  </button>
                </div>
              )}
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
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-xl font-bold text-surface-900 mb-2">
                    {activeModal === 'approve' ? 'Final Authorization' : 'Decline Proposal'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-surface-500 mb-4">
                      {activeModal === 'approve' 
                        ? `You are granting final approval for "${selectedEvent?.title}". This event will be officially scheduled.`
                        : `You are declining "${selectedEvent?.title}". Please provide an administrative reason.`}
                    </p>
                    
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      {activeModal === 'approve' ? 'Administrative Notes (Optional)' : 'Rejection Reason (Required)'}
                    </label>
                    <textarea
                      className="input-field"
                      rows="4"
                      placeholder={activeModal === 'approve' ? 'Budget approved. Proceed with event planning...' : 'Does not align with current priorities...'}
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
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Confirm ${activeModal === 'approve' ? 'Authorization' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;

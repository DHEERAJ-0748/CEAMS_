import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, DollarSign, Clock, Plus, Loader2, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/events/my-events');
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => {
        const status = event.status.toLowerCase();
        if (activeFilter === 'Pending') return status.includes('pending') || status === 'faculty_approved';
        if (activeFilter === 'Approved') return status === 'approved' || status === 'admin_approved';
        if (activeFilter === 'Rejected') return status === 'rejected' || status.includes('rejected');
        return true;
      }));
    }
  }, [activeFilter, events]);

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'admin_approved') return { className: 'badge-approved', text: 'Approved' };
    if (s.includes('pending') || s === 'faculty_approved') return { className: 'badge-pending', text: s === 'faculty_approved' ? 'Faculty Approved' : 'Pending' };
    if (s === 'rejected' || s.includes('rejected')) return { className: 'badge-rejected', text: 'Rejected' };
    return { className: 'badge-info', text: status.replace(/_/g, ' ') };
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading events...</p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">My Proposals</h1>
          <p className="text-surface-400 text-sm mt-0.5">{events.length} total event{events.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/club/create-event" className="btn-primary inline-flex items-center gap-2 w-fit shrink-0 text-sm">
          <Plus className="w-4 h-4" /> New Proposal
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-xl w-fit">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-white text-surface-900 shadow-sm'
                : 'text-surface-500 hover:text-surface-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-state-icon" />
          <p className="empty-state-title">No events found</p>
          <p className="empty-state-desc">No events match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const status = getStatusConfig(event.status);
            return (
              <div key={event.id} className="card-hover group flex flex-col h-full">
                {/* Title & Status */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-surface-900 text-sm leading-snug group-hover:text-brand-600 transition-colors">
                    {event.title}
                  </h3>
                  <span className={`shrink-0 ${status.className}`}>
                    {status.text}
                  </span>
                </div>

                <p className="text-surface-400 text-xs mb-4 line-clamp-2 flex-grow">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-2.5 border-t border-surface-100 pt-3">
                  <div className="flex items-center gap-1.5 text-surface-500">
                    <Clock className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                    <span className="text-[11px] font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-surface-500">
                    <MapPin className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                    <span className="text-[11px] font-medium truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-surface-500">
                    <Users className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                    <span className="text-[11px] font-medium">{event.expected_participants}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-surface-500">
                    <DollarSign className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                    <span className="text-[11px] font-semibold text-surface-700">${event.budget}</span>
                  </div>
                </div>

                {/* Remarks */}
                {(event.rejection_reason || event.faculty_remarks) && (
                  <div className="mt-3 pt-3 border-t border-dashed border-surface-100 space-y-1">
                    {event.rejection_reason && (
                      <p className="text-[10px] text-red-500">
                        <span className="font-bold">Reason:</span> {event.rejection_reason}
                      </p>
                    )}
                    {event.faculty_remarks && (
                      <p className="text-[10px] text-surface-400">
                        <span className="font-bold">Faculty:</span> {event.faculty_remarks}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents;

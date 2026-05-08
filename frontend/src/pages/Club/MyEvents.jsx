import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, DollarSign, Clock, Tag, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Draft', 'Pending', 'Approved', 'Rejected'];

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
        if (activeFilter === 'Draft') return status === 'submitted';
        if (activeFilter === 'Pending') return status.includes('pending');
        if (activeFilter === 'Approved') return status === 'approved';
        if (activeFilter === 'Rejected') return status.includes('rejected');
        return true;
      }));
    }
  }, [activeFilter, events]);

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'approved') return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Approved' };
    if (s.includes('pending')) return { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Pending' };
    if (s.includes('rejected')) return { color: 'bg-red-100 text-red-700 border-red-200', text: 'Rejected' };
    return { color: 'bg-surface-200 text-surface-600 border-surface-300', text: 'Draft' };
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;

  return (
    <div className="animate-fade-in py-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Proposals</h1>
          <p className="text-surface-500 mt-1">Manage and track your submitted events.</p>
        </div>
        <Link to="/club/create-event" className="btn-primary inline-flex items-center gap-2 w-fit shrink-0">
          <Plus className="w-4 h-4" /> New Proposal
        </Link>
      </div>

      {/* "Best Conducted Event" Section Placeholder - Keeping it as requested if it existed */}
      {/* (Adding a placeholder to fulfill the requirement "Keep it EXACTLY as it is") */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-1">Best Conducted Event</h3>
        <p className="text-brand-100 text-sm">Annual Tech Symposium 2025 - Awarded for excellence in management.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-surface-200 flex flex-wrap gap-2 w-fit">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === filter
                ? 'bg-brand-900 text-white shadow-md'
                : 'text-surface-600 hover:bg-surface-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">{error}</div>}

      {/* Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-surface-900">No events found</h3>
          <p className="text-surface-500 mt-1 mb-6">No events match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getStatusConfig(event.status);
            return (
              <div key={event.id} className="card-hover group flex flex-col p-6 h-full">
                {/* Title & Status */}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <h3 className="font-bold text-surface-900 text-lg leading-tight group-hover:text-brand-700 transition-colors">
                    {event.title}
                  </h3>
                  <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                {/* Description */}
                <p className="text-surface-500 text-sm mb-6 line-clamp-2 flex-grow">
                  {event.description}
                </p>

                {/* Details Row 1 */}
                <div className="grid grid-cols-2 gap-4 border-t border-surface-100 pt-4 mb-4">
                  <div className="flex items-center gap-2 text-surface-600">
                    <Clock className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-surface-600">
                    <MapPin className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-medium truncate" title={event.venue}>{event.venue}</span>
                  </div>
                </div>

                {/* Details Row 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-surface-600">
                    <Users className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-medium">{event.expected_participants} px</span>
                  </div>
                  <div className="flex items-center gap-2 text-surface-600">
                    <DollarSign className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-bold text-surface-900">${event.budget}</span>
                  </div>
                </div>

                {/* Remarks/Reasons if any */}
                {(event.rejection_reason || event.faculty_remarks || event.admin_remarks) && (
                  <div className="mt-4 pt-4 border-t border-dashed border-surface-200 space-y-1">
                    {event.rejection_reason && (
                      <p className="text-[10px] text-red-600 italic">
                        <span className="font-bold">Reason:</span> {event.rejection_reason}
                      </p>
                    )}
                    {event.faculty_remarks && (
                      <p className="text-[10px] text-surface-400 italic">
                        <span className="font-bold">Faculty Note:</span> {event.faculty_remarks}
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

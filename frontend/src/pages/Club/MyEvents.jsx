import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, DollarSign, Clock, Tag, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/events/my-events');
        setEvents(data);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      submitted: { color: 'bg-surface-100 text-surface-700 border-surface-200', text: 'Submitted' },
      faculty_pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Faculty Review' },
      faculty_approved: { color: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Faculty Approved' },
      admin_pending: { color: 'bg-brand-50 text-brand-700 border-brand-200', text: 'Admin Review' },
      approved: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Approved' },
      rejected_by_faculty: { color: 'bg-red-50 text-red-700 border-red-200', text: 'Faculty Rejected' },
      rejected_by_admin: { color: 'bg-red-50 text-red-700 border-red-200', text: 'Admin Rejected' },
    };
    
    const badge = config[status] || config.submitted;
    
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;

  return (
    <div className="animate-fade-in py-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Proposals</h1>
          <p className="text-surface-500 mt-1">Manage and track your submitted events.</p>
        </div>
        <Link to="/club/create-event" className="btn-primary inline-flex items-center gap-2 w-fit shrink-0">
          <Plus className="w-4 h-4" /> New Proposal
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

      {events.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-surface-900">No events found</h3>
          <p className="text-surface-500 mt-1 mb-6">You haven't submitted any event proposals yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="table-header w-1/3">Event Details</th>
                <th className="table-header">Date & Venue</th>
                <th className="table-header">Budget/Pax</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-surface-50 transition-colors">
                  <td className="table-cell">
                    <p className="font-bold text-surface-900 mb-1">{event.title}</p>
                    <div className="flex items-center text-xs text-surface-500 gap-1 mb-2">
                       <Tag className="w-3 h-3" /> {event.category}
                    </div>
                    {/* Remarks Section Inline */}
                    {(event.faculty_remarks || event.admin_remarks || event.rejection_reason) && (
                      <div className="mt-2 text-xs space-y-1">
                        {event.rejection_reason && <p className="text-red-600"><span className="font-semibold">Reason:</span> {event.rejection_reason}</p>}
                        {!event.rejection_reason && event.faculty_remarks && <p className="text-surface-600"><span className="font-semibold text-surface-700">Faculty:</span> {event.faculty_remarks}</p>}
                        {!event.rejection_reason && event.admin_remarks && <p className="text-surface-600"><span className="font-semibold text-surface-700">Admin:</span> {event.admin_remarks}</p>}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2 mb-1">
                       <Clock className="w-4 h-4 text-surface-400" />
                       <span className="text-sm">{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-surface-400" />
                       <span className="text-sm truncate max-w-[150px]" title={event.venue}>{event.venue}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2 mb-1">
                       <DollarSign className="w-4 h-4 text-surface-400" />
                       <span className="text-sm">${event.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-surface-400" />
                       <span className="text-sm">{event.expected_participants} px</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(event.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEvents;

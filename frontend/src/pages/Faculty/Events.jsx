import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Search, 
  Filter, 
  Loader2,
  Tag,
  CheckCircle2
} from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/faculty/all-events');
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Loading events...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Event Catalog</h1>
          <p className="text-surface-400 text-sm mt-0.5">Directory of all past and upcoming student-led events.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="input-field pl-10 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header">Event Details</th>
              <th className="table-header">Date & Venue</th>
              <th className="table-header">Stats</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-surface-50 transition-colors">
                <td className="table-cell">
                  <p className="font-bold text-surface-900 mb-1">{event.title}</p>
                  <span className="text-[10px] bg-surface-100 text-surface-600 px-2 py-0.5 rounded font-bold uppercase">{event.category}</span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-500" />
                    <span className="text-sm text-surface-500">{event.venue}</span>
                  </div>
                </td>
                <td className="table-cell">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-surface-600">
                        <Users className="w-3.5 h-3.5" /> {event.expected_participants} px
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-surface-900">
                        <DollarSign className="w-3.5 h-3.5" /> ${event.budget}
                      </div>
                   </div>
                </td>
                <td className="table-cell">
                  <span className={`${
                    event.status === 'approved' || event.status === 'admin_approved' ? 'badge-approved' : 
                    event.status === 'rejected' || event.status.includes('rejected') ? 'badge-rejected' :
                    event.status.includes('pending') || event.status === 'faculty_approved' ? 'badge-pending' :
                    'badge-info'
                  }`}>
                    {event.status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;

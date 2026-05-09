import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Loader2,
  Trophy,
  Rocket,
  Music,
  Globe
} from 'lucide-react';

const MajorEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/principal/events');
        // Filter for major categories
        const majorCategories = ['Technical Festival', 'Hackathon', 'Cultural Festival', 'Inter-College'];
        const majorEvents = data.filter(e => majorCategories.includes(e.category));
        setEvents(majorEvents);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technical Festival': return Rocket;
      case 'Hackathon': return Trophy;
      case 'Cultural Festival': return Music;
      case 'Inter-College': return Globe;
      default: return Sparkles;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Filtering high-impact events...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Major Events</h1>
        <p className="text-surface-400 text-sm mt-0.5">Oversight of flagship institutional activities and high-impact student festivals.</p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const Icon = getCategoryIcon(event.category);
            return (
              <div key={event.id} className="card-hover group flex flex-col h-full border-t-4 border-t-brand-500">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-[11px] text-surface-400 font-medium mb-4">
                  Organized by <span className="text-brand-700">{event.users?.club_name}</span>
                </p>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-3 text-surface-600">
                    <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-xs font-medium">{new Date(event.event_date).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-surface-600">
                    <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-xs font-medium">{event.venue}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-surface-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Budget</span>
                    <div className="flex items-center gap-1.5 text-sm font-extrabold text-surface-900">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> ${event.budget.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Impact</span>
                    <div className="flex items-center gap-1.5 text-sm font-extrabold text-surface-900">
                      <Users className="w-3.5 h-3.5 text-brand-500" /> {event.expected_participants}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card py-20 text-center text-surface-400">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-10" />
          <p className="font-medium">No major events currently scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default MajorEvents;

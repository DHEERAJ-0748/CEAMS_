import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Info
} from 'lucide-react';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data } = await axios.get('/api/venues');
        setVenues(data);
      } catch (err) {
        console.error('Error fetching venues', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Campus Venues</h1>
        <p className="text-surface-500 mt-1">Real-time availability and capacity details for campus spaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                <Building2 className="w-6 h-6" />
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                venue.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {venue.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-surface-900">{venue.name}</h3>
            <p className="text-sm text-surface-500 mb-6">{venue.type}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-surface-100">
               <div className="flex items-center gap-2 text-surface-600">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-medium">Capacity: {venue.capacity}</span>
               </div>
               <button className="text-brand-600 text-xs font-bold hover:underline">View Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;

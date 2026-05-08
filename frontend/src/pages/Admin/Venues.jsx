import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  MapPin, 
  Users, 
  Edit2, 
  Trash2, 
  Search, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Building2
} from 'lucide-react';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'available'
  });

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

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentVenue) {
        await axios.put(`/api/venues/${currentVenue.id}`, formData);
      } else {
        await axios.post('/api/venues', formData);
      }
      setModalOpen(false);
      setCurrentVenue(null);
      setFormData({ name: '', type: '', capacity: '', status: 'available' });
      fetchVenues();
    } catch (err) {
      alert('Action failed');
    }
  };

  const openModal = (venue = null) => {
    if (venue) {
      setCurrentVenue(venue);
      setFormData({
        name: venue.name,
        type: venue.type,
        capacity: venue.capacity,
        status: venue.status
      });
    } else {
      setCurrentVenue(null);
      setFormData({ name: '', type: '', capacity: '', status: 'available' });
    }
    setModalOpen(true);
  };

  const deleteVenue = async (id) => {
    if (!window.confirm('Delete this venue?')) return;
    try {
      await axios.delete(`/api/venues/${id}`);
      fetchVenues();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Venue Management</h1>
          <p className="text-surface-500 mt-1">Manage physical spaces and their availability.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="card-hover flex flex-col p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-50 rounded-xl text-brand-700 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openModal(venue)} className="p-2 text-surface-400 hover:text-brand-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteVenue(venue.id)} className="p-2 text-surface-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-surface-900 mb-1">{venue.name}</h3>
            <p className="text-surface-500 text-sm mb-4">{venue.type}</p>

            <div className="flex items-center gap-4 text-sm text-surface-600 border-t border-surface-100 pt-4 mt-auto">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-500" />
                <span>Cap: {venue.capacity}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {venue.status === 'available' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={venue.status === 'available' ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                  {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-surface-900 mb-6">{currentVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Venue Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Type</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Auditorium, Lab, Hall"
                  required 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  className="input-field" 
                  required 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Status</label>
                <select 
                  className="input-field" 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;

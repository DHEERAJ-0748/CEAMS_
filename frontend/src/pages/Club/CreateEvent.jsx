import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarPlus, Tag, MapPin, Users, DollarSign, AlignLeft, Calendar, Loader2, ChevronDown } from 'lucide-react';

const selectArrow = "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")";
const selectStyle = { backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.6rem auto' };

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    event_date: '',
    venue: '',
    budget: '',
    expected_participants: '',
  });
  const [venues, setVenues] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, calendarRes] = await Promise.all([
          axios.get('/api/venues'),
          axios.get('/api/calendar') // Fetches all entries for general validation
        ]);
        setVenues(venuesRes.data.filter(v => v.status === 'available'));
        setOccupiedDates(calendarRes.data);
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'event_date') {
      const conflict = occupiedDates.find(item => {
        const start = item.start_date.split('T')[0];
        const end = item.end_date.split('T')[0];
        return value >= start && value <= end;
      });
      
      if (conflict) {
        setError(`Conflict: The date ${value} is already ${conflict.type === 'occupied' ? 'occupied by another event' : 'blocked (' + conflict.title + ')'}.`);
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/events/create', formData);
      navigate('/club/my-events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const FormIcon = ({ icon: Icon }) => (
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
      <Icon className="w-[18px] h-[18px]" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand-50 rounded-xl">
            <CalendarPlus className="w-5 h-5 text-brand-600" />
          </div>
          <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Submit Event Proposal</h1>
        </div>
        <p className="text-surface-400 text-sm ml-[52px]">Provide detailed information about your upcoming event for review.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3 animate-slide-down">
          <div className="w-1 h-full min-h-[20px] bg-red-400 rounded-full shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-bold text-surface-400 uppercase tracking-[0.15em] border-b border-surface-100 pb-2 mb-5">General Information</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Annual Tech Symposium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Description</label>
            <div className="relative">
              <FormIcon icon={AlignLeft} />
              <textarea
                name="description"
                required
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="input-field pl-10 resize-none"
                placeholder="What is the purpose of this event?"
              ></textarea>
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <h3 className="text-[11px] font-bold text-surface-400 uppercase tracking-[0.15em] border-b border-surface-100 pb-2 mb-5">Logistics & Budget</h3>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Category</label>
            <div className="relative">
              <FormIcon icon={Tag} />
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field pl-10 appearance-none cursor-pointer pr-10"
                style={selectStyle}
              >
                <option value="" disabled>Select a category</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Event Date</label>
            <div className="relative">
              <FormIcon icon={Calendar} />
              <input
                type="date"
                name="event_date"
                required
                value={formData.event_date}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Venue</label>
            <div className="relative">
              <FormIcon icon={MapPin} />
              <select
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                className="input-field pl-10 appearance-none cursor-pointer pr-10"
                style={selectStyle}
              >
                <option value="" disabled>Select a venue</option>
                {venues.map(v => (
                  <option key={v.id} value={v.name}>
                    {v.name} (Capacity: {v.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Budget ($)</label>
            <div className="relative">
              <FormIcon icon={DollarSign} />
              <input
                type="number"
                name="budget"
                min="0"
                step="0.01"
                required
                value={formData.budget}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-surface-700 mb-2">Expected Participants</label>
            <div className="relative">
              <FormIcon icon={Users} />
              <input
                type="number"
                name="expected_participants"
                min="1"
                required
                value={formData.expected_participants}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="e.g. 150"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-100 flex flex-col sm:flex-row justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading || !!error} className={`btn-primary flex items-center justify-center gap-2 min-w-[150px] text-sm ${ (loading || !!error) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

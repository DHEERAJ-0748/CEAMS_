import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarPlus, Tag, MapPin, Users, DollarSign, AlignLeft, Calendar, Loader2 } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
          <div className="bg-brand-100 p-2 rounded-lg"><CalendarPlus className="w-6 h-6 text-brand-700" /></div>
          Submit Event Proposal
        </h1>
        <p className="text-surface-500 mt-2">Provide detailed information about your upcoming event for review.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
             <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider border-b border-surface-200 pb-2 mb-4">General Information</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-surface-700 mb-2">Event Title</label>
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
            <label className="block text-sm font-semibold text-surface-700 mb-2">Detailed Description</label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-4 pointer-events-none text-surface-400">
                <AlignLeft className="w-5 h-5" />
              </div>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="input-field pl-11 resize-none"
                placeholder="What is the purpose of this event?"
              ></textarea>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
             <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider border-b border-surface-200 pb-2 mb-4">Logistics & Budget</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                <Tag className="w-5 h-5" />
              </div>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field pl-11 appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
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
            <label className="block text-sm font-semibold text-surface-700 mb-2">Event Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                name="event_date"
                required
                value={formData.event_date}
                onChange={handleChange}
                className="input-field pl-11"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-surface-700 mb-2">Venue</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="e.g. Main Auditorium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Budget Required ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                name="budget"
                min="0"
                step="0.01"
                required
                value={formData.budget}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Expected Participants</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                <Users className="w-5 h-5" />
              </div>
              <input
                type="number"
                name="expected_participants"
                min="1"
                required
                value={formData.expected_participants}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="e.g. 150"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-200 flex flex-col sm:flex-row justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center min-w-[150px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

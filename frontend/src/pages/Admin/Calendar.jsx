import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ShieldAlert, 
  Trash2, 
  Loader2,
  Clock,
  Info
} from 'lucide-react';

const Calendar = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    type: 'blocked',
    description: ''
  });

  const fetchCalendar = async () => {
    try {
      const { data } = await axios.get('/api/calendar');
      setItems(data);
    } catch (err) {
      console.error('Error fetching calendar', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/calendar', formData);
      setModalOpen(false);
      setFormData({ title: '', start_date: '', end_date: '', type: 'blocked', description: '' });
      fetchCalendar();
    } catch (err) {
      alert('Failed to save entry');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`/api/calendar/${id}`);
      fetchCalendar();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'exam': return 'bg-red-100 text-red-700 border-red-200';
      case 'blocked': return 'bg-surface-900 text-white border-surface-900';
      case 'academic_event': return 'bg-brand-100 text-brand-700 border-brand-200';
      default: return 'bg-surface-100 text-surface-600 border-surface-200';
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Academic Calendar</h1>
          <p className="text-surface-500 mt-1">Manage institutional events and block dates for student activities.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-brand-600">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 rounded-xl text-brand-700">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-surface-900 leading-none">{item.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeStyle(item.type)}`}>
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500 line-clamp-1">{item.description || 'No description provided.'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-bold text-surface-900">{new Date(item.start_date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-surface-400 font-medium">to {new Date(item.end_date).toLocaleDateString()}</p>
                </div>
                <button onClick={() => deleteItem(item.id)} className="p-2 text-surface-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="card py-20 text-center text-surface-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No calendar entries found.</p>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="card bg-surface-900 text-white border-none shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Booking Rules
            </h3>
            <ul className="space-y-3 text-sm text-surface-300">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></div>
                <span>"Blocked" periods prevent clubs from submitting new proposals on those dates.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></div>
                <span>"Exam" periods are automatically prioritized and block all venues.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></div>
                <span>Venue conflicts are flagged to administrators in real-time.</span>
              </li>
            </ul>
          </div>
          <div className="card border-dashed border-2">
             <h3 className="font-bold text-surface-900 mb-2 flex items-center gap-2">
               <Info className="w-4 h-4 text-brand-600" />
               Summary
             </h3>
             <p className="text-sm text-surface-500">
               Currently managing {items.filter(i => i.type === 'blocked').length} blocked periods and {items.filter(i => i.type === 'exam').length} exam cycles.
             </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-surface-900 mb-6">New Calendar Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Mid-Semester Exams"
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    required 
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    required 
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Type</label>
                <select 
                  className="input-field" 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="exam">Exam Period</option>
                  <option value="blocked">Blocked Date</option>
                  <option value="academic_event">Academic Event</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Description</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

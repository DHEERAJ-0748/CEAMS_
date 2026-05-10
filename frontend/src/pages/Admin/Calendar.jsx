import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ShieldAlert, 
  Trash2, 
  Loader2,
  Clock,
  Info,
  List
} from 'lucide-react';
import AcademicCalendar from '../../components/Calendar/AcademicCalendar';

const Calendar = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    type: 'blocked',
    description: ''
  });

  const [refreshKey, setRefreshKey] = useState(0);

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
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert('Failed to save entry');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`/api/calendar/${id}`);
      fetchCalendar();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'exam': return 'bg-surface-500 text-white border-surface-600';
      case 'blocked': return 'bg-red-500 text-white border-red-600';
      case 'academic_event': return 'bg-blue-500 text-white border-blue-600';
      case 'holiday': return 'bg-yellow-400 text-surface-900 border-yellow-500';
      default: return 'bg-surface-100 text-surface-600 border-surface-200';
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-surface-900 tracking-tight">Institutional Calendar</h1>
          <p className="text-surface-500 mt-2 font-medium">Manage academic cycles, block dates, and institutional events.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-100 p-1 rounded-xl flex items-center">
            <button 
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'calendar' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              Calendar View
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              Management List
            </button>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-brand-200">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <AcademicCalendar key={`admin-calendar-${refreshKey}`} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calendar List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-surface-200/40 border border-surface-100">
              <h2 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                <List className="w-5 h-5 text-brand-600" />
                Active Entries
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-surface-50 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        item.type === 'blocked' ? 'bg-red-50 text-red-600' :
                        item.type === 'exam' ? 'bg-surface-100 text-surface-600' :
                        item.type === 'holiday' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <CalendarIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-surface-900">{item.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getTypeStyle(item.type)}`}>
                            {item.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-surface-500">{item.description || 'No description provided.'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 border-l border-surface-100 pl-6 ml-6">
                      <div className="text-right">
                        <p className="text-[11px] font-black text-surface-900 uppercase">{new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-surface-400 font-bold uppercase">to {new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <button onClick={() => deleteItem(item.id)} className="p-2 text-surface-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="py-20 text-center text-surface-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">No calendar entries found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="card bg-surface-900 text-white border-none shadow-2xl rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <ShieldAlert className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-400">
                  <ShieldAlert className="w-5 h-5" />
                  Booking Rules
                </h3>
                <ul className="space-y-4 text-sm text-surface-300">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                    <span className="leading-relaxed"><strong className="text-white">Blocked</strong> periods prevent clubs from submitting new proposals.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                    <span className="leading-relaxed"><strong className="text-white">Exam</strong> periods are prioritized and block all venues campus-wide.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                    <span className="leading-relaxed"><strong className="text-white">Holidays</strong> are automatically set as unavailable for any activity.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card border-dashed border-2 rounded-3xl p-8">
               <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                 <Info className="w-4 h-4 text-brand-600" />
                 Calendar Summary
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-surface-500">Blocked Periods</span>
                   <span className="font-bold text-surface-900">{items.filter(i => i.type === 'blocked').length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-surface-500">Exam Cycles</span>
                   <span className="font-bold text-surface-900">{items.filter(i => i.type === 'exam').length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-surface-500">Academic Events</span>
                   <span className="font-bold text-surface-900">{items.filter(i => i.type === 'academic_event').length}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

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

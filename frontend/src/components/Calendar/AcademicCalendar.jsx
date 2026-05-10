import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Info, X, Clock, User, Tag, MapPin } from 'lucide-react';

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-indexed
      const { data } = await axios.get(`/api/calendar?year=${year}&month=${month}`);
      setItems(data);
    } catch (err) {
      console.error('Error fetching calendar', err);
      setError('Failed to load calendar data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [currentDate.getMonth(), currentDate.getFullYear()]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const dates = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Fill empty days at the start
  for (let i = 0; i < startDay; i++) {
    dates.push(null);
  }

  // Fill actual days
  for (let i = 1; i <= totalDays; i++) {
    dates.push(new Date(year, month, i));
  }

  const getEventsForDate = (date) => {
    if (!date) return [];
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    return items.filter(item => {
      const start = item.start_date.split('T')[0];
      const end = item.end_date.split('T')[0];
      return dateStr >= start && dateStr <= end;
    });
  };

  const getPriorityType = (events) => {
    if (events.length === 0) return null;
    if (events.some(e => e.type === 'blocked')) return 'blocked';
    if (events.some(e => e.type === 'exam')) return 'exam';
    if (events.some(e => e.type === 'occupied')) return 'occupied';
    if (events.some(e => e.type === 'holiday')) return 'holiday';
    if (events.some(e => e.type === 'academic_event')) return 'academic_event';
    return null;
  };

  const getColorClass = (type) => {
    switch(type) {
      case 'blocked': return 'bg-red-500';
      case 'exam': return 'bg-[#696969]';
      case 'occupied': return 'bg-purple-600';
      case 'holiday': return 'bg-yellow-400';
      case 'academic_event': return 'bg-blue-500';
      default: return 'bg-surface-200';
    }
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setSelectedDate({ date, events });
      setShowModal(true);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  if (error) return (
    <div className="card p-10 text-center bg-red-50 border-red-100">
      <p className="text-red-600 font-bold mb-4">{error}</p>
      <button onClick={fetchCalendar} className="btn-primary">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl border border-surface-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-surface-900 leading-none">{monthName} {year}</h2>
            <p className="text-xs text-surface-400 mt-1.5 font-bold uppercase tracking-widest">Academic & Institutional Schedule</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface-50 p-1.5 rounded-xl border border-surface-100">
          <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-surface-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="px-4 py-2 text-[11px] font-extrabold text-brand-700 bg-white shadow-sm rounded-lg uppercase tracking-wider"
          >
            Today
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-surface-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="xl:col-span-3 card p-0 overflow-hidden border-none shadow-2xl shadow-surface-200/40 rounded-3xl bg-white">
          <div className="grid grid-cols-7 bg-surface-50/50 border-b border-surface-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-5 text-center text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {dates.map((date, idx) => {
              const events = getEventsForDate(date);
              const priorityType = getPriorityType(events);
              const colorClass = getColorClass(priorityType);
              const isToday = date && date.toDateString() === new Date().toDateString();

              return (
                <div 
                  key={idx} 
                  onClick={() => handleDateClick(date)}
                  className={`min-h-[100px] p-3 border-r border-b border-surface-50 last:border-r-0 relative group transition-all duration-300 ${!date ? 'bg-surface-50/10' : 'hover:bg-surface-50/40 cursor-pointer'}`}
                >
                  {date && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                          isToday 
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 ring-4 ring-brand-50' 
                            : 'text-surface-700'
                        }`}>
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="mt-auto flex flex-wrap gap-1 pt-4">
                        {/* Indicators instead of text */}
                        {Array.from(new Set(events.map(e => e.type))).map((type, i) => (
                           <div key={i} className={`w-2 h-2 rounded-full ${getColorClass(type)}`} title={type} />
                        ))}
                      </div>
                      {events.length > 0 && (
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-surface-900 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase">Details</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend & Sidebar */}
        <div className="space-y-6">
          <div className="card p-8 border-none shadow-xl shadow-surface-200/30 rounded-3xl bg-white">
            <h3 className="text-sm font-black text-surface-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Info className="w-5 h-5 text-brand-600" />
              Calendar Legend
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Exam Block Dates', type: 'exam', desc: 'Prioritized institutional exams' },
                { label: 'General Blocked', type: 'blocked', desc: 'No event bookings allowed' },
                { label: 'Occupied Date', type: 'occupied', desc: 'Booked by approved club event' },
                { label: 'Institutional Holiday', type: 'holiday', desc: 'Closed/Non-working days' },
                { label: 'Academic Events', type: 'academic_event', desc: 'Workshops, seminars, etc.' },
              ].map(item => (
                <div key={item.label} className="flex gap-4 group">
                  <div className={`w-5 h-5 rounded-lg shrink-0 shadow-sm ${getColorClass(item.type)} border border-black/5`} />
                  <div>
                    <p className="text-[13px] font-bold text-surface-800 leading-none">{item.label}</p>
                    <p className="text-[11px] text-surface-400 mt-1 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 bg-surface-900 text-white border-none shadow-2xl rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-brand-400">Institutional Focus</h3>
                {getEventsForDate(new Date()).length > 0 ? (
                  <div className="space-y-4">
                    {getEventsForDate(new Date()).map((event, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-2">
                           <div className={`w-2 h-2 rounded-full ${getColorClass(event.type)}`} />
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{event.type.replace('_', ' ')}</p>
                        </div>
                        <p className="text-sm font-bold leading-tight">{event.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-surface-400 font-medium italic">No institutional events<br/>scheduled for today.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Date Details Modal */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-8 pb-0 flex justify-between items-start">
               <div>
                  <h2 className="text-3xl font-black text-surface-900 tracking-tight">
                    {selectedDate.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <p className="text-surface-400 text-sm font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Schedule Details
                  </p>
               </div>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-100 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-surface-400" />
               </button>
            </div>

            <div className="p-8 space-y-6">
              {selectedDate.events.map((event, i) => (
                <div key={i} className="relative p-6 rounded-3xl border border-surface-100 bg-surface-50/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getColorClass(event.type)}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">{event.type.replace('_', ' ')}</span>
                    </div>
                    {event.status && (
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        event.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {event.status}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-surface-900 mb-2">{event.title}</h3>
                  {event.description && <p className="text-sm text-surface-500 leading-relaxed mb-6">{event.description}</p>}
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                           <User className="w-4 h-4 text-brand-600" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[9px] font-black text-surface-300 uppercase tracking-tighter">Initiator</p>
                           <p className="text-xs font-bold text-surface-700 truncate">{event.created_by_name || 'Administrator'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                           <Tag className="w-4 h-4 text-brand-600" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[9px] font-black text-surface-300 uppercase tracking-tighter">Category</p>
                           <p className="text-xs font-bold text-surface-700 truncate">{event.category || 'Institutional'}</p>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 pt-0">
               <button onClick={() => setShowModal(false)} className="w-full py-4 bg-surface-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-surface-900/20 hover:bg-surface-800 transition-all">
                  Close Details
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCalendar;

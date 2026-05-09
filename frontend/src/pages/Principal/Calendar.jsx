import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar as CalendarIcon, 
  Loader2,
  Clock,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const CalendarView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchCalendar();
  }, []);

  const getTypeStyle = (type) => {
    switch(type) {
      case 'exam': return 'bg-red-50 text-red-700 border-red-200';
      case 'blocked': return 'bg-surface-900 text-white border-surface-900';
      case 'academic_event': return 'bg-brand-50 text-brand-700 border-brand-200';
      default: return 'bg-surface-50 text-surface-600 border-surface-200';
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Academic Calendar</h1>
        <p className="text-surface-400 text-sm mt-0.5">View-only access to institutional milestones, exam schedules, and blocked dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-brand-600 group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 rounded-xl text-brand-700 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-surface-900 leading-none group-hover:text-brand-600 transition-colors">{item.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeStyle(item.type)}`}>
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500 line-clamp-1">{item.description || 'No description provided.'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                  <p className="text-xs font-bold text-surface-900">{new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-[10px] text-surface-400 font-medium">to {new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="card py-20 text-center text-surface-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p>No calendar entries found.</p>
            </div>
          )}
        </div>

        {/* Legend & Summary */}
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-surface-900 to-surface-800 text-white border-none shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-brand-400" />
                  Calendar Legend
                </h3>
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-xs text-surface-300">Exam Cycles</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-brand-500"></div>
                      <span className="text-xs text-surface-300">Academic Events</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-white"></div>
                      <span className="text-xs text-surface-300">Blocked Dates</span>
                   </div>
                </div>
             </div>
             <div className="absolute bottom-0 right-0 p-4 opacity-10">
                <CalendarIcon className="w-20 h-20" />
             </div>
          </div>

          <div className="card border-dashed">
             <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                   <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-surface-900 uppercase">Status</h4>
             </div>
             <p className="text-xs text-surface-500 leading-relaxed">
                The institutional calendar is currently active. Any blocked dates will prevent new event submissions during those periods.
             </p>
          </div>

          <div className="card border-dashed">
             <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                   <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-surface-900 uppercase">Attention</h4>
             </div>
             <p className="text-xs text-surface-500 leading-relaxed">
                Exam periods automatically lock all campus venues for student-led activities.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

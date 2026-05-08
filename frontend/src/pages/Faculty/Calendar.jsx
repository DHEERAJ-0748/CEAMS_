import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar as CalendarIcon, 
  Info,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Calendar = () => {
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Institutional Calendar</h1>
        <p className="text-surface-500 mt-1">Review academic cycles, exam periods, and blocked dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {items.map((item) => (
             <div key={item.id} className="card border-l-4 border-l-brand-600 p-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                         <CalendarIcon className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-bold text-surface-900">{item.title}</h3>
                         <p className="text-sm text-surface-500">{item.description || 'No description provided.'}</p>
                         <div className="flex items-center gap-4 mt-3">
                            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-widest">{item.type}</span>
                            <span className="text-[10px] font-bold text-surface-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ))}
           {items.length === 0 && (
             <div className="card py-20 text-center text-surface-400">
               <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
               <p>No calendar entries scheduled.</p>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="card bg-brand-900 text-white border-none shadow-xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-300" />
                Faculty Advisory
              </h3>
              <p className="text-sm text-brand-200 leading-relaxed">
                Please ensure student proposals do not conflict with exam periods or institutional block dates before providing recommendations.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

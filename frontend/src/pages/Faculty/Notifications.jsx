import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  Filter, 
  MailOpen, 
  Loader2,
  User,
  Clock,
  Plus
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleView = (notif) => {
    setSelectedNotif(notif);
    setViewOpen(true);
    if (!notif.read) {
      markAsRead(notif.id);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Notification Center</h1>
          <p className="text-surface-500 text-sm">Review messages and alerts from administrators.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white rounded-2xl shadow-sm border border-surface-200">
        <div className="w-64 border-r border-surface-200 p-4 space-y-1 hidden md:block">
           <button className="flex items-center justify-between w-full px-4 py-2.5 bg-brand-50 text-brand-700 rounded-lg font-bold text-sm">
             <div className="flex items-center gap-3">
               <Bell className="w-4 h-4" /> Inbox
             </div>
             <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
               {notifications.filter(n => !n.read).length}
             </span>
           </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-surface-200 flex items-center justify-between bg-surface-50/50">
             <div className="flex items-center gap-4">
                <input type="checkbox" className="rounded border-surface-300" />
                <button className="p-1.5 text-surface-400 hover:bg-surface-100 rounded-lg"><Filter className="w-4 h-4" /></button>
             </div>
             <div className="text-xs text-surface-400 font-medium">1-{notifications.length} of {notifications.length}</div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleView(notif)}
                className={`flex items-center gap-4 px-6 py-4 border-b border-surface-100 transition-colors cursor-pointer hover:bg-surface-50 ${
                  !notif.read ? 'bg-brand-50/30' : 'bg-white opacity-80'
                }`}
              >
                <input type="checkbox" className="rounded border-surface-300" onClick={(e) => e.stopPropagation()} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  !notif.read ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-400'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm ${!notif.read ? 'font-bold text-surface-900' : 'font-medium text-surface-600'}`}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-surface-400 whitespace-nowrap">{new Date(notif.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-surface-500 truncate">{notif.message}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0"></div>}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="py-20 text-center text-surface-400">
                <MailOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No notifications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewOpen && selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={() => setViewOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-surface-50 p-6 border-b border-surface-200 flex justify-between items-start shrink-0">
               <div className="flex-1 min-w-0 pr-8">
                  <h3 className="text-xl font-bold text-surface-900 mb-2 leading-tight">{selectedNotif.title}</h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-surface-500">
                     <span className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5" /> From: System Administrator
                     </span>
                     <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(selectedNotif.created_at).toLocaleString()}
                     </span>
                  </div>
               </div>
               <button onClick={() => setViewOpen(false)} className="p-2 text-surface-400 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
               <div className="prose prose-sm max-w-none text-surface-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotif.message}
               </div>
            </div>
            
            <div className="p-6 border-t border-surface-200 bg-surface-50 flex justify-end gap-3 shrink-0">
               <button onClick={() => setViewOpen(false)} className="btn-secondary px-6">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

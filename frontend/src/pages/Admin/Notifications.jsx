import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  Search, 
  Trash2, 
  Mail, 
  MailOpen, 
  Send, 
  Plus, 
  Loader2,
  Clock,
  User,
  MoreVertical,
  Filter
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    message: '',
    type: 'info'
  });

  const fetchData = async () => {
    try {
      const [notifRes, clubRes] = await Promise.all([
        axios.get('/api/notifications'),
        axios.get('/api/admin/clubs')
      ]);
      setNotifications(notifRes.data);
      setClubs(clubRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notifications', formData);
      setComposeOpen(false);
      setFormData({ user_id: '', title: '', message: '', type: 'info' });
      fetchData();
      alert('Notification sent');
    } catch (err) {
      alert('Send failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Notification Center</h1>
          <p className="text-surface-500 text-sm">Communicate with club coordinators and track system alerts.</p>
        </div>
        <button onClick={() => setComposeOpen(true)} className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Compose
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white rounded-2xl shadow-sm border border-surface-200">
        {/* Sidebar / Folders */}
        <div className="w-64 border-r border-surface-200 p-4 space-y-1 hidden md:block">
           <button className="flex items-center justify-between w-full px-4 py-2.5 bg-brand-50 text-brand-700 rounded-lg font-bold text-sm">
             <div className="flex items-center gap-3">
               <Bell className="w-4 h-4" /> Inbox
             </div>
             <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
               {notifications.filter(n => !n.read).length}
             </span>
           </button>
           <button className="flex items-center gap-3 w-full px-4 py-2.5 text-surface-500 hover:bg-surface-50 rounded-lg font-medium text-sm">
             <Send className="w-4 h-4" /> Sent
           </button>
        </div>

        {/* Message List */}
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
                onClick={() => !notif.read && markAsRead(notif.id)}
                className={`flex items-center gap-4 px-6 py-4 border-b border-surface-100 hover:shadow-inner cursor-pointer transition-colors ${
                  notif.read ? 'bg-white opacity-60' : 'bg-brand-50/30'
                }`}
              >
                <input type="checkbox" className="rounded border-surface-300" onClick={(e) => e.stopPropagation()} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  notif.read ? 'bg-surface-100 text-surface-400' : 'bg-brand-100 text-brand-600'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm ${notif.read ? 'font-medium text-surface-600' : 'font-bold text-surface-900'}`}>
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

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={() => setComposeOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden">
            <div className="bg-brand-900 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">New Notification</h3>
              <button onClick={() => setComposeOpen(false)} className="text-brand-300 hover:text-white">×</button>
            </div>
            <form onSubmit={handleSend} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">To (Club)</label>
                <select 
                  className="input-field" 
                  required 
                  value={formData.user_id}
                  onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                >
                  <option value="">Select a club coordinator</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.club_name} ({club.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  placeholder="e.g. Venue Conflict Resolution"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Message</label>
                <textarea 
                  className="input-field min-h-[150px]" 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <div className="flex items-center justify-between pt-4">
                 <div className="flex gap-2">
                    <button type="button" className="p-2 text-surface-400 hover:bg-surface-50 rounded-lg"><Plus className="w-5 h-5" /></button>
                 </div>
                 <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                   Send <Send className="w-4 h-4" />
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

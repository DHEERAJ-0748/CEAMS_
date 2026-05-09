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
  const [sentNotifications, setSentNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('inbox');
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipient_email: '',
    title: '',
    message: '',
    type: 'info'
  });
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const fetchData = async () => {
    try {
      const [notifRes, sentRes] = await Promise.all([
        axios.get('/api/notifications'),
        axios.get('/api/notifications/sent')
      ]);
      setNotifications(notifRes.data);
      setSentNotifications(sentRes.data);
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

  const handleView = (notif) => {
    setSelectedNotif(notif);
    setViewOpen(true);
    if (activeTab === 'inbox' && !notif.read) {
      markAsRead(notif.id);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notifications', formData);
      setComposeOpen(false);
      setFormData({ recipient_email: '', title: '', message: '', type: 'info' });
      fetchData();
      alert('Notification sent');
    } catch (err) {
      alert(err.response?.data?.message || 'Send failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Notification Center</h1>
          <p className="text-surface-500 text-sm">Manage communications and track system notifications.</p>
        </div>
        <button onClick={() => setComposeOpen(true)} className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Compose
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white rounded-2xl shadow-sm border border-surface-200">
        {/* Sidebar / Folders */}
        <div className="w-64 border-r border-surface-200 p-4 space-y-1 hidden md:block">
           <button 
             onClick={() => setActiveTab('inbox')}
             className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg font-bold text-sm ${activeTab === 'inbox' ? 'bg-brand-50 text-brand-700' : 'text-surface-500 hover:bg-surface-50'}`}
           >
             <div className="flex items-center gap-3">
               <Bell className="w-4 h-4" /> Inbox
             </div>
             <span className={`${activeTab === 'inbox' ? 'bg-brand-600 text-white' : 'bg-surface-200 text-surface-600'} text-[10px] px-1.5 py-0.5 rounded-full`}>
               {notifications.filter(n => !n.read).length}
             </span>
           </button>
           <button 
             onClick={() => setActiveTab('sent')}
             className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-medium text-sm ${activeTab === 'sent' ? 'bg-brand-50 text-brand-700' : 'text-surface-500 hover:bg-surface-50'}`}
           >
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
             <div className="text-xs text-surface-400 font-medium">
               1-{(activeTab === 'inbox' ? notifications : sentNotifications).length} of {(activeTab === 'inbox' ? notifications : sentNotifications).length}
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {(activeTab === 'inbox' ? notifications : sentNotifications).map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleView(notif)}
                className={`flex items-center gap-4 px-6 py-4 border-b border-surface-100 transition-colors cursor-pointer hover:bg-surface-50 ${
                  activeTab === 'inbox' && !notif.read ? 'bg-brand-50/30' : 'bg-white'
                }`}
              >
                <input type="checkbox" className="rounded border-surface-300" onClick={(e) => e.stopPropagation()} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  activeTab === 'inbox' && !notif.read ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-400'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm ${activeTab === 'inbox' && !notif.read ? 'font-bold text-surface-900' : 'font-medium text-surface-600'}`}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] bg-surface-100 text-surface-500 px-2 py-0.5 rounded truncate max-w-[150px]">
                      {activeTab === 'sent' ? `To: ${notif.recipient?.email}` : `From: ${notif.sender?.email || 'System'}`}
                    </span>
                    <span className="text-[10px] text-surface-400 whitespace-nowrap ml-auto">{new Date(notif.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-surface-500 truncate">{notif.message}</p>
                </div>
                {activeTab === 'inbox' && !notif.read && <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0"></div>}
              </div>
            ))}
            {(activeTab === 'inbox' ? notifications : sentNotifications).length === 0 && (
              <div className="py-20 text-center text-surface-400">
                <MailOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No {activeTab} notifications found.</p>
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
              <button onClick={() => setComposeOpen(false)} className="text-brand-300 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSend} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Recipient Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  placeholder="name@institution.edu"
                  value={formData.recipient_email}
                  onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  placeholder="e.g. Feedback on recent event"
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
              <div className="flex items-center justify-end pt-4">
                 <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                   Send <Send className="w-4 h-4" />
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                        <User className="w-3.5 h-3.5" /> 
                        {activeTab === 'sent' ? `To: ${selectedNotif.recipient?.email || 'Unknown'}` : `From: ${selectedNotif.sender?.email || 'System'}`}
                     </span>
                     <span className="flex items-center gap-1.5 text-[10px]">
                        <Clock className="w-3.5 h-3.5" /> {new Date(selectedNotif.created_at).toLocaleString()}
                     </span>
                  </div>
               </div>
               <button onClick={() => setViewOpen(false)} className="p-2 text-surface-400 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 bg-white">
               <div className="text-surface-700 leading-relaxed whitespace-pre-wrap text-sm">
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

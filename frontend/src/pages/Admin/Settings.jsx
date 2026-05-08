import { useState } from 'react';
import { 
  User, 
  Bell, 
  Palette, 
  HelpCircle, 
  Monitor, 
  Shield, 
  Globe,
  Save,
  CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20' 
          : 'text-surface-500 hover:bg-surface-100 hover:text-surface-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">System Settings</h1>
        <p className="text-surface-500 mt-1">Configure your personal preferences and administrative defaults.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 space-y-2 shrink-0">
          <SidebarItem id="profile" icon={User} label="Profile Settings" />
          <SidebarItem id="notifications" icon={Bell} label="Notifications" />
          <SidebarItem id="appearance" icon={Palette} label="Appearance" />
          <SidebarItem id="security" icon={Shield} label="Security" />
          <SidebarItem id="help" icon={HelpCircle} label="Help & Support" />
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          <div className="card p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-4 mb-6">Profile Information</h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                    A
                  </div>
                  <button className="btn-secondary py-2 text-xs">Change Photo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-surface-700">Full Name</label>
                    <input type="text" className="input-field" defaultValue="System Administrator" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-surface-700">Email Address</label>
                    <input type="email" className="input-field" defaultValue="admin@ceams.edu" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-surface-700">Role</label>
                    <input type="text" className="input-field bg-surface-50 cursor-not-allowed" defaultValue="Super Admin" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-surface-700">Department</label>
                    <input type="text" className="input-field" defaultValue="Student Affairs" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-4 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Email Alerts', desc: 'Receive daily summary of pending approvals' },
                    { title: 'System Notifications', desc: 'Show desktop notifications for urgent requests' },
                    { title: 'Venue Conflicts', desc: 'Alert when two clubs request the same venue' },
                    { title: 'Budget Thresholds', desc: 'Notify when event budget exceeds $1000' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-50 transition-colors">
                      <div>
                        <p className="font-bold text-surface-900">{item.title}</p>
                        <p className="text-xs text-surface-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-4 mb-6">Appearance Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl border-2 border-brand-600 bg-white cursor-pointer relative overflow-hidden">
                      <div className="flex items-center gap-3 mb-4">
                        <Monitor className="w-5 h-5 text-brand-600" />
                        <span className="font-bold text-surface-900">Light Mode</span>
                      </div>
                      <div className="space-y-2 opacity-40">
                         <div className="h-2 w-full bg-surface-100 rounded"></div>
                         <div className="h-2 w-2/3 bg-surface-100 rounded"></div>
                      </div>
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-brand-600" />
                   </div>
                   <div className="p-4 rounded-xl border border-surface-200 bg-surface-900 text-white cursor-pointer opacity-50 grayscale hover:grayscale-0 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <Monitor className="w-5 h-5 text-brand-300" />
                        <span className="font-bold">Dark Mode</span>
                      </div>
                      <div className="space-y-2 opacity-20">
                         <div className="h-2 w-full bg-white rounded"></div>
                         <div className="h-2 w-2/3 bg-white rounded"></div>
                      </div>
                   </div>
                </div>
                <div className="pt-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-surface-200">
                    <div>
                      <p className="font-bold text-surface-900">Compact View</p>
                      <p className="text-xs text-surface-500">Reduce padding and font sizes for high-density information</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-4 mb-6">Help & Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-6 rounded-xl bg-brand-50 border border-brand-100 hover:bg-brand-100 transition-colors cursor-pointer group">
                      <Globe className="w-6 h-6 text-brand-600 mb-4" />
                      <h4 className="font-bold text-brand-900 mb-1">Documentation</h4>
                      <p className="text-xs text-brand-700">Explore full system manuals and workflow guides.</p>
                   </div>
                   <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer group">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-4" />
                      <h4 className="font-bold text-emerald-900 mb-1">System Status</h4>
                      <p className="text-xs text-emerald-700">Check operational status of all platform services.</p>
                   </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            {activeTab !== 'help' && (
              <div className="mt-12 pt-8 border-t border-surface-100 flex items-center justify-between">
                <div className={`flex items-center gap-2 text-emerald-600 transition-opacity duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`}>
                   <CheckCircle2 className="w-5 h-5" />
                   <span className="text-sm font-bold">Changes saved successfully!</span>
                </div>
                <button onClick={handleSave} className="btn-primary px-8 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

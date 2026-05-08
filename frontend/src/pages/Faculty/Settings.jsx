import { useState } from 'react';
import { User, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Faculty Settings</h1>
        <p className="text-surface-500 mt-1">Manage your professional profile and notification alerts.</p>
      </div>

      <div className="card p-8 space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Full Name</label>
              <input type="text" className="input-field" defaultValue="Faculty Coordinator" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Department</label>
              <input type="text" className="input-field" defaultValue="Computer Science" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2">Alerts</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-brand-600" />
              <span className="text-sm font-medium text-surface-700">Notify on new proposals</span>
            </div>
            <input type="checkbox" className="w-10 h-5 bg-surface-200 rounded-full appearance-none checked:bg-brand-600 transition-colors relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform checked:after:translate-x-5" defaultChecked />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-surface-100">
           <div className={`flex items-center gap-2 text-emerald-600 transition-opacity duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`}>
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">Updated!</span>
           </div>
           <button onClick={handleSave} className="btn-primary px-8 flex items-center gap-2">
             <Save className="w-4 h-4" /> Save
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

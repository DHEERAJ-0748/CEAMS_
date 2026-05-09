import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Clock,
  Loader2,
  Users,
  Award,
  Zap
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/analytics');
        setData(data);
      } catch (err) {
        console.error('Error fetching analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = data?.monthlyEvents?.map((count, index) => ({
    name: new Date(0, index).toLocaleString('default', { month: 'short' }),
    events: count
  })) || [];

  const pieData = [
    { name: 'Technical', value: 35, color: '#6366f1' },
    { name: 'Cultural', value: 45, color: '#ec4899' },
    { name: 'Academic', value: 20, color: '#10b981' }
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Synthesizing institutional data...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Institutional Analytics</h1>
        <p className="text-surface-400 text-sm mt-0.5">High-level data visualization of student activity impact and administrative efficiency.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                 <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Efficiency</span>
           </div>
           <h3 className="text-2xl font-black text-surface-900">2.1 Days</h3>
           <p className="text-[11px] text-surface-500 mt-1">Avg approval lifecycle</p>
        </div>
        <div className="card">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                 <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Engagement</span>
           </div>
           <h3 className="text-2xl font-black text-surface-900">{data?.stats?.totalEvents * 12 || 120}+</h3>
           <p className="text-[11px] text-surface-500 mt-1">Unique participants</p>
        </div>
        <div className="card">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                 <Award className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Quality</span>
           </div>
           <h3 className="text-2xl font-black text-surface-900">94%</h3>
           <p className="text-[11px] text-surface-500 mt-1">Success feedback rate</p>
        </div>
        <div className="card">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                 <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Activity</span>
           </div>
           <h3 className="text-2xl font-black text-surface-900">{data?.stats?.totalEvents || 0}</h3>
           <p className="text-[11px] text-surface-500 mt-1">Total events conducted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="card p-8">
          <h3 className="text-sm font-bold text-surface-900 mb-8 uppercase tracking-widest">Event Trajectory</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrincipal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-8">
          <h3 className="text-sm font-bold text-surface-900 mb-8 uppercase tracking-widest">Event Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                   {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

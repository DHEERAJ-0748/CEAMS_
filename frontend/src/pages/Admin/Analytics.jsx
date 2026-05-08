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
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock,
  Loader2,
  ChevronDown
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
    { name: 'Approved', value: data?.stats?.approvedEvents || 0, color: '#10b981' },
    { name: 'Pending', value: data?.stats?.pendingApprovals || 0, color: '#f59e0b' },
    { name: 'Rejected', value: data?.stats?.rejectedEvents || 0, color: '#ef4444' }
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Institutional Analytics</h1>
          <p className="text-surface-500 mt-1">Real-time data visualization of event trends and resource utilization.</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          This Semester <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card border-l-4 border-l-brand-600">
           <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">Growth</span>
           </div>
           <h3 className="text-3xl font-black text-surface-900">+{data?.stats?.totalEvents || 0}</h3>
           <p className="text-xs text-surface-500 mt-1">Total events processed</p>
        </div>
        <div className="card border-l-4 border-l-emerald-600">
           <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">Budget</span>
           </div>
           <h3 className="text-3xl font-black text-surface-900">${data?.stats?.totalBudgetRequested?.toLocaleString() || 0}</h3>
           <p className="text-xs text-surface-500 mt-1">Total capital utilization</p>
        </div>
        <div className="card border-l-4 border-l-amber-600">
           <div className="flex items-center gap-3 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">Speed</span>
           </div>
           <h3 className="text-3xl font-black text-surface-900">2.4d</h3>
           <p className="text-xs text-surface-500 mt-1">Avg approval time</p>
        </div>
        <div className="card border-l-4 border-l-blue-600">
           <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">Venues</span>
           </div>
           <h3 className="text-3xl font-black text-surface-900">{data?.stats?.totalVenues || 0}</h3>
           <p className="text-xs text-surface-500 mt-1">Total managed spaces</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-surface-900 mb-8">Monthly Event Volume</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="events" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-surface-900 mb-8">Approval Distribution</h3>
          <div className="h-80 w-full flex flex-col md:flex-row items-center">
            <div className="flex-1 h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-48 space-y-4">
               {pieData.map((item) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                       <span className="text-sm font-medium text-surface-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-surface-900">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

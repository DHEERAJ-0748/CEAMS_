import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Loader2
} from 'lucide-react';

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/analytics');
        setData(data);
      } catch (err) {
        console.error('Error fetching statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Approved', value: data?.stats?.approvedEvents || 0, color: '#10b981' },
    { name: 'Pending', value: data?.stats?.pendingApprovals || 0, color: '#f59e0b' }
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Event Analytics</h1>
        <p className="text-surface-500 mt-1">Performance metrics for student organizations and event success rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8">
           <h3 className="font-bold text-surface-900 mb-8">Approval Progress</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
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
           <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="text-sm font-medium text-surface-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <span className="text-sm font-medium text-surface-600">Pending</span>
              </div>
           </div>
        </div>

        <div className="card p-8 flex flex-col justify-center items-center text-center">
           <TrendingUp className="w-12 h-12 text-brand-600 mb-4" />
           <h3 className="text-2xl font-black text-surface-900 mb-2">94%</h3>
           <p className="text-surface-500 text-sm max-w-xs">Average student engagement growth this semester based on event turnout.</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

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
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Loader2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const BudgetOversight = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const { data } = await axios.get('/api/principal/budget-analytics');
        setData(data);
      } catch (err) {
        console.error('Failed to fetch budget data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgetData();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-sm text-surface-400 font-medium">Calculating financial metrics...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Budget Oversight</h1>
        <p className="text-surface-400 text-sm mt-0.5">Comprehensive financial analysis of event expenditures and club resource allocation.</p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-brand-900 text-white border-none shadow-brand-500/10">
           <div className="flex items-center gap-3 mb-4 text-brand-200">
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Total Requested</span>
           </div>
           <h3 className="text-3xl font-black mb-2">${data?.totalRequested?.toLocaleString() || 0}</h3>
           <div className="flex items-center gap-1.5 text-xs text-brand-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Institutional global demand</span>
           </div>
        </div>

        <div className="card">
           <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Total Approved</span>
           </div>
           <h3 className="text-3xl font-black mb-2 text-surface-900">${data?.totalApproved?.toLocaleString() || 0}</h3>
           <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>{Math.round((data?.totalApproved / data?.totalRequested) * 100) || 0}% Approval rate</span>
           </div>
        </div>

        <div className="card">
           <div className="flex items-center gap-3 mb-4 text-brand-600">
              <PieChartIcon className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Remaining Reserve</span>
           </div>
           <h3 className="text-3xl font-black mb-2 text-surface-900">${(data?.totalRequested - data?.totalApproved).toLocaleString()}</h3>
           <p className="text-xs text-surface-500 mt-1">Pending or declined capital</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Distribution by Club */}
        <div className="card p-8">
           <h3 className="text-lg font-bold text-surface-900 mb-8">Budget Allocation per Club</h3>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data?.distribution || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 600}} width={120} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                       {(data?.distribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Status Breakdown (Simplified as Budget per Status) */}
        <div className="card p-8">
           <h3 className="text-lg font-bold text-surface-900 mb-8">Capital Distribution</h3>
           <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={data?.distribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data?.distribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOversight;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Loader2,
  ShieldCheck,
  Mail
} from 'lucide-react';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClubs = async () => {
    try {
      const { data } = await axios.get('/api/admin/clubs');
      setClubs(data);
    } catch (err) {
      console.error('Error fetching clubs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club => 
    club.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Club Management</h1>
          <p className="text-surface-500 mt-1">Review club registrations and active student organizations.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search clubs..." 
            className="input-field pl-10 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header">Club Information</th>
              <th className="table-header">Faculty Coordinator</th>
              <th className="table-header">Registration Date</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map((club) => (
              <tr key={club.id} className="hover:bg-surface-50 transition-colors group">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold">
                      {club.club_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-surface-900">{club.club_name}</p>
                      <p className="text-xs text-surface-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {club.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                   <p className="text-sm text-surface-700 font-medium">{club.name}</p>
                </td>
                <td className="table-cell text-sm text-surface-500">
                  {new Date(club.created_at).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="table-cell text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-surface-400 hover:text-brand-600" title="View History">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-surface-400 hover:text-red-600" title="Deactivate">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClubs.length === 0 && (
          <div className="py-20 text-center text-surface-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p>No clubs matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;

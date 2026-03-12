import React, { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import type { UserRead } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MoreVertical, UserX, ChevronRight, ShieldCheck } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await userService.admin.listUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'System synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id: string) => {
    try {
      await userService.admin.promoteUser(id);
      fetchUsers();
    } catch (err: any) {
        alert(err.response?.data?.detail || 'Promotion sequence failed.');
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Authorize deactivation of this endpoint?')) return;
    try {
      await userService.admin.deactivateUser(id);
      fetchUsers();
    } catch (err: any) {
        alert(err.response?.data?.detail || 'Deactivation sequence failed.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-white dark:bg-black min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      <div className="shopstack-container py-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Admin</Link>
          <ChevronRight size={12} className="rotate-180" />
          <span>Endpoint Management</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">User Directory</h1>
            <p className="text-neutral-500 text-sm font-medium">Administrative control over all registered endpoints and identities.</p>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shopstack-input !pl-12 !py-2.5 !text-xs !w-64"
            />
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Endpoint</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Permissions</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-shopstack-black dark:text-white font-black text-xs">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-black uppercase tracking-tight text-shopstack-black dark:text-white">{u.username}</p>
                          <p className="text-[10px] font-medium text-neutral-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        u.role === 'admin' ? 'bg-shopstack-red/10 border-shopstack-red/20 text-shopstack-red' : 'bg-neutral-100 dark:bg-neutral-800 border-transparent text-neutral-500'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${u.is_active ? 'text-emerald-600' : 'text-red-600'}`}>
                          {u.is_active ? 'Active' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handlePromote(u.id)}
                            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-shopstack-red hover:bg-shopstack-red/5 transition-all border-none cursor-pointer"
                            title="Upgrade to Admin"
                          >
                            <ShieldCheck size={16} />
                          </button>
                        )}
                        {u.is_active && u.id !== currentUser?.id && (
                          <button 
                            onClick={() => handleDeactivate(u.id)}
                            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all border-none cursor-pointer"
                            title="Deactivate Identity"
                          >
                            <UserX size={16} />
                          </button>
                        )}
                        <button className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-shopstack-black dark:hover:text-white transition-all border-none cursor-pointer">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

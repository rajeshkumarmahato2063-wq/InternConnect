import React, { useState, useEffect } from 'react';
import { Users, Ban, ShieldCheck, CheckCircle, Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import { apiService } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const data = await apiService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    await apiService.toggleUserBlock(userId);
    loadUsers();
  };

  return (
    <DashboardLayout
      title="Platform User Moderation"
      subtitle="Manage registered student candidates, employer accounts, and active session permissions."
    >
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Platform User Directory
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading user database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">User Name & Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4">
                      <p className="font-bold text-white text-sm">{u.name}</p>
                      <p className="text-slate-400 text-[11px]">{u.email}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full font-bold uppercase text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          u.blocked
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(u.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                          u.blocked
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30'
                        }`}
                      >
                        {u.blocked ? 'Unblock User' : 'Block User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default UserManagement;

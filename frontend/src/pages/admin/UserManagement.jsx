import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Shield, MoreVertical, UserX, AlertCircle, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch system users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to permanently remove this user? This action cannot be undone.')) {
            try {
                await adminService.deleteUser(id);
                toast.success('User removed successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to remove user');
            }
        }
    };

    const handleToggleStatus = (id) => {
        // Implement status toggle in backend if needed
        toast.info('Status management logic being updated for real database.');
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'student': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'club_coordinator': return 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20';
            case 'faculty': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'admin': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">System Identity Mgt.</h1>
                    <p className="text-slate-400 mt-2 font-medium">Govern user access, roles, and ecosystem security.</p>
                </div>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                    <Shield className="w-4 h-4 mr-2" /> Global Authority
                </div>
            </header>

            <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Toolbar */}
                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-secondary w-4 h-4 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-14 pr-4 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-secondary/30 transition-all"
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all inline-flex">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Assigned Role</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Access Status</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Mgt. Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-5 px-6 md:px-8">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 font-black text-white ${u.status === 'blocked' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10'}`}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm line-clamp-1 transition-colors ${u.status === 'blocked' ? 'text-slate-400 line-through' : 'text-white group-hover:text-accent-secondary'}`}>{u.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 md:px-8 hidden sm:table-cell">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getRoleBadgeColor(u.role)}`}>
                                                {u.role?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 md:px-8 hidden md:table-cell">
                                            {u.isVerified ? (
                                                <div className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></div> Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-orange-400 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2"></div> Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-5 px-6 md:px-8 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-2 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center"
                                                >
                                                    <UserX className="w-3.5 h-3.5 sm:mr-1" /> <span className="hidden sm:inline">Remove</span>
                                                </button>
                                                <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-slate-400">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                {loading ? <Loader2 className="w-8 h-8 text-slate-500 animate-spin" /> : <AlertCircle className="w-8 h-8 text-slate-500" />}
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-white">{loading ? 'Accessing Secure Records...' : 'No Identities Found'}</p>
                                        <p className="text-sm font-medium text-slate-400 mt-1">{loading ? 'Please wait while we verify authority and fetch data.' : 'Adjust your search parameters to locate specific users.'}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

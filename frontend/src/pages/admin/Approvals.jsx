import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CheckCircle, XCircle, Search, Clock, Calendar, Users, AlertCircle, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';

const Approvals = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('events'); // 'events' | 'clubs'
    const [searchTerm, setSearchTerm] = useState('');

    const [pendingEvents, setPendingEvents] = useState([]);
    const [pendingClubs, setPendingClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingData();
    }, []);

    const fetchPendingData = async () => {
        setLoading(true);
        try {
            const [events, clubs] = await Promise.all([
                adminService.getPendingEvents(),
                adminService.getPendingClubs()
            ]);
            setPendingEvents(events);
            setPendingClubs(clubs);
        } catch (error) {
            console.error('Failed to fetch pending items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, type) => {
        try {
            if (type === 'events') {
                await adminService.updateEventStatus(id, 'approved');
                setPendingEvents(pendingEvents.filter(e => e._id !== id));
            } else {
                await adminService.updateClubStatus(id, 'approved');
                setPendingClubs(pendingClubs.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error('Failed to approve', error);
        }
    };

    const handleReject = async (id, type) => {
        try {
            if (type === 'events') {
                await adminService.updateEventStatus(id, 'rejected');
                setPendingEvents(pendingEvents.filter(e => e._id !== id));
            } else {
                await adminService.updateClubStatus(id, 'rejected');
                setPendingClubs(pendingClubs.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error('Failed to reject', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">System Approvals</h1>
                    <p className="text-slate-400 mt-2 font-medium">Review and authorize pending experiences and organizations.</p>
                </div>
            </header>

            <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Tabs & Search */}
                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`flex flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'events'
                                ? 'bg-accent-primary text-slate-900 shadow-lg shadow-accent-primary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            Pending Events <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[9px]">{pendingEvents.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('clubs')}
                            className={`flex flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'clubs'
                                ? 'bg-accent-secondary text-slate-900 shadow-lg shadow-accent-secondary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Users className="w-3.5 h-3.5 mr-2" />
                            Pending Clubs <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[9px]">{pendingClubs.length}</span>
                        </button>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-primary w-4 h-4 transition-colors" />
                        <input
                            type="text"
                            placeholder={`Search pending ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-14 pr-4 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Content Table */}
                <div className="overflow-x-auto relative z-10">
                    {activeTab === 'events' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Event Details</th>
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Target Date</th>
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Submitted</th>
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Authorization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingEvents.length > 0 ? (
                                    pendingEvents.filter(e => e.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((event) => (
                                        <tr key={event._id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                                            <td className="py-5 px-6 md:px-8">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center mr-4 border border-accent-primary/20 shrink-0">
                                                        <Calendar className="w-5 h-5 text-accent-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-accent-primary transition-colors">{event.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">By {event.clubName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 md:px-8 hidden sm:table-cell">
                                                <p className="text-sm font-medium text-slate-300">{new Date(event.date).toLocaleDateString()}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Cap: {event.capacity}</p>
                                            </td>
                                            <td className="py-5 px-6 md:px-8 hidden md:table-cell">
                                                <div className="flex items-center text-slate-400 text-sm font-medium">
                                                    <Clock className="w-3.5 h-3.5 mr-2" />
                                                    {new Date(event.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 md:px-8 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(event._id, 'events')}
                                                        className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-900 transition-all text-emerald-400 group/btn"
                                                    >
                                                        <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(event._id, 'events')}
                                                        className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-400 group/btn"
                                                    >
                                                        <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <p className="text-lg font-bold text-white">All Clear</p>
                                            <p className="text-sm font-medium text-slate-400 mt-1">No pending events require your authorization at this time.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Organization Info</th>
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Category</th>
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Submitted</th>
                                    <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Authorization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingClubs.length > 0 ? (
                                    pendingClubs.filter(c => c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((club) => (
                                        <tr key={club._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-5 px-6 md:px-8">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center mr-4 border border-accent-secondary/20 shrink-0">
                                                        <Users className="w-5 h-5 text-accent-secondary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-accent-secondary transition-colors">{club.user?.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Adv: {club.facultyInCharge?.name || "Pending"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 md:px-8 hidden sm:table-cell">
                                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                    {club.category}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 md:px-8 hidden md:table-cell">
                                                <div className="flex items-center text-slate-400 text-sm font-medium">
                                                    <Clock className="w-3.5 h-3.5 mr-2" />
                                                    {new Date(club.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 md:px-8 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(club._id, 'clubs')}
                                                        className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-900 transition-all text-emerald-400 group/btn"
                                                    >
                                                        <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(club._id, 'clubs')}
                                                        className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-400 group/btn"
                                                    >
                                                        <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <p className="text-lg font-bold text-white">All Clear</p>
                                            <p className="text-sm font-medium text-slate-400 mt-1">No pending organizations require your authorization at this time.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Approvals;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import peerTeachingService from '../services/peerTeachingService';
import { BookOpen, Users, Edit, Trash2, Loader2, Search, Filter, AlertCircle, Plus, LayoutDashboard, GraduationCap } from 'lucide-react';

const MentorPortal = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMySessions = async () => {
            try {
                const data = await peerTeachingService.getMySessions();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMySessions();
        }
    }, [user]);

    const filteredSessions = sessions.filter(s =>
        s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg text-slate-100 pb-20 relative overflow-hidden">
            {/* Background Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-accent-primary/20 rounded-xl border border-accent-primary/30">
                                <LayoutDashboard className="w-5 h-5 text-accent-primary" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-accent-primary">Management Console</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Professional <span className="text-gradient">Mentor Portal</span>
                        </h1>
                        <p className="text-slate-400 mt-3 font-medium text-lg">Oversee your clinical influence and student connections professionally.</p>
                    </div>
                    <Link
                        to="/mentor/upload-resource"
                        className="btn-accent"
                    >
                        <Plus className="w-5 h-5" />
                        Publish Content
                    </Link>
                </header>

                <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden">
                    <div className="p-6 md:p-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="relative w-full sm:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-primary w-4 h-4 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search your sessions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input pl-14 py-4"
                            />
                        </div>
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
                                <GraduationCap className="w-4 h-4 text-accent-secondary" />
                                <span className="text-sm font-bold text-white">{sessions.length} Classes</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Class Information</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Interests</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredSessions.length > 0 ? (
                                    filteredSessions.map((session) => (
                                        <tr key={session._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center">
                                                    <div className="w-16 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden mr-4 shrink-0">
                                                        {session.thumbnail ? (
                                                            <img src={session.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <BookOpen className="w-5 h-5 text-slate-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm group-hover:text-accent-primary transition-colors">{session.subject}</p>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{session.topic}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {session.category}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 text-accent-secondary mr-2" />
                                                    <span className="text-sm font-bold text-white">{session.interestedUsers?.length || 0}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${session.status === 'open'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                    }`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button className="p-2.5 bg-white text-[#0f172a] rounded-xl border border-[#0f172a]/10 hover:bg-gray-100 transition-all">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg border border-red-500/20 hover:bg-red-700 transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex justify-center mb-6">
                                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/10">
                                                    <AlertCircle className="w-10 h-10 text-slate-600" />
                                                </div>
                                            </div>
                                            <p className="text-xl font-black text-white">No Classes Located</p>
                                            <p className="text-sm font-medium text-slate-400 mt-2">Begin your influence by publishing your first academic session.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorPortal;

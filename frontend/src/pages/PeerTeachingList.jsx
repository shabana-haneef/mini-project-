import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import peerTeachingService from '../services/peerTeachingService';
import { BookOpen, User, Calendar, Users, LayoutDashboard, GraduationCap, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PeerTeachingList = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await peerTeachingService.getSessions();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleInterest = async (id) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        try {
            await peerTeachingService.expressInterest(id);
            toast.success('Interest registered! The mentor will be notified.');
            const data = await peerTeachingService.getSessions();
            setSessions(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to express interest.');
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg text-slate-100 pb-20 relative overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-accent-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-accent-secondary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="glass-morphism border-b border-white/5 relative z-10 w-full mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-full border border-accent-primary/20">Peer Academy</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center">
                                <div className="bg-accent-primary/20 p-3 rounded-2xl mr-4 border border-accent-primary/30">
                                    <GraduationCap className="w-8 h-8 text-accent-primary" />
                                </div>
                                Collaborative <span className="text-gradient ml-2">Space</span>
                            </h1>
                            <p className="mt-3 text-slate-200 font-medium text-lg">Nexus for student-led mentorship and academic growth.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {user && user.role === 'mentor' && (
                                <>
                                    <Link
                                        to="/mentor/dashboard"
                                        className="btn-secondary"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Mentor Portal
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sessions.map((session) => (
                            <div key={session._id} className="glass-morphism rounded-[2.5rem] border border-white/5 hover:border-accent-primary/30 transition-all duration-500 flex flex-col relative overflow-hidden group hover:-translate-y-2">
                                <div className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest backdrop-blur-md border ${session.type === 'offer' || session.type === 'class' ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/20' : 'bg-accent-secondary/20 text-accent-secondary border-accent-secondary/20'
                                    }`}>
                                    {session.type === 'offer' || session.type === 'class' ? 'Class' : 'Request'}
                                </div>

                                {/* Thumbnail Area */}
                                {(session.type === 'offer' || session.type === 'class') && (
                                    <div className="h-48 w-full relative overflow-hidden">
                                        {session.thumbnail ? (
                                            <img src={session.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
                                                <GraduationCap className="w-12 h-12 text-accent-primary/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-dark-bg/80 to-transparent"></div>
                                        <div className="absolute bottom-4 left-6">
                                            <span className="px-3 py-1 bg-accent-primary text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                {session.category || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 pt-6 flex flex-col flex-1">
                                    <div className="flex items-start mb-6">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                                            <BookOpen className="w-5 h-5 text-accent-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white line-clamp-1 tracking-tight">{session.subject}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{session.topic}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-300 line-clamp-3 mb-8 flex-1 text-sm font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                                        {session.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5 max-w-[60%] overflow-hidden">
                                            <User className="w-3 h-3 text-slate-400 mr-2 shrink-0" />
                                            <span className="text-[10px] font-bold text-slate-300 truncate">By <span className="text-white">{session.student?.name || 'Anonymous'}</span></span>
                                        </div>
                                        <div className="flex items-center text-accent-secondary space-x-1">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black">{session.interestedUsers?.length || 0} Interested</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleInterest(session._id)}
                                        disabled={user?._id === session.student?._id || session.interestedUsers?.includes(user?._id)}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${session.interestedUsers?.includes(user?._id)
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-text-primary text-white hover:bg-text-primary/90'
                                            }`}
                                    >
                                        {session.interestedUsers?.includes(user?._id) ? 'Interest Registered' : (session.type === 'offer' || session.type === 'class' ? 'Enroll Interest' : 'Offer Help')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 lg:py-32 glass-morphism rounded-[3rem] border border-dashed border-white/10 max-w-2xl mx-auto flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <BookOpen className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-white">No Sessions Found</h3>
                        <p className="text-slate-400 mt-2 font-medium">Be the first to create a new peer teaching opportunity.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeerTeachingList;

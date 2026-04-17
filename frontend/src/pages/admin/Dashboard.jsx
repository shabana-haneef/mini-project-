import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, CalendarRange, CheckSquare, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import clubService from '../../services/clubService';
import eventService from '../../services/eventService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Active Clubs', value: 0, icon: Building2, color: 'accent-secondary' },
        { label: 'Total Events', value: 0, icon: CalendarRange, color: 'emerald-500' }
    ]);
    const [pendingApprovals, setPendingApprovals] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [clubs, events, pendingE, pendingC] = await Promise.all([
                    clubService.getAllClubs(),
                    eventService.getEvents(),
                    adminService.getPendingEvents(),
                    adminService.getPendingClubs(),
                ]);

                setStats([
                    { label: 'Active Clubs', value: clubs?.length || 0, icon: Building2, color: 'accent-secondary' },
                    { label: 'Total Events', value: events?.length || 0, icon: CalendarRange, color: 'emerald-500' }
                ]);

                const formattedPending = [
                    ...pendingC.map(c => ({
                        id: c._id,
                        type: 'Club Request',
                        name: c.user?.name || 'Unknown Club',
                        urgency: 'high'
                    })),
                    ...pendingE.map(e => ({
                        id: e._id,
                        type: 'Event Request',
                        name: e.title,
                        urgency: 'medium'
                    }))
                ];
                setPendingApprovals(formattedPending);
            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        System Overview, <span className="text-emerald-500">{user?.name}</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Global platform analytics and administration controls.</p>
                </div>
                <div className="flex items-center text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 mr-2" /> System Healthy
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
                </div>
            ) : (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-morphism p-6 rounded-3xl flex items-center space-x-4 border border-white/5 hover:border-white/10 transition-colors">
                                <div className={`p-4 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white">{stat.value}</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pending Approvals Widget */}
                        <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h2 className="text-lg font-black text-white flex items-center">
                                    <CheckSquare className="w-5 h-5 mr-3 text-yellow-500" />
                                    Action Required
                                </h2>
                                <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                                    {pendingApprovals.length}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col space-y-4">
                                {pendingApprovals.map(approval => (
                                    <div key={approval.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex justify-between items-center group">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1 text-xs">
                                                <span className={`font-black uppercase tracking-wider ${approval.type.includes('Club') ? 'text-accent-secondary' : 'text-accent-primary'}`}>
                                                    {approval.type}
                                                </span>
                                                {approval.urgency === 'high' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                                            </div>
                                            <span className="font-bold text-white group-hover:text-accent-primary transition-colors">{approval.name}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors border border-white/10">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/admin/approvals" className="mt-4 text-center text-xs font-bold text-slate-400 hover:text-white transition-colors w-full border border-white/10 rounded-xl py-3 hover:bg-white/5">
                                    View All Requests
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;

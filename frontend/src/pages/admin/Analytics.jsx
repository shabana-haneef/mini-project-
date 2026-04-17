import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, Calendar, TrendingUp, Download, Filter } from 'lucide-react';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('month'); // 'week' | 'month' | 'year'

    // Mock data for charts
    const registrationData = [
        { name: 'Week 1', events: 12, users: 45 },
        { name: 'Week 2', events: 19, users: 65 },
        { name: 'Week 3', events: 15, users: 80 },
        { name: 'Week 4', events: 25, users: 110 },
    ];

    const eventCategoryData = [
        { name: 'Technology', value: 45 },
        { name: 'Business', value: 25 },
        { name: 'Arts', value: 15 },
        { name: 'Sports', value: 10 },
        { name: 'Other', value: 5 },
    ];

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#64748b'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
                    <p className="text-white font-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm font-medium flex items-center justify-between gap-4">
                            <span>{entry.name}:</span>
                            <span className="font-black">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">System Analytics</h1>
                    <p className="text-slate-400 mt-2 font-medium">Platform engagement and growth metrics.</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 outline-none cursor-pointer appearance-none"
                    >
                        <option value="week">Past Week</option>
                        <option value="month">Past Month</option>
                        <option value="year">Past Year</option>
                    </select>
                    <button className="flex items-center justify-center px-4 py-2.5 bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent-primary hover:text-slate-900 transition-all shadow-lg shadow-accent-primary/5">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
            </header>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-morphism rounded-4xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Users</p>
                            <h3 className="text-3xl font-black text-white">2,845</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 relative z-10">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12% this month
                    </div>
                </div>

                <div className="glass-morphism rounded-4xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Clubs</p>
                            <h3 className="text-3xl font-black text-white">48</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 relative z-10">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> +3 new this month
                    </div>
                </div>

                <div className="glass-morphism rounded-4xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Events Hosted</p>
                            <h3 className="text-3xl font-black text-white">312</h3>
                        </div>
                        <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 relative z-10">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> +24% vs last period
                    </div>
                </div>

                <div className="glass-morphism rounded-4xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Engagement Rate</p>
                            <h3 className="text-3xl font-black text-white">68%</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 relative z-10">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> +5% vs last period
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Activity Chart */}
                <div className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border border-white/10 lg:col-span-2 relative z-10">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center">
                        Platform Growth
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={registrationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border border-white/10 relative z-10 flex flex-col">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center">
                        Event Distribution
                    </h3>
                    <div className="h-64 w-full grow relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={eventCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {eventCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-white">312</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Events</span>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                        {eventCategoryData.slice(0, 3).map((category, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center text-sm font-bold text-slate-300">
                                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[idx] }}></div>
                                    {category.name}
                                </div>
                                <span className="text-sm font-black text-white">{category.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed (Text-based metrics) */}
            <div className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border border-white/10 relative z-10">
                <h3 className="text-lg font-black text-white mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <span>Performance Highlights</span>
                    <button className="text-xs font-bold text-accent-primary hover:text-white transition-colors">View All Reports</button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <h4 className="text-sm font-black text-white mb-2">Top Performing Club</h4>
                        <p className="text-2xl font-black text-blue-400 mb-1">Nexus Computing</p>
                        <p className="text-xs font-bold text-slate-400">42 events hosted, 95% registration rate</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <h4 className="text-sm font-black text-white mb-2">Most Popular Event Type</h4>
                        <p className="text-2xl font-black text-purple-400 mb-1">Hackathons</p>
                        <p className="text-xs font-bold text-slate-400">Avg. 150+ attendees per session</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <h4 className="text-sm font-black text-white mb-2">Peer Teaching Growth</h4>
                        <p className="text-2xl font-black text-emerald-400 mb-1">340 Hours</p>
                        <p className="text-xs font-bold text-slate-400">Logged mentoring sessions this term</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Upload, Eye, Download, FileVideo, FileText, Presentation, BookOpen, Clock, TrendingUp, BarChart3, Trash2, Heart, MessageSquare, Star } from 'lucide-react';
import academicService from '../../services/academicService';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const CONTENT_TYPE_LABELS = {
    video: 'Video',
    notes: 'Notes / PDF',
    ppt: 'Presentation',
    paper: 'Question Paper',
};

const CONTENT_TYPE_ICONS = {
    video: FileVideo,
    notes: FileText,
    ppt: Presentation,
    paper: BookOpen,
};

const MentorAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await academicService.getMentorAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error('Analytics fetch error:', err);
                setError('Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 object-contain">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Are you sure you want to delete this resource?<br/>
                    <span className="text-xs text-red-500 font-bold">This action cannot be undone.</span>
                </p>
                <div className="flex gap-2">
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await academicService.deleteContent(id);
                                setAnalytics(prev => ({
                                    ...prev,
                                    totalUploads: prev.totalUploads - 1,
                                    resources: prev.resources.filter(r => r._id !== id)
                                }));
                                toast.success("Content deleted successfully");
                            } catch (err) {
                                console.error("Error deleting content", err);
                                toast.error("Failed to delete content. Please try again.");
                            }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                        Yes, Delete
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
                    <p className="text-white font-bold text-sm">{payload[0].name}: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-red-400">
            <p>{error}</p>
        </div>
    );

    const {
        totalUploads = 0,
        totalViews = 0,
        totalDownloads = 0,
        totalLikes = 0,
        totalComments = 0,
        avgRatingGlobal = 0,
        totalVideos = 0,
        totalDocuments = 0,
        contentTypeBreakdown = {},
        resources = [],
    } = analytics || {};

    // Prepare pie chart data from real content type breakdown
    const pieData = Object.entries(contentTypeBreakdown).map(([key, value]) => ({
        name: CONTENT_TYPE_LABELS[key] || key,
        value,
    }));

    const statCards = [
        { label: 'Total Uploads', value: totalUploads, icon: Upload, color: 'blue' },
        { label: 'Total Views', value: totalViews, icon: Eye, color: 'purple' },
        { label: 'Downloads', value: totalDownloads, icon: Download, color: 'emerald' },
        { label: 'Likes', value: totalLikes, icon: Heart, color: 'rose' },
        { label: 'Comments', value: totalComments, icon: MessageSquare, color: 'amber' },
        { label: 'Avg Rating', value: avgRatingGlobal, icon: Star, color: 'yellow' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <BarChart3 className="text-blue-400" size={28} />
                    Mentor Analytics
                </h1>
                <p className="text-slate-400 mt-2 font-medium">Real-time performance metrics for your uploaded content.</p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="glass-morphism rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${card.color}-500/10 rounded-full blur-2xl group-hover:bg-${card.color}-500/20 transition-colors`}></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                                    <h3 className="text-3xl font-black text-white">{card.value.toLocaleString()}</h3>
                                </div>
                                <div className={`p-3 bg-${card.color}-500/10 rounded-xl border border-${card.color}-500/20 text-${card.color}-400`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts + Summary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Content Type Distribution Pie Chart */}
                <div className="glass-morphism rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col">
                    <h3 className="text-lg font-black text-white mb-6">Content Distribution</h3>
                    {pieData.length > 0 ? (
                        <>
                            <div className="h-56 w-full relative flex items-center justify-center">
                                <ResponsiveContainer width="99%" height={224}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-white">{totalUploads}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                                {pieData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center text-sm font-bold text-slate-300">
                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            {item.name}
                                        </div>
                                        <span className="text-sm font-black text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                            No content uploaded yet.
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-morphism rounded-3xl p-6 border border-white/10">
                            <h4 className="text-sm font-black text-white mb-2">Documents Uploaded</h4>
                            <p className="text-3xl font-black text-purple-400 mb-1">{totalDocuments}</p>
                            <p className="text-xs font-bold text-slate-400">Notes, PPTs, and Question Papers</p>
                        </div>
                        <div className="glass-morphism rounded-3xl p-6 border border-white/10">
                            <h4 className="text-sm font-black text-white mb-2">Videos Uploaded</h4>
                            <p className="text-3xl font-black text-blue-400 mb-1">{totalVideos}</p>
                            <p className="text-xs font-bold text-slate-400">Recorded classes and tutorials</p>
                        </div>
                    </div>

                    {/* Engagement summary */}
                    <div className="glass-morphism rounded-3xl p-6 border border-white/10">
                        <h4 className="text-sm font-black text-white mb-3">Engagement Summary</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-black text-white">{totalUploads}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Uploads</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">{totalViews}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Views</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">{totalDownloads}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Downloads</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Per-Resource Table */}
            <div className="glass-morphism rounded-3xl p-6 md:p-8 border border-white/10">
                <h3 className="text-lg font-black text-white mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <span>Resource-Level Analytics</span>
                    <span className="text-xs font-bold text-slate-500">{resources.length} resources</span>
                </h3>
                {resources.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/10">
                                    <th className="text-left py-3 pr-4">Title</th>
                                    <th className="text-left py-3 pr-4">Type</th>
                                    <th className="text-left py-3 pr-4">Upload Date</th>
                                    <th className="text-right py-3 pr-4">Views</th>
                                    <th className="text-right py-3 pr-4">Downloads</th>
                                    <th className="text-right py-3 pr-4">Likes</th>
                                    <th className="text-right py-3 pr-4">Comments</th>
                                    <th className="text-right py-3 pr-4">Rating</th>
                                    <th className="text-right py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((r) => {
                                    const TypeIcon = CONTENT_TYPE_ICONS[r.contentType] || FileText;
                                    return (
                                        <tr key={r._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                            <td className="py-4 pr-4">
                                                <span className="text-white font-semibold">{r.title}</span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="flex items-center gap-1.5 text-slate-400">
                                                    <TypeIcon size={14} />
                                                    {CONTENT_TYPE_LABELS[r.contentType] || r.contentType}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="flex items-center gap-1.5 text-slate-400">
                                                    <Clock size={12} />
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4 text-right">
                                                <span className="flex items-center justify-end gap-1.5 text-white font-bold">
                                                    <Eye size={14} className="text-purple-400" />
                                                    {r.views}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <span className="flex items-center justify-end gap-1.5 text-white font-bold">
                                                    <Download size={14} className="text-emerald-400" />
                                                    {r.downloads}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <span className="flex items-center justify-end gap-1.5 text-white font-bold">
                                                    <Heart size={14} className="text-rose-400" />
                                                    {r.likes}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <span className="flex items-center justify-end gap-1.5 text-white font-bold">
                                                    <MessageSquare size={14} className="text-amber-400" />
                                                    {r.comments}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <span className="flex items-center justify-end gap-1.5 text-white font-bold">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                    {r.avgRating}
                                                    <span className="text-[10px] text-slate-500 font-normal">({r.ratingCount})</span>
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(r._id)}
                                                    className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 transition-colors ml-auto"
                                                    title="Delete Resource"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <BookOpen size={48} className="text-gray-700 mb-4" />
                        <h4 className="text-white font-medium mb-1">No resources yet</h4>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Upload your first resource to start seeing analytics data here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorAnalytics;

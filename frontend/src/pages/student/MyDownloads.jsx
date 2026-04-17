import React, { useState, useEffect } from 'react';
import academicService from '../../services/academicService';
import { Download, Trash2, FileText, PlayCircle, BookOpen, Loader2, ChevronLeft, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyDownloads = () => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDownloads();
    }, []);

    const fetchDownloads = async () => {
        try {
            const data = await academicService.getMyDownloads();
            setDownloads(data);
        } catch (error) {
            console.error('Failed to fetch downloads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Remove this item from your personal downloads list? (Original content will not be deleted)')) return;

        try {
            await academicService.removeDownload(id);
            setDownloads(prev => prev.filter(d => d._id !== id));
        } catch (error) {
            console.error('Failed to remove download:', error);
            toast.error('Failed to remove from list');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg">
            <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg text-slate-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-bold uppercase tracking-widest"
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center">
                            <Download className="w-10 h-10 mr-4 text-accent-primary" />
                            My <span className="text-accent-primary ml-2">Downloads</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Your personal library of saved academic resources.</p>
                    </div>
                </header>

                {downloads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {downloads.map((item) => {
                            const content = item.content;
                            if (!content) return null;

                            return (
                                <div
                                    key={item._id}
                                    onClick={() => navigate(`/student/content/${content._id}`)}
                                    className="glass-morphism rounded-3xl border border-white/5 overflow-hidden group hover:border-accent-primary/30 transition-all cursor-pointer flex flex-col"
                                >
                                    <div className="aspect-video bg-white/5 relative flex items-center justify-center">
                                        {content.contentType === 'video' ? (
                                            <PlayCircle size={48} className="text-slate-700 group-hover:text-accent-primary transition-colors" />
                                        ) : (
                                            <FileText size={48} className="text-slate-700 group-hover:text-accent-secondary transition-colors" />
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={(e) => handleRemove(e, item._id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl backdrop-blur-md border border-red-500/20 transition-all"
                                                title="Remove from my downloads"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                                                {content.contentType}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg group-hover:text-accent-primary transition-colors line-clamp-1">
                                                {content.title}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">
                                                By {content.mentor?.name || 'Academic Mentor'}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                Saved on {new Date(item.downloadDate).toLocaleDateString()}
                                            </span>
                                            <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-morphism rounded-[3rem] border border-dashed border-white/10 max-w-2xl mx-auto flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Download className="w-8 h-8 text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-black text-white">No downloads saved</h3>
                        <p className="text-slate-400 mt-2 font-medium">Browse the Academic Portal to save helpful resources.</p>
                        <Link
                            to="/student/resources"
                            className="mt-8 px-8 py-3 bg-linear-to-r from-accent-primary to-accent-secondary text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all"
                        >
                            Explore Portal
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDownloads;

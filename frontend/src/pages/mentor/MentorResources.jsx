import React, { useState, useEffect } from 'react';
import academicService from '../../services/academicService';
import { Search, Filter, BookOpen, Clock, Users, PlayCircle, FileText, Layout, Eye, Download, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const MentorResources = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMentorContent = async () => {
            if (!user?._id) return;
            try {
                // Fetch ALL resources uploaded by this specific mentor. No other filters.
                const data = await academicService.searchContent({ mentor: user._id });
                setContents(data);
            } catch (err) {
                console.error("Error fetching mentor content", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMentorContent();
    }, [user]);

    const handleDownload = (e, content) => {
        if (e) e.stopPropagation();

        academicService.trackDownload(content._id).catch(err => console.error("Tracking error", err));

        const dlUrl = content.fileUrl;
        if (!dlUrl) {
            toast.error("File unavailable. Please contact support.");
            return;
        }

        const link = document.createElement('a');
        link.href = dlUrl;

        let ext = '';
        if (content.contentType === 'video') ext = '.mp4';
        else if (content.contentType === 'ppt') ext = '.ppt';
        else if (content.contentType === 'pdf') ext = '.pdf';

        const title = content.title ? content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'download';

        link.setAttribute('download', `${title}${ext}`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setContents(prev => prev.map(c => c._id === content._id ? { ...c, downloads: (c.downloads || 0) + 1 } : c));
    };

    const handleDelete = (e, id) => {
        if (e) e.stopPropagation();
        
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
                                setContents(prev => prev.filter(c => c._id !== id));
                                toast.success("Content removed successfully");
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

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    My Published <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Resources</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Manage and view all the academic resources you have published to the platform.
                </p>
            </header>

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">All Uploads</h2>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                            {contents.length} Total Materials
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : contents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contents.map((content) => (
                            <div
                                key={content._id}
                                onClick={() => navigate(`/mentor/content/${content._id}`)}
                                className="glass rounded-2xl border border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer flex flex-col h-full"
                            >
                                <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                    {content.contentType === 'video' ? (
                                        <PlayCircle size={48} className="text-white/20 group-hover:text-blue-500 transition-colors" />
                                    ) : (
                                        <FileText size={48} className="text-white/20 group-hover:text-purple-500 transition-colors" />
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white">
                                            {content.contentType}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                                        {content.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">
                                        {content.description || 'No description provided.'}
                                    </p>

                                    <div className="space-y-4 mt-auto">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    <span>{new Date(content.createdAt || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1" title="Views"><Eye size={12} /> {content.views || 0}</span>
                                                    <span className="flex items-center gap-1" title="Downloads"><Download size={12} /> {content.downloads || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/mentor/content/${content._id}`); }}
                                                className="flex-1 btn-glass py-2 px-2 text-xs bg-white/5 hover:bg-white/10 text-white font-medium flex justify-center items-center gap-1.5"
                                            >
                                                {content.contentType === 'video' ? <><PlayCircle size={14} /> Watch Video</> : <><Eye size={14} /> View</>}
                                            </button>
                                            {content.fileUrl && user?.role !== 'superadmin' && (
                                                <button
                                                    onClick={(e) => handleDownload(e, content)}
                                                    className="flex-1 btn-secondary py-2 px-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium border-0 flex justify-center items-center gap-1.5"
                                                >
                                                    <Download size={14} />
                                                    Download
                                                </button>
                                            )}
                                            {user?.role !== 'superadmin' && (
                                                <button
                                                    onClick={(e) => handleDelete(e, content._id)}
                                                    className="flex-none p-2 text-xs bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 font-medium rounded-xl border border-red-500/20 flex justify-center items-center transition-colors shadow-lg"
                                                    title="Delete Resource"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-center glass rounded-3xl border border-white/5">
                        <BookOpen size={64} className="text-gray-700 mb-4" />
                        <h3 className="text-white font-medium mb-1">No content yet</h3>
                        <p className="text-gray-500 text-sm max-w-xs">You haven't uploaded any study materials yet.</p>
                        {user?.role !== 'superadmin' && (
                            <button
                                onClick={() => navigate('/mentor/upload-resource')}
                                className="mt-6 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30"
                            >
                                Upload Content
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MentorResources;

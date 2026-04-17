import React, { useState, useEffect } from 'react';
import AcademicNavigator from '../../components/mentor/AcademicNavigator';
import academicService from '../../services/academicService';
import { Search, Filter, BookOpen, Clock, Users, PlayCircle, FileText, Layout, Eye, Download, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AcademicPortal = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch all content by default on component mount
    useEffect(() => {
        const fetchInitialContent = async () => {
            setLoading(true);
            try {
                const data = await academicService.searchContent({});
                setContents(data);
                setSelectedSubject(null); // Ensure no subject filter is active natively
            } catch (err) {
                console.error("Error fetching initial public content", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialContent();
    }, []);

    const handleSubjectSelect = async (subject) => {
        setSelectedSubject(subject);
        setShowFilters(false);
        setLoading(true);
        try {
            const data = await academicService.getSubjectContent(subject._id);
            setContents(data);
        } catch (err) {
            console.error("Error fetching subject content", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (e, content) => {
        if (e) e.stopPropagation();

        // Track async without blocking the execution
        academicService.trackDownload(content._id)
            .then(() => {
                // Optional: You could show a toast here in a real app
                console.log("Added to your downloads list");
            })
            .catch(err => console.error("Tracking error", err));

        const dlUrl = content.fileUrl;
        if (!dlUrl) {
            toast.error("File unavailable. Please contact the mentor.");
            return;
        }

        const link = document.createElement('a');
        link.href = dlUrl;

        // Ensure browser forces standard download behavior through target blank + download attr
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

        // Optimistically update the download count in the UI
        setContents(prev => prev.map(c => c._id === content._id ? { ...c, downloads: (c.downloads || 0) + 1 } : c));
    };

    const handleDelete = async (e, id) => {
        if (e) e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
            try {
                await academicService.deleteContent(id);
                setContents(prev => prev.filter(c => c._id !== id));
            } catch (err) {
                console.error("Error deleting content", err);
                toast.error("Failed to delete content. Please try again.");
            }
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Academic <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Portal</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Discover curriculum-specific recorded classes, notes, and study materials curated by verified mentors.
                </p>
            </header>

            <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Resource Filters</h2>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all font-bold text-sm border border-blue-500/20"
                >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {showFilters && (
                <section className="glass p-8 rounded-3xl border border-white/5 shadow-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <AcademicNavigator onSubjectSelect={handleSubjectSelect} />
                </section>
            )}

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {selectedSubject ? selectedSubject.subjectName : "All Available Resources"}
                        </h2>
                        {selectedSubject && (
                            <p className="text-gray-400 font-mono text-sm">
                                {selectedSubject.subjectCode} • {selectedSubject.scheme}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {selectedSubject && (
                            <button
                                onClick={() => {
                                    setSelectedSubject(null);
                                    setLoading(true);
                                    academicService.searchContent({})
                                        .then(setContents)
                                        .catch(err => console.error(err))
                                        .finally(() => setLoading(false));
                                }}
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                            {contents.length} Materials Available
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
                                onClick={() => navigate(`/student/content/${content._id}`)}
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
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <div className="bg-gray-800 p-1 rounded-full text-blue-400">
                                                    <Users size={12} />
                                                </div>
                                                <span className="truncate">By {content.mentor?.name || 'Academic Mentor'}</span>
                                            </div>
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
                                                onClick={(e) => { e.stopPropagation(); navigate(`/student/content/${content._id}`); }}
                                                className="flex-1 btn-glass py-2 px-2 text-xs bg-white/5 hover:bg-white/10 text-white font-medium flex justify-center items-center gap-1.5"
                                            >
                                                {content.contentType === 'video' ? <><PlayCircle size={14} /> Watch Video</> : <><Eye size={14} /> View</>}
                                            </button>
                                            {content.fileUrl && (
                                                <button
                                                    onClick={(e) => handleDownload(e, content)}
                                                    className="flex-1 btn-secondary py-2 px-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium border-0 flex justify-center items-center gap-1.5"
                                                >
                                                    <Download size={14} />
                                                    Download {content.contentType === 'video' ? 'MP4' : content.contentType === 'ppt' ? 'PPT' : 'PDF'}
                                                </button>
                                            )}
                                            {(content.mentor?._id === user?._id || content.mentor === user?._id) && (
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
                        <p className="text-gray-500 text-sm max-w-xs">There are no study materials uploaded for this subject yet. Check back soon!</p>
                    </div>
                )}
            </section>
        </div >
    );
};

export default AcademicPortal;

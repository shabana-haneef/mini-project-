import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    PlayCircle,
    FileText,
    Download,
    MessageSquare,
    Star,
    Share2,
    ThumbsUp,
    ChevronLeft,
    Clock,
    Eye,
    User,
    Trash2,
    BookOpen,
    Heart
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import academicService from '../../services/academicService';
import { useAuth } from '../../context/AuthContext';

const ClassViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const { user } = useAuth();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this content?')) return;
        try {
            await academicService.deleteContent(id);
            navigate('/mentor/dashboard');
        } catch (err) {
            console.error('Delete error', err);
            toast.error('Failed to delete content');
        }
    };

    // Helper to get a secure download URL from Cloudinary with proper resource path
    const getCorrectUrl = (url) => {
        if (!url) return '';
        let corrected = url;
        const lowUrl = url.toLowerCase();
        const docExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
        const isDoc = docExtensions.some(ext => lowUrl.endsWith(ext));

        // Force /raw/upload/ for documents to avoid MIME conflicts
        // This resolves ERR_INVALID_RESPONSE by ensuring proper MIME-type mapping
        if (isDoc) {
            if (corrected.includes('/image/upload/')) {
                corrected = corrected.replace('/image/upload/', '/raw/upload/');
            } else if (corrected.includes('/video/upload/')) {
                corrected = corrected.replace('/video/upload/', '/raw/upload/');
            }
        }
        return corrected;
    };

    const getDownloadUrl = (url) => {
        let corrected = getCorrectUrl(url);
        if (!corrected) return '';

        if (corrected.includes('cloudinary.com')) {
            // CRITICAL: fl_attachment is NOT supported for /raw/ resources and causes ERR_INVALID_RESPONSE
            // We only apply it to image/video types represented by /upload/ (auto/image/video)
            const isRaw = corrected.includes('/raw/upload/');

            if (!isRaw && corrected.includes('/upload/')) {
                // Ensure we don't double up flags
                if (!corrected.includes('/fl_attachment/')) {
                    return corrected.replace('/upload/', '/upload/fl_attachment/');
                }
            }
        }
        return corrected;
    };

    const handleDownload = (e) => {
        if (e) e.preventDefault();

        // Track async without blocking the execution
        academicService.trackDownload(id)
            .then(() => console.log("Added to your downloads list"))
            .catch(err => console.error("Tracking error", err));

        const url = content.fileUrl;
        if (!url) {
            toast.error("File unavailable. Please contact the mentor.");
            return;
        }

        let dlUrl = url;
        const isDoc = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'].some(ext => dlUrl.toLowerCase().endsWith(ext));

        if (isDoc) {
            dlUrl = dlUrl.replace('/image/upload/', '/raw/upload/').replace('/video/upload/', '/raw/upload/');
        }
        if (!isDoc && dlUrl.includes('/upload/') && !dlUrl.includes('/fl_attachment/')) {
            dlUrl = dlUrl.replace('/upload/', '/upload/fl_attachment/');
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

        setContent(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
    };

    const getGoogleViewerUrl = (url) => {
        const corrected = getCorrectUrl(url);
        return `https://docs.google.com/viewer?url=${encodeURIComponent(corrected)}&embedded=true`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, we'd have a getById endpoint
                const response = await axios.get('/api/academic-content/search');
                const item = response.data.find(c => c._id === id);
                setContent(item);
                setComments(item?.comments || []);
                
                // Find user's existing rating
                if (user && item?.ratings) {
                    const existing = item.ratings.find(r => r.user.toString() === user._id.toString());
                    if (existing) setUserRating(existing.rating);
                }
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const updatedComments = await academicService.addComment(id, comment);
            setComments(updatedComments);
            setComment('');
        } catch (err) {
            console.error("Comment error", err);
            toast.error("Only students can post comments");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete your comment?")) return;
        try {
            await academicService.deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error("Delete comment error", err);
            toast.error("Failed to delete comment");
        }
    };

    const handleRating = async (newRating) => {
        if (!user) return toast.error("Please login to rate");
        if (user.role !== 'student') return toast.error("Only students can rate resources");
        
        try {
            const res = await academicService.rateContent(id, newRating);
            setUserRating(newRating);
            // Optionally update content with new ratings list
            if (res.ratings) {
                setContent(prev => ({ ...prev, ratings: res.ratings }));
            }
        } catch (err) {
            console.error("Rating error", err);
            toast.error("Failed to save rating");
        }
    };
    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!content) return (
        <div className="p-8 text-center text-white">
            <p className="text-xl">Content not found</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-400 hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Top Navigation */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-40">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Portal
                </button>
                <div className="flex gap-4">
                    <button className="p-2 glass rounded-full hover:bg-white/10 text-gray-400 transition-all">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Main Content Area */}
                <div className="lg:col-span-2 p-4 md:p-8 space-y-8 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
                    {/* Media Player Container */}
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5">
                        {content.youtubeUrl ? (
                            <iframe
                                className="w-full h-full"
                                src={content.youtubeUrl}
                                title={content.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            // Render preview based on content type
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-900 p-4">
                                {(() => {
                                    const url = content.fileUrl;
                                    // Determine type: use explicit contentType or fallback to file extension
                                    const type = content.contentType || (url ? url.split('.').pop().toLowerCase() : '');
                                    if (type === 'video') {
                                        return (
                                            <video controls className="w-full h-full max-h-[500px] rounded-lg">
                                                <source src={url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    } else if (type === 'pdf') {
                                        const correctedUrl = getCorrectUrl(url);
                                        return (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 space-y-4">
                                                <div className="w-full h-full relative group min-h-[500px] md:min-h-[600px] flex flex-col">
                                                    {/* Desktop: Direct Iframe with reliable source */}
                                                    <iframe
                                                        src={correctedUrl}
                                                        className="w-full grow border-none rounded-2xl hidden md:block"
                                                        title="PDF Preview"
                                                    />

                                                    {/* Mobile & Fail-safe Experience */}
                                                    <div className="md:hidden flex flex-col items-center justify-center p-8 text-center space-y-6 grow">
                                                        <div className="w-16 h-16 bg-blue-600/20 rounded-4xl flex items-center justify-center text-blue-500 mx-auto">
                                                            <FileText size={32} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg mb-2">Secure PDF Preview</h3>
                                                            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-1">Preview blocked by current network (ERR_INVALID_RESPONSE).</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Tip: If using Public WiFi, try a Hotspot or use the Google Viewer below.</p>
                                                        </div>
                                                        <div className="flex flex-col w-full gap-3">
                                                            <a
                                                                href={correctedUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => {
                                                                    academicService.trackDownload(id)
                                                                        .then(() => console.log("Added to your downloads"))
                                                                        .catch(err => console.error(err));
                                                                    setContent(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
                                                                }}
                                                                className="btn-secondary py-3.5 px-8 flex justify-center items-center gap-2"
                                                            >
                                                                <Eye size={18} />
                                                                View Full PDF
                                                            </a>
                                                            <a
                                                                href={getGoogleViewerUrl(correctedUrl)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => {
                                                                    academicService.trackDownload(id)
                                                                        .then(() => console.log("Added to your downloads"))
                                                                        .catch(err => console.error(err));
                                                                    setContent(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
                                                                }}
                                                                className="btn-glass py-3.5 px-8 flex justify-center items-center gap-2"
                                                            >
                                                                <BookOpen size={18} />
                                                                Google Viewer Fallback
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Desktop Secondary Action */}
                                                    <div className="hidden md:flex justify-end mt-4">
                                                        <a
                                                            href={getGoogleViewerUrl(correctedUrl)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <Eye size={14} />
                                                            Preview not loading? Try Google Docs Viewer
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {
                                        return <img src={url} alt={content.title} className="max-w-full max-h-[500px] object-contain" />;
                                    } else {
                                        return (
                                            <>
                                                <FileText size={64} className="text-gray-700" />
                                                <div className="text-center">
                                                    <p className="text-white font-medium">Study Materials: {content.title}</p>
                                                    <p className="text-sm text-gray-500">Preview not available for this file type.</p>
                                                    <button
                                                        onClick={handleDownload}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all"
                                                    >
                                                        <Download size={20} />
                                                        Download {content.contentType === 'video' ? 'MP4' : content.contentType === 'ppt' ? 'PPT' : 'PDF'}
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] uppercase font-bold tracking-widest border border-blue-500/20">
                                        {content.contentType}
                                    </span>
                                    <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded-md text-[10px] uppercase font-bold tracking-widest border border-white/5">
                                        {content.academicId?.subjectCode}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">{content.title}</h1>
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Eye size={16} />
                                        {content.views} Views
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Clock size={16} />
                                        Published on {new Date(content.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={async () => {
                                        if (!user) return toast.error("Please login to like");
                                        try {
                                            const res = await academicService.toggleLike(id);
                                            setContent(prev => ({ ...prev, likes: res.likes }));
                                        } catch(err) { console.error(err); }
                                    }}
                                    className={`btn-secondary py-2.5 px-5 font-bold transition-colors ${
                                        content.likes?.includes(user?._id) 
                                        ? 'bg-rose-500 hover:bg-rose-600 text-white border-transparent' 
                                        : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-200'
                                    }`}
                                >
                                    <Heart size={18} className={content.likes?.includes(user?._id) ? 'fill-current' : ''} />
                                    {content.likes?.length || 0} {content.likes?.length === 1 ? 'Like' : 'Likes'}
                                </button>
                                {user && (user.role === 'admin' || (user.role === 'mentor' && user._id === content.mentor?._id)) && (
                                    <button
                                        onClick={handleDelete}
                                        className="btn-danger py-2.5 px-5"
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                )}
                                {content.fileUrl && (
                                    <button
                                        onClick={handleDownload}
                                        className="btn-secondary py-2.5 px-5 bg-blue-600 hover:bg-blue-500 border-0 text-white"
                                    >
                                        <Download size={18} />
                                        Download {content.contentType === 'video' ? 'MP4' : content.contentType === 'ppt' ? 'PPT' : 'PDF'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                                {content.description}
                            </p>
                            {content.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {content.tags.map(tag => (
                                        <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 italic">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Mentor Info & Comments */}
                <div className="bg-[#0f0f0f] border-l border-white/5 p-6 space-y-8 h-[calc(100vh-64px)] overflow-y-auto">
                    {/* Mentor Profile */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Mentor</h3>
                        <div className="flex items-center justify-between gap-4 glass p-4 rounded-2xl border border-white/5 group cursor-pointer hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg overflow-hidden border border-blue-500/20">
                                    {content.mentor?.profilePicture ? (
                                        <img src={content.mentor.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                                        {content.mentor?.name || 'Academic Mentor'}
                                    </h4>
                                    <p className="text-xs text-gray-500">Verified Academic Mentor</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <MessageSquare size={16} />
                                Discussion
                            </h3>
                            <span className="text-xs text-gray-600 font-mono">{comments.length} Comments</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-800 shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder={user?.role === 'student' ? 'Add a comment...' : 'Only students can comment'}
                                        disabled={user?.role !== 'student'}
                                        className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none disabled:opacity-50"
                                        rows="1"
                                    ></textarea>
                                    {comment && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setComment('')}
                                                className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCommentSubmit}
                                                className="btn-accent py-1.5 px-4 text-[10px]"
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Real Comments */}
                            <div className="space-y-6 pt-4">
                                {comments.length > 0 ? (
                                    comments.map((c) => (
                                        <div key={c._id} className="flex gap-3 group/comment">
                                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase overflow-hidden shrink-0">
                                                {c.user?.profilePicture ? (
                                                    <img src={c.user.profilePicture} alt={c.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    c.user?.name?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-white">{c.user?.name || 'User'}</span>
                                                        <span className="text-[10px] text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                                                    {c.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center space-y-2">
                                        <p className="text-sm text-white font-medium">No comments yet</p>
                                        <p className="text-xs text-gray-500">Be the first to start the discussion!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Rate this content</h3>
                            {content.ratings?.length > 0 && (
                                <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                                    {(content.ratings.reduce((s, r) => s + r.rating, 0) / content.ratings.length).toFixed(1)} Avg
                                </span>
                            )}
                        </div>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <button 
                                    key={i} 
                                    onMouseEnter={() => setHoverRating(i)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleRating(i)}
                                    className={`transition-all duration-300 transform hover:scale-125 ${
                                        (hoverRating || userRating) >= i 
                                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' 
                                        : 'text-gray-700'
                                    }`}
                                >
                                    <Star 
                                        size={32} 
                                        fill={(hoverRating || userRating) >= i ? "currentColor" : "none"} 
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-600 text-center uppercase tracking-tighter">Your feedback helps mentors improve</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassViewer;

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Calendar, AlertCircle, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import activityService from '../../services/activityService';
import toast from 'react-hot-toast';

const NotificationPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', description: '', type: 'announcement' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await activityService.getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await activityService.createPost(newPost);
            setShowCreateModal(false);
            setNewPost({ title: '', description: '', type: 'announcement' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await activityService.deletePost(id);
                setPosts(posts.filter(p => p._id !== id));
            } catch (error) {
                console.error('Failed to delete post:', error);
                toast.error(error.response?.data?.message || 'Failed to delete post');
            }
        }
    };


    const getIcon = (type) => {
        switch (type) {
            case 'event': return <Calendar className="w-5 h-5 text-blue-400" />;
            case 'announcement': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'update': return <AlertCircle className="w-5 h-5 text-amber-400" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Announcements & Broadcasts</h1>
                    <p className="text-slate-400 mt-2 font-medium">Your personal stream of system events and updates.</p>
                </div>
                <div className="flex gap-3">
                    {(user?.role === 'club' || user?.role === 'coordinator') && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-accent flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Create Broadcast
                        </button>
                    )}
                </div>
            </header>

            <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>


                {/* Notification List */}
                <div className="relative z-10 divide-y divide-white/5">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 text-accent-primary animate-spin mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div
                                key={post._id}
                                className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-5 group"
                            >
                                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border bg-white/5 border-white/10">
                                    {getIcon(post.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-black text-white">
                                            {post.title}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap ml-4">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-2 animate-pulse"></span>
                                            {post.club?.name || 'Authorized Body'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                            Posted by {post.createdBy?.name}
                                        </span>
                                    </div>
                                </div>

                                {post.createdBy?._id === user?._id && (
                                    <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity flex sm:flex-col items-center justify-end sm:justify-center gap-2 mt-4 sm:mt-0">
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-400"
                                            title="Delete Broadcast"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                                <Bell className="w-10 h-10 text-slate-500 opacity-50" />
                            </div>
                            <p className="text-xl font-black text-white">No Broadcasts</p>
                            <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm mx-auto">No broadcasts have been transmitted in this sector yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowCreateModal(false)}></div>
                    <div className="relative glass-morphism border border-white/10 rounded-[2rem] w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-white mb-6">Dispatch Broadcast</h2>
                        <form onSubmit={handleCreatePost} className="space-y-5">
                            <div>
                                <label className="form-label">Broadcast Title</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Enter headline..."
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label">Sector Category</label>
                                <select
                                    className="form-input"
                                    value={newPost.type}
                                    onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                                >
                                    <option value="announcement">Announcement</option>
                                    <option value="event">Event Alert</option>
                                    <option value="update">Protocol Update</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Transmission Content</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="form-input resize-none"
                                    placeholder="Enter your message..."
                                    value={newPost.description}
                                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 btn-accent"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Dispatch Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;

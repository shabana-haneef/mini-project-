import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Upload, Plus, AlertCircle, CheckCircle2, FileVideo, FileText, Presentation, GraduationCap, Layers, GitBranch, Calendar, BookOpen, Hash } from 'lucide-react';

const UploadContent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contentType: 'video',
        youtubeUrl: '',
        tags: ''
    });
    const [academicData, setAcademicData] = useState({
        university: 'KTU',
        scheme: '',
        stream: '',
        year: '1',
        semester: '1',
        subjectName: '',
        subjectCode: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAcademicChange = (e) => {
        setAcademicData({ ...academicData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extracted Basic Validation Check
        const requiredManualFields = ['university', 'scheme', 'stream', 'subjectName', 'subjectCode'];
        const missingAcademic = requiredManualFields.find(field => !academicData[field]?.trim());
        
        if (missingAcademic) {
            setMessage({ type: 'error', text: 'Please complete all required Academic Classification fields before submission.' });
            return;
        }

        if (!formData.title?.trim() || !formData.description?.trim()) {
            setMessage({ type: 'error', text: 'Publication Title and Description are required.' });
            return;
        }

        // Basic Frontend Validation
        if (formData.contentType !== 'video' && !file) {
            setMessage({ type: 'error', text: 'Payload File is mandatory for Notes and PPTs.' });
            return;
        }

        if (formData.contentType === 'video' && !file && !formData.youtubeUrl) {
            setMessage({ type: 'error', text: 'Please provide a video file or a YouTube Matrix link.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const submitData = new FormData();

        // Academic Details (Manual Entry protocol)
        Object.keys(academicData).forEach(key => {
            submitData.append(key, academicData[key]);
        });

        // Content Details
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('contentType', formData.contentType);
        if (formData.youtubeUrl) submitData.append('youtubeUrl', formData.youtubeUrl);
        if (formData.tags) submitData.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));
        if (file) submitData.append('file', file);

        try {
            await api.post('/api/academic-content', submitData);
            setMessage({ type: 'success', text: 'Content published successfully! Redirecting...' });
            setTimeout(() => navigate('/mentor/dashboard'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Publication failed';
            console.error('Publication Error Details:', err.response?.data);
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Publish <span className="text-gradient">Content</span></h1>
                    <p className="text-slate-400 font-medium italic">Direct Publication Mode: Define your academic context manually.</p>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-accent-primary bg-accent-primary/10 px-4 py-2 rounded-xl border border-accent-primary/20 shadow-lg shadow-accent-primary/5">
                    <Plus className="w-3 h-3" />
                    <span>Quick Entry</span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Academic Metadata Section */}
                <section className="glass-morphism p-8 rounded-3xl border border-white/10 relative overflow-hidden group transition-all hover:border-white/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-primary/10 transition-all duration-700"></div>

                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2.5 bg-accent-secondary/20 rounded-xl border border-accent-secondary/30">
                            <GraduationCap className="w-5 h-5 text-accent-secondary" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Academic Classification</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">University <span className="text-red-500 text-xs">*</span></label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" name="university" required
                                    value={academicData.university} onChange={handleAcademicChange}
                                    placeholder="e.g. KTU"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Scheme <span className="text-red-500 text-xs">*</span></label>
                            <div className="relative">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" name="scheme" required
                                    value={academicData.scheme} onChange={handleAcademicChange}
                                    placeholder="e.g. 2019 Scheme"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stream <span className="text-red-500 text-xs">*</span></label>
                            <div className="relative">
                                <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" name="stream" required
                                    value={academicData.stream} onChange={handleAcademicChange}
                                    placeholder="e.g. CSE"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Year</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                                    <select
                                        name="year"
                                        value={academicData.year} onChange={handleAcademicChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all appearance-none cursor-pointer"
                                    >
                                        {[1, 2, 3, 4].map(y => <option key={y} value={y} className="bg-slate-900">Year {y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sem</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                                    <select
                                        name="semester"
                                        value={academicData.semester} onChange={handleAcademicChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all appearance-none cursor-pointer"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-slate-900">S{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject Name <span className="text-red-500 text-xs">*</span></label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" name="subjectName" required
                                    value={academicData.subjectName} onChange={handleAcademicChange}
                                    placeholder="e.g. Distributed Computing"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject Code <span className="text-red-500 text-xs">*</span></label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" name="subjectCode" required
                                    value={academicData.subjectCode} onChange={handleAcademicChange}
                                    placeholder="e.g. CST402"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Payload Section */}
                <section className="glass-morphism p-8 rounded-3xl border border-white/10 relative overflow-hidden group transition-all hover:border-white/20">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-secondary/5 rounded-full blur-3xl -ml-16 -mb-16 group-hover:bg-accent-secondary/10 transition-all duration-700"></div>

                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2.5 bg-accent-primary/20 rounded-xl border border-accent-primary/30">
                            <FileVideo className="w-5 h-5 text-accent-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Content Metadata</h2>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-bold tracking-tight">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Publication Title <span className="text-red-500 text-xs">*</span></label>
                                <input
                                    type="text" name="title" required
                                    value={formData.title} onChange={handleInputChange}
                                    placeholder="Enter a compelling title"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Deep Dive Description <span className="text-red-500 text-xs">*</span></label>
                                <textarea
                                    name="description" required rows="4"
                                    value={formData.description} onChange={handleInputChange}
                                    placeholder="What information does this payload contain?"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Search Keywords (Comma separated)</label>
                                <input
                                    type="text" name="tags"
                                    value={formData.tags} onChange={handleInputChange}
                                    placeholder="e.g. distributed, consensus, paxos"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Payload Classification</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'video', icon: FileVideo, label: 'Video' },
                                        { id: 'notes', icon: FileText, label: 'Notes' },
                                        { id: 'ppt', icon: Presentation, label: 'PPT' },
                                        { id: 'paper', icon: BookOpen, label: 'Paper' }
                                    ].map(type => (
                                        <button
                                            key={type.id} type="button"
                                            onClick={() => setFormData({ ...formData, contentType: type.id })}
                                            className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all duration-300 ${formData.contentType === type.id
                                                ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary shadow-lg shadow-accent-primary/10'
                                                : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                                                }`}
                                        >
                                            <type.icon size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.contentType === 'video' && (
                                <div className="animate-in slide-in-from-top-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">External Video Stream (YouTube Embed)</label>
                                    <input
                                        type="text" name="youtubeUrl"
                                        value={formData.youtubeUrl} onChange={handleInputChange}
                                        placeholder="https://youtube.com/embed/..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                                    />
                                </div>
                            )}

                            <div className="relative border-2 border-dashed border-white/10 rounded-4xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-accent-primary/40 hover:bg-white/[0.02] transition-all group overflow-hidden">
                                <div className="p-4 bg-white/5 rounded-full group-hover:bg-accent-primary/10 transition-all duration-300">
                                    <Upload className="text-slate-400 group-hover:text-accent-primary transition-colors" />
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-white font-bold mb-1">
                                        {file ? file.name : 'Select Raw Data'}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Max Load 1GB (PDF/PPT/RAW)</p>
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    id="file-upload"
                                />
                                <button type="button" className="relative z-10 px-8 py-2.5 bg-white/10 hover:bg-accent-primary text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl">
                                    Browse Net
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-10 py-5 bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-4xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/20 transition-all transform active:scale-[0.98]"
                    >
                        {loading ? 'Initializing Stream...' : 'Execute Publication'}
                    </button>
                </section>
            </form>
        </div>
    );
};

export default UploadContent;

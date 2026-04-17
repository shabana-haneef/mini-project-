import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import clubService from '../../services/clubService';
import {
    Save, Loader2, Info, GraduationCap, Users, Image as ImageIcon,
    ChevronRight, Camera, CheckCircle2, User, Plus, Trash2,
    Instagram, Linkedin, Twitter, Facebook
} from 'lucide-react';
import toast from 'react-hot-toast';

const ClubProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    const [formData, setFormData] = useState({
        clubName: '',
        category: '',
        description: '',
        location: '',
        website: '',
        socials: { instagram: '', linkedin: '', twitter: '', facebook: '' },
        facultyInCharge: { name: '', email: '', department: '', photo: '' },
        studentInCharge: [],
        galleryUrls: [],
        galleryFiles: []
    });

    const [facultyPhoto, setFacultyPhoto] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await clubService.getMyClubProfile();
                if (data) {
                    setFormData({
                        ...data,
                        clubName: data.user?.name || '',
                        socials: data.socials || { instagram: '', linkedin: '', twitter: '', facebook: '' },
                        facultyInCharge: data.facultyInCharge || { name: '', email: '', department: '', photo: '' },
                        studentInCharge: data.studentInCharge || [],
                        galleryFiles: []
                    });
                }
            } catch (error) {
                console.error('Profile fetch failed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e, section, field) => {
        if (section) {
            setFormData({
                ...formData,
                [section]: { ...formData[section], [field]: e.target.value }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };



    const handleFileChange = (e, field) => {
        if (field === 'galleryFiles') {
            setFormData({ ...formData, [field]: Array.from(e.target.files) });
        } else if (field === 'facultyPhoto') {
            setFacultyPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('clubName', formData.clubName);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('location', formData.location);
            data.append('website', formData.website);
            data.append('socials', JSON.stringify(formData.socials));
            data.append('facultyInCharge', JSON.stringify(formData.facultyInCharge));
            if (facultyPhoto) data.append('facultyPhoto', facultyPhoto);
            if (formData.galleryFiles.length > 0) {
                formData.galleryFiles.forEach(file => {
                    data.append('gallery', file);
                });
            }

            await clubService.updateClubProfile(data);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-accent-primary animate-spin" />
        </div>
    );

    const navItems = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'leads', label: 'Leadership', icon: GraduationCap },
        { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Club Profile</h1>
                    <p className="text-slate-400 mt-2 font-medium">Update your club's public information and leadership team.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save All Changes
                </button>
            </header>


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <nav className="lg:col-span-1 space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeSection === item.id
                                ? 'bg-white/10 border-white/20 text-white shadow-lg'
                                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`}
                        >
                            <div className="flex items-center">
                                <item.icon className={`w-5 h-5 mr-3 ${activeSection === item.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${activeSection === item.id ? 'rotate-90 text-indigo-400' : 'text-slate-600'}`} />
                        </button>
                    ))}
                    <div className="pt-4 border-t border-white/5 mt-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-4 mb-2">Advanced</p>
                        <a href="/club/coordinators" className="w-full flex items-center p-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
                            <Users className="w-5 h-5 mr-3 text-slate-500" />
                            <span className="font-bold text-sm tracking-tight">Manage Team</span>
                        </a>
                    </div>
                </nav>

                <main className="lg:col-span-3">
                    <div className="glass-morphism rounded-[2.5rem] p-8 md:p-10 border border-white/10">
                        {activeSection === 'basic' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-4">Core Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Club Name</label>
                                        <input type="text" name="clubName" value={formData.clubName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Vision / Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                    {['instagram', 'linkedin', 'twitter', 'facebook'].map(sm => (
                                        <div key={sm} className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 flex items-center">
                                                {sm === 'instagram' && <Instagram size={12} className="mr-1 text-pink-500" />}
                                                {sm === 'linkedin' && <Linkedin size={12} className="mr-1 text-blue-500" />}
                                                {sm}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="@handle"
                                                value={formData.socials[sm]}
                                                onChange={(e) => handleChange(e, 'socials', sm)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-white/20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'leads' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-4">Faculty In-Charge</h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group relative shrink-0 overflow-hidden">
                                            {facultyPhoto || formData.facultyInCharge?.photo ? (
                                                <img
                                                    src={facultyPhoto ? URL.createObjectURL(facultyPhoto) : formData.facultyInCharge.photo}
                                                    alt="Faculty"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User size={40} />
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                                                <Camera size={20} className="text-white" />
                                                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'facultyPhoto')} accept="image/*" />
                                            </label>
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                                <input type="text" value={formData.facultyInCharge.name} onChange={(e) => handleChange(e, 'facultyInCharge', 'name')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                                <input type="email" value={formData.facultyInCharge.email} onChange={(e) => handleChange(e, 'facultyInCharge', 'email')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Department</label>
                                                <input type="text" value={formData.facultyInCharge.department} onChange={(e) => handleChange(e, 'facultyInCharge', 'department')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                                        <div>
                                            <h3 className="text-lg font-black text-white leading-tight">Team Management</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-1">Manage your club's EXCOM, coordinators, and leads in the dedicated section.</p>
                                        </div>
                                        <a href="/club/coordinators" className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center">
                                            <Users size={14} className="mr-2" />
                                            Manage Team
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'gallery' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-4">Photo Gallery</h3>
                                <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/2">
                                    <ImageIcon size={48} className="mx-auto text-slate-700 mb-4" />
                                    <h4 className="text-lg font-black text-white mb-2">Visual Showcase</h4>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">Upload photos of your events to show off on your public profile.</p>
                                    <label className="px-8 py-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600/20 transition-all cursor-pointer">
                                        Select Images
                                        <input type="file" className="hidden" multiple onChange={(e) => handleFileChange(e, 'galleryFiles')} accept="image/*" />
                                    </label>
                                    {formData.galleryFiles.length > 0 && (
                                        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
                                            {formData.galleryFiles.map((file, idx) => (
                                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                                    <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ClubProfile;

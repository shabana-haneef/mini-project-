import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { User, Mail, Award, BookOpen, Camera, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        skills: user?.skills || '',
        github: user?.github || '',
        linkedin: user?.linkedin || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (profileFile) {
                data.append('profilePicture', profileFile);
            }

            const updatedUser = await authService.updateProfile(data);

            // Update local auth state and storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const newUserInfo = { ...userInfo, ...updatedUser };
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            login(newUserInfo);

            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Student Profile</h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage your personal information and academic identity.</p>
                </div>
                {user?.role === 'coordinator' && (
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-accent-secondary bg-accent-secondary/10 px-4 py-2 rounded-2xl border border-accent-secondary/20">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Verified Mentor
                    </div>
                )}
            </header>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl group-hover:bg-accent-primary/20 transition-colors"></div>

                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-accent-primary/20 border-4 border-dark-bg">
                                {profilePreview || user?.profilePicture ? (
                                    <img
                                        src={profilePreview || user.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    formData.name ? formData.name.charAt(0) : <User size={48} />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 p-2.5 bg-dark-bg border border-white/10 rounded-full text-white hover:text-accent-primary transition-colors hover:scale-110 shadow-lg cursor-pointer group/btn">
                                    <Camera className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            )}
                        </div>

                        <h2 className="text-2xl font-black text-white tracking-tight relative z-10">{formData.name}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4 relative z-10">{user?.role || 'Student'}</p>

                        <div className="w-full h-px bg-white/10 my-6 relative z-10"></div>

                        <div className="w-full space-y-4 relative z-10">
                            <div className="flex items-center text-sm font-medium text-slate-300">
                                <Mail className="w-4 h-4 mr-3 text-slate-500" />
                                <span className="truncate">{formData.email}</span>
                            </div>
                            <div className="flex items-center text-sm font-medium text-slate-300">
                                <Award className="w-4 h-4 mr-3 text-accent-primary" />
                                3 Events Attended
                            </div>
                            <div className="flex items-center text-sm font-medium text-slate-300">
                                <BookOpen className="w-4 h-4 mr-3 text-accent-secondary" />
                                1 Peer Session Hosted
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Form */}
                <div className="md:col-span-2">
                    <div className="glass-morphism rounded-[2.5rem] p-8 md:p-10 border border-white/10 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 relative z-10">
                            <h3 className="text-xl font-black text-white flex items-center">
                                <User className="w-5 h-5 mr-3 text-accent-primary" />
                                Profile Details
                            </h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isEditing
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20 hover:bg-accent-primary/20'
                                    }`}
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Skills & Interests (Comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">GitHub Portfolio</label>
                                    <input
                                        type="text"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">LinkedIn Profile</label>
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-6 border-t border-white/10">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-accent-primary/20 hover:opacity-90 transition-all transform hover:-translate-y-1 active:scale-95"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

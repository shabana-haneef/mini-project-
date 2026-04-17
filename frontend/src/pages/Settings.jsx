import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Settings as SettingsIcon, Shield, Bell, User, Lock, Eye, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, login } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            
            const updatedUser = await authService.updateProfile(data);

            // Update local auth state and storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const newUserInfo = { ...userInfo, ...updatedUser };
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            login(newUserInfo);

            toast.success('Settings updated successfully!');
        } catch (error) {
            console.error('Settings update failed:', error);
            toast.error('Failed to update settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Settings</h1>
                <p className="text-slate-400 font-medium">Manage your account preferences and system configurations.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar-like Navigation for Settings */}
                <div className="lg:col-span-1 space-y-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl bg-white/5 border border-accent-primary/30 text-white font-bold transition-all">
                        <User className="w-5 h-5 text-accent-primary" />
                        <span>Profile Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                        <Shield className="w-5 h-5" />
                        <span>Security & Privacy</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                        <Eye className="w-5 h-5" />
                        <span>Display Preferences</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="glass-morphism rounded-3xl border border-white/10 p-8">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center">
                            <User className="w-6 h-6 mr-3 text-accent-primary" />
                            Personal Information
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Role</label>
                                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-accent-primary font-black text-[10px] uppercase tracking-widest">
                                    {user?.role || 'Student'}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center space-x-2 bg-white text-slate-900 px-8 py-3 rounded-xl font-black hover:bg-accent-primary hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="glass-morphism rounded-3xl border border-white/10 p-8">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center">
                            <Lock className="w-6 h-6 mr-3 text-accent-secondary" />
                            Password & Authentication
                        </h2>
                        <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold border border-white/10 transition-all active:scale-95">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

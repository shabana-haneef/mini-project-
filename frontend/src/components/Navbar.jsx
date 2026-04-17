import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, Users, BookOpen, Settings, LayoutDashboard,
    LogOut, Menu, X, ChevronRight, Award
} from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full glass-morphism border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-2 lg:hidden">
                    <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-1.5 rounded-lg shadow-lg">
                        <Calendar className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Campus<span className="text-accent-primary">Connect</span></span>
                </div>
            </div>

            <div className="flex items-center space-x-4">

                {/* User Dropdown */}
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'User'}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary leading-none">
                                    {user?.role || 'Student'}
                                </span>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 glass-morphism border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-white/10 md:hidden">
                                    <p className="text-sm font-bold text-white">{user?.name}</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-accent-primary mt-1">{user?.role}</p>
                                </div>
                                <Link
                                    to={user?.role === 'club' ? '/club/profile' : user?.role === 'mentor' ? '/mentor/dashboard' : '/profile'}
                                    className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-3 text-accent-secondary" />
                                    {user?.role === 'mentor' ? 'Dashboard' : 'My Profile'}
                                </Link>
                                <Link
                                    to="/settings"
                                    className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                    Settings
                                </Link>
                                <div className="h-px bg-white/10 my-1"></div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-bold"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Navbar;

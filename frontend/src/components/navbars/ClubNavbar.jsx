import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Building2, Users2, CalendarDays, LogOut,
    Award, Settings, Menu, X, Shield, ArrowLeft
} from 'lucide-react';

const ClubNavbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isDashboard = location.pathname === '/club/dashboard';

    const navLinks = [
        { name: 'Dashboard', path: '/club/dashboard', icon: LayoutDashboard },
        { name: 'Club Profile', path: '/club/profile', icon: Building2 },
        { name: 'Manage Team', path: '/club/coordinators', icon: Users2 },
        { name: 'Club Announcements', path: '/club/announcements', icon: LayoutDashboard },
        { name: 'Club Events', path: '/club/events', icon: CalendarDays },
    ];

    return (
        <header className="sticky top-0 z-40 w-full glass-morphism border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                    {!isDashboard && (
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group mr-1"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    )}
                    <div className="bg-linear-to-br from-indigo-500 to-accent-primary p-1.5 rounded-lg shadow-lg">
                        <Award className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Campus<span className="text-indigo-400">Club</span></span>
                </div>

                <nav className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                                ? 'bg-text-primary text-white border border-text-primary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <link.icon className="w-4 h-4 mr-2" />
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>


                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-accent-primary flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                {user?.name?.charAt(0) || 'C'}
                            </div>
                            <div className="hidden md:flex flex-col items-start text-left">
                                <span className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'Club Admin'}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${user?.role === 'superadmin' ? 'text-red-500' : 'text-indigo-400'}`}>
                                    {user?.role === 'superadmin' ? 'Super Admin' : 'Club Portal'}
                                </span>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 glass-morphism border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <Link to="/club/settings" className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setShowProfileMenu(false)}>
                                    <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                    Settings
                                </Link>
                                {user?.role === 'superadmin' && (
                                    <Link to="/admin/super-dashboard" className="flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-bold" onClick={() => setShowProfileMenu(false)}>
                                        <Shield className="w-4 h-4 mr-3" />
                                        Super Control
                                    </Link>
                                )}
                                <button
                                    onClick={() => { logout(); setShowProfileMenu(false); }}
                                    className="w-[90%] mx-auto flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-xl transition-colors font-bold mt-2"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 glass-morphism border-b border-white/10 p-4 lg:hidden animate-in slide-in-from-top-2 flex flex-col space-y-2 shadow-2xl z-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                                ? 'bg-text-primary text-white border border-text-primary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <button
                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                            className="flex items-center px-4 py-3 mt-4 text-sm font-bold text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default ClubNavbar;

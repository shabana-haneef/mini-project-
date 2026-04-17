import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, Users, BookOpen, FileText, Download, LogOut,
    Menu, X, Settings, Award, CalendarDays, Shield, ArrowLeft
} from 'lucide-react';

const StudentNavbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isDashboard = location.pathname === '/student/dashboard';

    const navLinks = [
        { name: 'Home', path: '/student/dashboard', icon: Home },
        { name: 'Club Announcements', path: '/student/announcements', icon: Home },
        { name: 'Clubs', path: '/student/clubs', icon: Users },
        { name: 'Academy Classes', path: '/student/academy', icon: BookOpen },
        { name: 'Resources', path: '/student/resources', icon: FileText },
        { name: 'My Downloads', path: '/student/downloads', icon: Download },
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
                    <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-1.5 rounded-lg shadow-lg">
                        <Award className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Campus<span className="text-accent-primary">Connect</span></span>
                </div>

                <nav className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
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
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                            <div className="hidden md:flex flex-col items-start text-left">
                                <span className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'Student'}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${user?.role === 'superadmin' ? 'text-red-500' : 'text-accent-primary'}`}>
                                    {user?.role === 'superadmin' ? 'Super Admin' : 'Student Portal'}
                                </span>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 glass-morphism border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <Link to="/student/profile" className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setShowProfileMenu(false)}>
                                    <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                    My Profile
                                </Link>
                                {user?.role === 'superadmin' && (
                                    <Link to="/admin/super-dashboard" className="flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-bold" onClick={() => setShowProfileMenu(false)}>
                                        <Shield className="w-4 h-4 mr-3" />
                                        Super Control
                                    </Link>
                                )}
                                <button
                                    onClick={() => { logout(); setShowProfileMenu(false); }}
                                    className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-bold"
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
                                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
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

export default StudentNavbar;

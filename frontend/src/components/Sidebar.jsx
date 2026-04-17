import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, CalendarRange, Users, Award,
    BookOpen, CheckSquare, BarChart3, Settings, HelpCircle, FileText, Building2, GraduationCap
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Define Role-Based Links
    const getNavLinks = () => {
        const role = user?.role || 'student';

        const commonLinks = [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
            { id: 'events', label: 'Explore Events', icon: CalendarRange, path: '/events' },
            { id: 'browse-clubs', label: 'Browse Clubs', icon: Building2, path: '/student/clubs' },
            { id: 'peer-teaching', label: 'Collaborative Space', icon: BookOpen, path: '/peer-teaching' },
            { id: 'academic-portal', label: 'Academic Portal', icon: GraduationCap, path: '/academic-portal' },
            { id: 'profile', label: 'My Profile', icon: Award, path: '/profile' },
        ];

        const clubLinks = [
            { id: 'club-dashboard', label: 'Club Overview', icon: LayoutDashboard, path: '/club/dashboard' },
            { id: 'manage-events', label: 'Manage Events', icon: CalendarRange, path: '/club/events' },
            { id: 'create-event', label: 'Create Event', icon: FileText, path: '/events/create' },
            { id: 'create-peer-teaching', label: 'Create Peer Teaching', icon: BookOpen, path: '/peer-teaching/create' },
            { id: 'club-profile', label: 'Club Profile', icon: Award, path: '/club/profile' },
        ];

        const mentorLinks = [
            { id: 'mentor-dashboard', label: 'Mentor Hub', icon: LayoutDashboard, path: '/mentor/dashboard' },
            { id: 'upload-content', label: 'Publish Content', icon: FileText, path: '/mentor/upload-resource' },
            { id: 'profile', label: 'My Profile', icon: Award, path: '/profile' },
        ];

        const adminLinks = [
            { id: 'admin-dashboard', label: 'System Overview', icon: BarChart3, path: '/admin/dashboard' },
            { id: 'approvals', label: 'Pending Approvals', icon: CheckSquare, path: '/admin/approvals' },
            { id: 'users', label: 'User Directory', icon: Users, path: '/admin/users' },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
            { id: 'settings', label: 'System Settings', icon: Settings, path: '/settings' },
        ];

        if (role === 'club' || role === 'coordinator') return clubLinks;
        if (role === 'admin') return adminLinks;
        if (role === 'mentor') return mentorLinks;
        return commonLinks; // Default student
    };

    const links = getNavLinks();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 h-screen w-72 glass-morphism border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] lg:w-64 flex flex-col pt-16 lg:pt-0 pb-6 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">

                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">
                        Main Menu
                    </div>

                    <nav className="space-y-1.5">
                        {links.map((link) => {
                            const Icon = link.icon;
                            // Exact match for dashboard to avoid highlighting multiple items, or startsWith for others
                            const isActive = link.id === 'dashboard'
                                ? location.pathname === link.path
                                : location.pathname.startsWith(link.path);

                            return (
                                <NavLink
                                    key={link.id}
                                    to={link.path}
                                    onClick={() => window.innerWidth < 1024 && closeSidebar()}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-linear-to-r from-accent-primary/20 to-transparent border border-accent-primary/30 text-white shadow-lg'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-primary rounded-r-full"></div>
                                    )}
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-accent-primary scale-110' : 'group-hover:text-accent-primary group-hover:scale-110'}`} />
                                    <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                        {link.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="px-4 mt-auto">
                    <div className="bg-linear-to-br from-accent-primary/10 to-accent-secondary/10 border border-white/10 rounded-3xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-accent-primary/30 transition-colors"></div>
                        <HelpCircle className="w-6 h-6 text-accent-primary mb-3 relative z-10" />
                        <h4 className="text-sm font-black text-white mb-1 relative z-10">Need Assistance?</h4>
                        <p className="text-xs text-slate-400 font-medium mb-4 relative z-10">Check our comprehensive guides or contact support.</p>
                        <button className="w-full relative z-10 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl border border-white/10 transition-all shadow-md group-hover:shadow-lg">
                            Help Center
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

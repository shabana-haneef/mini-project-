import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Define root pages where we might want to hide the back button
    // adjust these based on your application's home pages for each role
    const rootPages = [
        '/student/dashboard',
        '/mentor/dashboard',
        '/club/dashboard',
        '/admin/dashboard',
        '/admin/super-dashboard',
        '/guest'
    ];

    const isRootPage = rootPages.includes(location.pathname);

    if (isRootPage) return null;

    return (
        <button
            onClick={() => navigate(-1)}
            className="group flex items-center mb-6 text-slate-400 hover:text-white transition-all duration-300 focus:outline-none"
        >
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-accent-primary/30 group-hover:bg-accent-primary/5 transition-all mr-3 shadow-lg">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                Back to previous
            </span>
        </button>
    );
};

export default BackButton;

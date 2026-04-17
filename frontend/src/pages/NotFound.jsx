import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getDashboardPath = () => {
        if (!user) return '/guest';
        switch (user.role) {
            case 'student':    return '/student/dashboard';
            case 'mentor':     return '/mentor/dashboard';
            case 'club':       return '/club/dashboard';
            case 'admin':      return '/admin/dashboard';
            case 'superadmin': return '/admin/super-dashboard';
            default:           return '/guest';
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
                <div className="text-[12rem] md:text-[18rem] font-black leading-none text-white opacity-5 select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-6 rounded-3xl shadow-2xl animate-float">
                        <AlertCircle className="w-16 h-16 text-white" />
                    </div>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Lost in Space?</h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto mb-12 font-medium">
                The page you're looking for has vanished or never existed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to={getDashboardPath()}
                    className="flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-accent-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl"
                >
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    {user ? 'Go to Dashboard' : 'Back to Home'}
                </Link>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center glass-morphism text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/10"
                >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;

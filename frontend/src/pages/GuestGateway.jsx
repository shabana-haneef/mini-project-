import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ShieldAlert } from 'lucide-react';

const GuestGateway = () => {
    return (
        <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Minimal Navbar */}
            <nav className="sticky top-0 z-50 glass-morphism px-4 py-4 sm:px-6 lg:px-8 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2 group">
                        <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-2 rounded-xl shadow-lg">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Campus<span className="text-accent-primary">Connect</span></span>
                    </div>

                    <div className="flex items-center space-x-6 sm:space-x-4">
                        <Link to="/" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors p-2">Home</Link>
                        <a href="#portals" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors p-2">Portals</a>
                    </div>
                </div>
            </nav>

            {/* Gateway Content */}
            <main className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-20">
                <h1 className="text-4xl md:text-5xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight px-4 max-w-4xl mx-auto">
                    Select Your <span className="text-gradient">Portal</span>
                </h1>

                <p className="max-w-xl text-lg text-slate-300 mb-16 font-medium leading-relaxed">
                    Welcome to the campus ecosystem. Choose your designated portal below to log in and access your workspace.
                </p>

                <div id="portals" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                    {/* Student Portal Option */}
                    <div className="glass-morphism p-8 rounded-4xl border border-white/5 flex flex-col h-full hover:border-accent-primary/30 transition-all hover:-translate-y-2 group">
                        <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7 text-accent-primary" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Student Portal</h3>
                        <p className="text-slate-400 text-sm font-medium grow mb-8 px-4">
                            Access classes, resources, and club events.
                        </p>
                        <Link
                            to="/student/login"
                            className="btn-accent w-full py-4 text-center justify-center font-bold text-sm tracking-wide active:scale-95 transition-all shadow-lg shadow-accent-primary/20"
                        >
                            Login as Student
                        </Link>
                    </div>

                    {/* Mentor Portal Option */}
                    <div className="glass-morphism p-8 rounded-4xl border border-white/5 flex flex-col h-full hover:border-accent-secondary/30 transition-all hover:-translate-y-2 group">
                        <div className="w-14 h-14 bg-accent-secondary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <BookOpen className="w-7 h-7 text-accent-secondary" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Mentor Portal</h3>
                        <p className="text-slate-400 text-sm font-medium grow mb-8 px-4">
                            Upload classes and academic resources.
                        </p>
                        <Link
                            to="/mentor/login"
                            className="bg-accent-secondary hover:bg-accent-secondary/90 text-white w-full py-4 rounded-xl text-center font-bold text-sm tracking-wide transition-all shadow-lg shadow-accent-secondary/30 active:scale-95"
                        >
                            Login as Mentor
                        </Link>
                    </div>

                    {/* Club Portal Option */}
                    <div className="glass-morphism p-8 rounded-4xl border border-white/5 flex flex-col h-full hover:border-indigo-500/30 transition-all hover:-translate-y-2 group">
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <ShieldAlert className="w-7 h-7 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Club Portal</h3>
                        <p className="text-slate-400 text-sm font-medium grow mb-8 px-4">
                            Manage club events and announcements.
                        </p>
                        <Link
                            to="/club-admin/login"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white w-full py-4 rounded-xl text-center font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#4F46E5]/40 active:scale-95"
                        >
                            Login as Club Admin
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GuestGateway;

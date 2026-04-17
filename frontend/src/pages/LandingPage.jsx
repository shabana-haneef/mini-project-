import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Award, ArrowRight, ShieldAlert, BookOpen } from 'lucide-react';

const LandingPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass-morphism px-4 py-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <Calendar className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Campus<span className="text-accent-primary">Connect</span></span>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4 pl-4 border-white/10">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-red-400 p-2 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/student/login" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Portal Access</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-24">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-accent-primary text-xs font-bold mb-8 animate-float">
                    <Award className="w-3.5 h-3.5 mr-2" />
                    NEW: Peer Mentoring Marketplace
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                    Elevate Your <br />
                    <span className="text-gradient">Campus Life</span>
                </h1>

                <p className="max-w-xl text-lg md:text-xl text-slate-200 mb-12 font-medium leading-relaxed">
                    The ultimate ecosystem for student clubs, event management, and academic synergy. All in one stunning experience.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative group/btn">
                        <Link to="/student/signup" className="btn-secondary px-10 py-4 text-lg transform hover:-translate-y-1 shadow-2xl shadow-white/5">
                            Student Entry
                            <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
                    <Link to="/student/login" className="glass-morphism p-8 rounded-4xl border border-white/5 hover:border-accent-primary/30 transition-all hover:-translate-y-2 group">
                        <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Student Portal</h3>
                        <p className="text-slate-400 text-sm font-medium">Browse clubs, view announcements, and access academic resources.</p>
                    </Link>

                    <Link to="/mentor/login" className="glass-morphism p-8 rounded-4xl border border-white/5 hover:border-accent-secondary/30 transition-all hover:-translate-y-2 group">
                        <div className="w-12 h-12 bg-accent-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6 text-accent-secondary" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Mentor Portal</h3>
                        <p className="text-slate-400 text-sm font-medium">Upload classes, share notes, and mentor fellow students.</p>
                    </Link>

                    <Link to="/club-admin/login" className="glass-morphism p-8 rounded-4xl border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-2 group">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldAlert className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Club Admin</h3>
                        <p className="text-slate-400 text-sm font-medium">Manage your club, host events, and grow your community.</p>
                    </Link>
                </div>
            </header>



            {/* Footer */}
            <footer className="border-t border-white/5 py-16 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-60">
                    <div className="flex items-center space-x-2 mb-6 md:mb-0">
                        <Calendar className="text-accent-primary w-5 h-5" />
                        <span className="text-lg font-black tracking-tight">CampusConnect</span>
                    </div>
                    <p className="text-slate-300 text-xs font-bold tracking-widest uppercase">
                        © 2026 Next-Gen Campus Ecosystem. Crafted for Distinction.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

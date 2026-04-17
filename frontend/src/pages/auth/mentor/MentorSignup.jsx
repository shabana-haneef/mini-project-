import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';
import { BookOpen, User, Mail, Lock, ShieldAlert, Loader2, ArrowRight, Eye, EyeOff, Building2, GraduationCap, ArrowLeft } from 'lucide-react';

const MentorSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institution, setInstitution] = useState('');
    const [stream, setStream] = useState('');
    const [scheme, setScheme] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.signup({
                name, email, password, role: 'mentor',
                institution, stream, scheme
            });
            navigate('/mentor/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Application failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-bg text-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-50">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition-colors group px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-linear-to-br from-accent-secondary to-purple-500 p-2.5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                            <BookOpen className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">Campus<span className="text-accent-secondary font-bold">Academy</span></span>
                    </Link>
                </div>
                <h2 className="text-center text-4xl font-black text-white tracking-tight leading-tight">Become a Mentor</h2>
                <p className="mt-3 text-center text-sm text-slate-200 font-medium">
                    Already an academy mentor?{' '}
                    <Link to="/mentor/login" className="text-accent-secondary hover:text-purple-400 font-bold underline decoration-accent-secondary/30 underline-offset-4 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-morphism py-10 px-6 sm:rounded-[2.5rem] sm:px-12 border border-white/10 shadow-2xl">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                                    <p className="text-sm text-red-400 font-bold flex items-center">
                                        <ShieldAlert className="w-4 h-4 mr-2" />
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-accent-secondary" />
                                        </div>
                                        <input
                                            type="text" 
                                            id="mentor-name-signup"
                                            name="mentor-name-signup"
                                            required 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                            autoComplete="name"
                                            className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 transition-all font-medium"
                                            placeholder="Dr. Jane Smith"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">Institution</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                        <Building2 className="h-5 w-5 text-slate-500 group-focus-within:text-accent-secondary" />
                                    </div>
                                    <input
                                        type="text" required value={institution} onChange={(e) => setInstitution(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 transition-all font-medium"
                                        placeholder="Tech University"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">Stream</label>
                                    <input
                                        type="text" required value={stream} onChange={(e) => setStream(e.target.value)}
                                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 transition-all font-medium"
                                        placeholder="CSE"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">Scheme</label>
                                    <input
                                        type="text" required value={scheme} onChange={(e) => setScheme(e.target.value)}
                                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 transition-all font-medium"
                                        placeholder="2021"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">Professional Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-accent-secondary" />
                                    </div>
                                    <input
                                        type="email" 
                                        id="mentor-email-signup"
                                        name="mentor-email-signup"
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 transition-all font-medium"
                                        placeholder="mentor@university.edu"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">Secure Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-accent-secondary" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'} 
                                        id="mentor-password-signup"
                                        name="mentor-password-signup"
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        className="block w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-accent-secondary">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={loading} className="w-full relative group">
                                    <div className="absolute inset-0 bg-linear-to-r from-accent-secondary to-purple-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                    <div className="relative flex justify-center py-4 px-4 bg-linear-to-r from-accent-secondary to-purple-500 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all items-center shadow-xl">
                                        {loading ? <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> : null}
                                        {loading ? 'Submitting Application...' : 'Register as Mentor'}
                                        {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                    </div>
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
};

export default MentorSignup;

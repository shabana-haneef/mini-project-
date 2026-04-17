import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';
import { GraduationCap, User, Mail, Lock, ShieldAlert, Loader2, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const StudentSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            await authService.signup({ name, email, password, role: 'student' });
            navigate(`/student/login`);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-bg text-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

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
                        <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-2.5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                            <GraduationCap className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">Campus<span className="text-accent-primary font-bold">Connect</span></span>
                    </Link>
                </div>
                <h2 className="text-center text-4xl font-black text-white tracking-tight leading-tight">Join Student Portal</h2>
                <p className="mt-3 text-center text-sm text-slate-200 font-medium">
                    Already registered?{' '}
                    <Link to="/student/login" className="text-accent-primary hover:text-accent-secondary font-bold underline decoration-accent-primary/30 underline-offset-4 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-morphism py-10 px-6 sm:rounded-[2.5rem] sm:px-12 border border-white/10 shadow-2xl">
                    {isRegistered ? (
                        <div className="space-y-6 text-center py-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mx-auto">
                                <Mail className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Check Your Inbox</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    We've sent a verification link to <span className="text-white font-bold">{registeredEmail}</span>. Please verify your email to activate your student account.
                                </p>
                            </div>
                            <div className="pt-4">
                                <Link 
                                    to="/student/login"
                                    className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest"
                                >
                                    Go to Sign In
                                </Link>
                                <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                                    Don't see it? Check your spam folder.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                                    <p className="text-sm text-red-400 font-bold flex items-center">
                                        <ShieldAlert className="w-4 h-4 mr-2" />
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="form-label">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary" />
                                    </div>
                                    <input
                                        type="text" 
                                        id="student-name"
                                        name="student-name"
                                        required 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        className="form-input pl-12"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Academic Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary" />
                                    </div>
                                    <input
                                        type="email" 
                                        id="student-email-signup"
                                        name="student-email-signup"
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        className="form-input pl-12"
                                        placeholder="student@university.edu"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Create Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'} 
                                        id="student-password-signup"
                                        name="student-password-signup"
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        className="form-input pl-12 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-accent-primary">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={loading} className="w-full relative group">
                                    <div className="absolute inset-0 bg-accent-primary/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                    <div className="btn-primary w-full py-4 text-sm">
                                        {loading ? <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> : null}
                                        {loading ? 'Registering...' : 'Create Student Account'}
                                        {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                    </div>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentSignup;

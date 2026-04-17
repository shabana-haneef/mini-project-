import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';
import { Building2, Shield, Mail, Lock, ShieldCheck, ArrowRight, Loader2, ShieldAlert, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ClubAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'student') navigate('/student/dashboard');
            else if (user.role === 'mentor') navigate('/mentor/dashboard');
            else if (user.role === 'club' || user.role === 'coordinator') navigate('/club/dashboard');
            else if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'superadmin') navigate('/admin/super-dashboard');
            else {
                localStorage.removeItem('userInfo');
                window.location.href = '/guest';
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await authService.login(email, password);
            if (data.role !== 'club' && data.role !== 'coordinator') {
                setError('Access Denied. This portal is for Club Administrators only.');
                return;
            }
            login(data);
            navigate('/club/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-bg text-slate-100 relative overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-8 left-8 z-[100]">
                <Link to="/guest" className="flex items-center text-slate-400 hover:text-white transition-colors group px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-50">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-linear-to-br from-indigo-500 to-accent-primary p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                            <Building2 className="text-white w-8 h-8" />
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter">Campus<span className="text-indigo-400 font-bold">Club</span></span>
                    </Link>
                </div>
                <h2 className="text-center text-4xl font-black text-white tracking-tight leading-tight">Admin Portal</h2>
                <p className="mt-3 text-center text-sm text-slate-200 font-medium">
                    Representing a club?{' '}
                    <Link to="/club-admin/signup" className="text-indigo-400 hover:text-accent-primary font-bold underline decoration-indigo-400/30 underline-offset-4 transition-colors">
                        Register your club
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-50">
                <div className="glass-morphism py-12 px-6 sm:rounded-[2.5rem] sm:px-12 border border-white/10 shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                                <p className="text-sm text-red-400 font-bold flex items-center">
                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="form-label">Club Admin Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400" />
                                </div>
                                <input
                                    type="email" 
                                    id="club-email"
                                    name="club-email"
                                    required 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="form-input pl-12"
                                    placeholder="admin@club.university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'} 
                                    id="club-password"
                                    name="club-password"
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="form-input pl-12 pr-12"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-400">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full relative group pt-2">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="btn-primary w-full py-4 text-sm">
                                {loading ? <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> : null}
                                {loading ? 'Authorizing Access...' : 'Enter Admin Portal'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            </div>
                        </button>
                    </form>
                </div>
            </div>

            {/* Decorative Background Blobs Moved to Back */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none z-0"></div>
        </div>
    );
};

export default ClubAdminLogin;

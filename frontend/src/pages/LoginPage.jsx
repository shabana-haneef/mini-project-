import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Calendar, User, Mail, Lock, Shield, ArrowRight, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await authService.login(email, password);
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-bg text-slate-100 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                            <Calendar className="text-white w-8 h-8" />
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter">Campus<span className="text-accent-primary font-bold">Connect</span></span>
                    </Link>
                </div>
                <h2 className="text-center text-4xl font-black text-white tracking-tight">
                    Welcome Back
                </h2>
                <p className="mt-3 text-center text-sm text-slate-200 font-medium">
                    New to the community?{' '}
                    <Link to="/signup" className="text-accent-primary hover:text-accent-secondary font-bold underline decoration-accent-primary/30 underline-offset-4 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
                            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                    placeholder="name@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-accent-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative group"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-accent-primary to-accent-secondary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative flex justify-center py-4 px-4 bg-linear-to-r from-accent-primary to-accent-secondary rounded-2xl text-white font-black text-sm hover:opacity-90 transition-all items-center shadow-xl">
                                    {loading ? (
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    ) : null}
                                    {loading ? 'Authenticating...' : 'Sign In Now'}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </div>
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-center space-x-6">
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                                <Shield className="w-3.5 h-3.5 mr-2 text-accent-primary" />
                                Secure AES-256
                            </div>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                                <User className="w-3.5 h-3.5 mr-2 text-accent-secondary" />
                                Encrypted Session
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

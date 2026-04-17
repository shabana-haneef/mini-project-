import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Calendar, User, Mail, Lock, GraduationCap, Users, ShieldAlert, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [category, setCategory] = useState('Technical');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Mentor-specific fields
    const [institution, setInstitution] = useState('');
    const [mentorStream, setMentorStream] = useState('');
    const [mentorScheme, setMentorScheme] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const signupData = { name, email, password, role };
            if (role === 'club') {
                signupData.category = category;
            }
            if (role === 'mentor') {
                signupData.institution = institution;
                signupData.stream = mentorStream;
                signupData.scheme = mentorScheme;
            }
            const data = await authService.signup(signupData);
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Technical', 'Cultural', 'Sports', 'Literary', 'Social Service', 'Arts'];

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-bg text-slate-100 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-linear-to-br from-accent-primary to-accent-secondary p-2.5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                            <Calendar className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">Campus<span className="text-accent-primary font-bold">Connect</span></span>
                    </Link>
                </div>
                <h2 className="text-center text-4xl font-black text-white tracking-tight leading-tight">
                    Start Your <br />
                    <span className="text-gradient">Professional Journey</span>
                </h2>
                <p className="mt-3 text-center text-sm text-slate-200 font-medium">
                    Already part of the network?{' '}
                    <Link to="/login" className="text-accent-primary hover:text-accent-secondary font-bold underline decoration-accent-primary/30 underline-offset-4 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-morphism py-10 px-6 sm:rounded-[2.5rem] sm:px-12 border border-white/10 shadow-2xl">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                <p className="text-sm text-red-400 font-bold flex items-center">
                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                {role === 'club' ? 'Official Club Name' : 'Full Name'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {role === 'club' ? (
                                        <Users className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                                    ) : (
                                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                                    )}
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-14 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                    placeholder={role === 'club' ? "NSS Unit 1" : role === 'mentor' ? "Dr. Jane Smith" : "John Doe"}
                                />
                            </div>
                        </div>

                        {role === 'mentor' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                        Institution
                                    </label>
                                    <input
                                        type="text" required
                                        value={institution}
                                        onChange={(e) => setInstitution(e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                        placeholder="e.g., Tech University"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                            Stream
                                        </label>
                                        <input
                                            type="text" required
                                            value={mentorStream}
                                            onChange={(e) => setMentorStream(e.target.value)}
                                            className="block w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                            placeholder="e.g., CSE"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                            Scheme
                                        </label>
                                        <input
                                            type="text" required
                                            value={mentorScheme}
                                            onChange={(e) => setMentorScheme(e.target.value)}
                                            className="block w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                            placeholder="e.g., 2019"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                {role === 'club' ? 'Club Email Address' : 'Academic Email'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-14 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
                                    placeholder={role === 'club' ? "club@university.edu" : "name@university.edu"}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                Secure Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-accent-primary transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-14 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-medium"
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

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3 ml-1">
                                Access Role
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`flex flex-col items-center justify-center px-2 py-4 border rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all ${role === 'student'
                                        ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary shadow-lg shadow-accent-primary/10'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                                        }`}
                                >
                                    <GraduationCap className="w-5 h-5 mb-2" />
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('mentor')}
                                    className={`flex flex-col items-center justify-center px-2 py-4 border rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all ${role === 'mentor'
                                        ? 'bg-accent-secondary/20 border-accent-secondary/50 text-accent-secondary shadow-lg shadow-accent-secondary/10'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                                        }`}
                                >
                                    <Users className="w-5 h-5 mb-2" />
                                    Mentor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('club')}
                                    className={`flex flex-col items-center justify-center px-2 py-4 border rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all ${role === 'club'
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                                        }`}
                                >
                                    <ShieldAlert className="w-5 h-5 mb-2 rotate-180" />
                                    Club
                                </button>
                            </div>
                        </div>

                        {role === 'club' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label htmlFor="category" className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5 ml-1">
                                    Club Category
                                </label>
                                <div className="relative group">
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/30 transition-all font-bold text-xs uppercase tracking-widest"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <ArrowRight className="h-4 w-4 text-slate-500 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative group"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-accent-primary to-accent-secondary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative flex justify-center py-4 px-4 bg-linear-to-r from-accent-primary to-accent-secondary rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all items-center shadow-xl">
                                    {loading ? (
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    ) : null}
                                    {loading ? 'Processing...' : 'Create Account'}
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

export default SignupPage;

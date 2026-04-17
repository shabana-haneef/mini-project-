import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await axios.get(`/api/auth/verify/${token}`);
                setStatus('success');
                setMessage(data.message);
                
                // Auto-redirect after 5 seconds
                setTimeout(() => {
                    navigate('/student-login');
                }, 5000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        if (token) {
            verify();
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <div className="max-w-md w-full glass-morphism rounded-3xl border border-white/10 p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    {status === 'verifying' && (
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                            <XCircle className="w-10 h-10 text-rose-500" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">
                        {status === 'verifying' ? 'Verifying Email' : status === 'success' ? 'Email Verified' : 'Verification Failed'}
                    </h1>
                    <p className="text-slate-400 font-medium">
                        {status === 'verifying' ? 'Please wait while we confirm your email address...' : message}
                    </p>
                </div>

                {status === 'success' && (
                    <div className="pt-4 animate-in slide-in-from-bottom-2 duration-700">
                        <Link 
                            to="/student-login"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                        >
                            Go to Login <ArrowRight size={16} />
                        </Link>
                        <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest">
                            Redirecting in 5 seconds...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="pt-4 space-y-4">
                        <Link 
                            to="/guest"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                        >
                            Back to Home
                        </Link>
                        <p className="text-xs text-slate-500">
                            The link may have expired (24h limit). Try registering again or contact support.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;

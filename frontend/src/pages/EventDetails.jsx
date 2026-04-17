import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Loader2, ShieldCheck, Share2, Heart, ExternalLink, FileText, CheckCircle } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await eventService.getEventById(id);
                setEvent(data);
            } catch (error) {
                console.error('Failed to fetch event:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        setMsg({ type: '', text: '' });
        try {
            await eventService.registerForEvent(id);
            setMsg({ type: 'success', text: 'Successfully registered for this event!' });
            const data = await eventService.getEventById(id);
            setEvent(data);
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed.' });
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                <div className="h-112 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-medium overflow-hidden">
                    <Calendar className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Event Not Located</h2>
                <p className="text-slate-400 mb-8 font-medium">The experience you're looking for might have been removed or doesn't exist.</p>
                <Link to="/club/events" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Return to Experiences
                </Link>
            </div>
        );
    }

    const isRegistered = user && event.registrations.includes(user._id);

    return (
        <div className="pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate('/club/events')}
                className="flex items-center text-slate-400 hover:text-accent-primary transition-colors font-bold text-sm bg-white/5 py-2 px-4 rounded-xl w-fit"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-morphism rounded-[2.5rem] overflow-hidden border border-white/10 relative group">
                        <div className="h-112 bg-white/5 relative">
                            {event.posterImage ? (
                                <img src={event.posterImage} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent-primary/20 to-accent-secondary/20">
                                    <Calendar className="w-32 h-32 text-white/20" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-10 bg-linear-to-t from-dark-bg via-dark-bg/80 to-transparent">
                                <div className="glass-morphism border-accent-primary/30 text-accent-primary px-4 py-1.5 rounded-full text-[10px] font-black w-fit mb-4 uppercase tracking-widest shadow-lg">
                                    {event.clubName}
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                                    {event.title}
                                </h1>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-dark-bg/50 backdrop-blur-md">
                            <div className="flex flex-wrap gap-6 items-center pb-8 border-b border-white/10">
                                <div className="flex items-center bg-white/5 pr-6 rounded-2xl border border-white/5">
                                    <div className="bg-accent-primary/10 p-4 rounded-2xl mr-4">
                                        <Calendar className="w-5 h-5 text-accent-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                        <p className="font-bold text-white text-sm">{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center bg-white/5 pr-6 rounded-2xl border border-white/5">
                                    <div className="bg-accent-secondary/10 p-4 rounded-2xl mr-4">
                                        <Clock className="w-5 h-5 text-accent-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                                        <p className="font-bold text-white text-sm">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center bg-white/5 pr-6 rounded-2xl border border-white/5">
                                    <div className="bg-emerald-500/10 p-4 rounded-2xl mr-4">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</p>
                                        <p className="font-bold text-white text-sm">{event.venue}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center">
                                    <FileText className="w-5 h-5 mr-3 text-accent-primary" />
                                    About This Experience
                                </h3>
                                <div className="text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-white/5 p-6 md:p-8 rounded-3xl border border-white/5">
                                    {event.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl"></div>
                        <div className="flex items-center relative z-10">
                            <div className="bg-accent-secondary/10 p-4 rounded-2xl mr-6 border border-accent-secondary/20">
                                <ShieldCheck className="w-6 h-6 text-accent-secondary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-white">Verified Campus Event</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Organized by {event.clubName}</p>
                            </div>
                        </div>
                        <div className="flex space-x-4 relative z-10">
                            <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:text-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-all focus:outline-none text-slate-400 group">
                                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:text-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all focus:outline-none text-slate-400 group">
                                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Registration Sidebar */}
                <div className="space-y-6">
                    <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden lg:sticky lg:top-24">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
                        <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Registration</h3>

                        <div className="space-y-6 mb-8 relative z-10">
                            <div className="flex justify-between items-center text-sm bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Access Fee</span>
                                <span className="text-emerald-400 font-black text-lg">Free</span>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Capacity Status</span>
                                    <span className="font-black text-white">{event.capacity - event.registrations.length} <span className="text-slate-500 font-medium">Spots Left</span></span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 border border-white/5">
                                    <div
                                        className="bg-linear-to-r from-emerald-400 to-accent-primary h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                        style={{ width: `${(event.registrations.length / event.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {msg.text && (
                            <div className={`mb-6 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center relative z-10 ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                {msg.type === 'success' && <CheckCircle className="w-4 h-4 mr-2" />}
                                {msg.text}
                            </div>
                        )}

                        {user?.role !== 'superadmin' && (
                            <div className="relative z-10">
                                {isRegistered ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-5 rounded-2xl flex items-center justify-center font-black text-sm uppercase tracking-widest shadow-xl">
                                        <CheckCircle className="mr-2 w-5 h-5" /> Secured Spot
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={registering || event.registrations.length >= event.capacity}
                                        className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-accent-primary to-accent-secondary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="relative flex justify-center py-5 px-4 bg-linear-to-r from-accent-primary to-accent-secondary rounded-2xl text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all items-center shadow-xl">
                                            {registering ? <Loader2 className="w-5 h-5 mr-3 animate-spin text-white" /> : null}
                                            {event.registrations.length >= event.capacity ? 'Capacity Reached' : 'Secure Your Spot'}
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}

                        <p className="mt-8 text-center text-slate-500 text-[10px] uppercase tracking-widest font-black relative z-10">
                            By securing a spot, you adhere to the campus code of conduct.
                        </p>
                    </div>

                    <div className="glass-morphism bg-accent-primary/5 rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h4 className="text-sm font-black text-white mb-2 tracking-tight uppercase">Inquiries?</h4>
                            <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                                Need specific accommodations or have questions regarding the venue or schedule?
                            </p>
                            <a href={`mailto:${event.coordinator?.email}`} className="flex items-center justify-center w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-white font-bold text-xs transition-colors group/btn">
                                Contact Organizer <ExternalLink className="ml-2 w-3.5 h-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

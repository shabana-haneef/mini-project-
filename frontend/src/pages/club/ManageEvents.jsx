import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';
import { Calendar, Users, Edit, Trash2, Loader2, Search, Filter, AlertCircle, Plus } from 'lucide-react';

const ManageEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const fetchClubEvents = async () => {
            try {
                const data = await eventService.getClubEvents();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch club events:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchClubEvents();
        }
    }, [user]);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await eventService.deleteEvent(deleteId);
            setEvents(events.filter(e => e._id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error('Failed to delete event:', error);
            // Fallback for missing delete routes handling
            if (error.response?.status === 404) {
                 toast.error('Event not found or already deleted.');
                 setEvents(events.filter(e => e._id !== deleteId));
            } else {
                 toast.error(error.response?.data?.message || 'Security clearance failed. Action aborted.');
            }
        }
    };

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.status && e.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Manage Events</h1>
                    <p className="text-slate-400 mt-2 font-medium">Oversee and configure your club's academic events.</p>
                </div>
                {user?.role !== 'superadmin' && (
                    <Link
                        to="/club/events/create"
                        className="flex items-center justify-center px-6 py-3 bg-linear-to-r from-accent-primary to-accent-secondary text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 shadow-xl shadow-accent-primary/20 transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Launch Event
                    </Link>
                )}
            </header>

            <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-primary w-4 h-4 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-14 pr-4 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 transition-all"
                        />
                    </div>
                    <button className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all w-full sm:w-auto">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </button>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Event</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell whitespace-nowrap">Date & Time</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Registrations</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Status</th>
                                <th className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <tr key={event._id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                                        <td className="py-5 px-6 md:px-8 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center mr-4 border border-accent-primary/20 shrink-0">
                                                    <Calendar className="w-5 h-5 text-accent-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-accent-primary transition-colors">{event.title}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{event.venue}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 md:px-8 hidden md:table-cell whitespace-nowrap">
                                            <p className="text-sm font-medium text-slate-300">{new Date(event.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500 font-medium">{event.time}</p>
                                        </td>
                                        <td className="py-5 px-6 md:px-8 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 text-accent-secondary mr-2" />
                                                <span className="text-sm font-bold text-white">{event.registrations?.length || 0}</span>
                                                <span className="text-xs font-medium text-slate-500 ml-1">/ {event.capacity}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-accent-secondary rounded-full"
                                                    style={{ width: `${Math.min(((event.registrations?.length || 0) / event.capacity) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 md:px-8 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                event.status === 'approved' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : event.status === 'pending'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {event.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 md:px-8 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end space-x-2">
                                                {user?.role !== 'superadmin' ? (
                                                    <>
                                                        <Link to={`/club/events/edit/${event._id}`} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-accent-primary transition-colors text-slate-400">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(event._id)}
                                                            className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors text-slate-400"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">LOCKED</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <AlertCircle className="w-8 h-8 text-slate-500" />
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-white">No Events Found</p>
                                        <p className="text-sm font-medium text-slate-400 mt-1">You haven't created any events yet or none match your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-dark-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-morphism rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl relative overflow-hidden slide-in-from-bottom-4">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-black text-white mb-2 relative z-10">Confirm Deletion</h3>
                        <p className="text-slate-400 text-sm font-medium mb-8 relative z-10">
                            Are you sure you want to delete this event? This action cannot be undone and will remove all registrations.
                        </p>
                        <div className="flex gap-4 relative z-10 bg-black">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEvents;

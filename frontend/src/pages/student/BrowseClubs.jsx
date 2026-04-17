import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clubService from '../../services/clubService';
import { Users, MapPin, Loader2, Search, Filter } from 'lucide-react';

const categories = ['All Clubs', 'Technical', 'Cultural', 'Sports', 'Literary', 'Social Service', 'Arts'];

const BrowseClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Clubs');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const data = await clubService.getAllClubs();
                setClubs(data);
            } catch (error) {
                console.error('Failed to fetch clubs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const filteredClubs = clubs.filter(club => {
        const matchesTab = activeTab === 'All Clubs' || club.category?.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = club.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    if (loading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-accent-primary animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Browse Ecosystem</h1>
                    <p className="text-slate-400 mt-2 font-medium">Explore and connect with specialized student organizations.</p>
                </div>
            </header>

            {/* Filter Suite */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${activeTab === cat
                                ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-lg'
                                : 'bg-white border-[#0f172a]/10 text-[#0f172a] hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-primary w-4 h-4 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search collective..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-14 py-3"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                {filteredClubs.length > 0 ? filteredClubs.map(club => (
                    <div key={club._id} className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-accent-primary/30 transition-all group hover:-translate-y-2">
                        {/* Top half - Gray bg with circular logo */}
                        <div className="h-44 bg-white/5 flex items-center justify-center relative border-b border-white/5 overflow-hidden">
                            <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
                            {club.gallery && club.gallery.length > 0 ? (
                                <img
                                    src={`http://localhost:5000/${club.gallery[0].replace(/\\/g, '/')}`}
                                    alt={club.user?.name}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white/10 relative z-10 group-hover:border-accent-primary/40 transition-colors shadow-2xl"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-dark-bg border-4 border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-500 relative z-10 group-hover:border-accent-primary/40 transition-colors shadow-2xl">
                                    [No Logo]
                                </div>
                            )}
                        </div>

                        {/* Card Body */}
                        <div className="p-8">
                            <div className="inline-block px-3 py-1 bg-accent-secondary/10 text-accent-secondary text-[9px] font-black tracking-widest border border-accent-secondary/20 mb-5 uppercase rounded-lg">
                                {club.category}
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 group-hover:text-accent-primary transition-colors">{club.user?.name || 'Unknown Club'}</h3>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center text-xs font-bold text-slate-400">
                                    <Users className="w-4 h-4 mr-3 text-accent-primary" />
                                    {club.members || 0} Members
                                </div>
                                <div className="flex items-center text-xs font-bold text-slate-400">
                                    <MapPin className="w-4 h-4 mr-3 text-accent-secondary" />
                                    {club.location || 'Strategic Location'}
                                </div>
                            </div>

                            <Link
                                to={`/student/clubs/${club._id}`}
                                className="btn-secondary bg-[#0f172a] text-white hover:bg-[#1e293b]"
                            >
                                View More &rarr;
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <Search className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-black text-white">No Matches Found</h3>
                        <p className="text-slate-500 font-medium mt-2">The requested collective is currently offline or outside our network.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseClubs;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import teamMemberService from '../../services/teamMemberService';
import { Plus, Search, Loader2, Trash2, Edit, Users, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageTeam = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        lead_position: '',
        student_name: '',
        phone_number: '',
        whatsapp_number: '',
        email: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                if (user && user._id) {
                    const data = await teamMemberService.getTeamMembers(user._id);
                    setTeam(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (member) => {
        setEditingId(member._id);
        setFormData({
            lead_position: member.lead_position || '',
            student_name: member.student_name || '',
            phone_number: member.phone_number || '',
            whatsapp_number: member.whatsapp_number || '',
            email: member.email || ''
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this team member?')) {
            try {
                await teamMemberService.deleteTeamMember(id);
                setTeam(team.filter(m => m._id !== id));
                toast.success('Member deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete member.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (team.length >= 20 && !editingId) {
            toast.error('Maximum 20 members allowed for one club.');
            return;
        }

        setFormLoading(true);
        try {
            if (editingId) {
                const updated = await teamMemberService.updateTeamMember(editingId, formData);
                setTeam(prev => Array.isArray(prev) ? prev.map(m => m._id === editingId ? updated : m) : [updated]);
            } else {
                const created = await teamMemberService.createTeamMember(formData);
                setTeam(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            }
            resetForm();
            toast.success(editingId ? 'Member updated successfully.' : 'Member added successfully.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving member');
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            lead_position: '',
            student_name: '',
            phone_number: '',
            whatsapp_number: '',
            email: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
            </div>
        );
    }

    const safeTeam = Array.isArray(team) ? team : [];
    const filteredTeam = safeTeam.filter(m =>
        (m.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.lead_position || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Team Management</h1>
                    <p className="text-slate-400 mt-2 font-medium">Add and manage up to 20 team members for your club profile.</p>
                </div>
                {!showForm && (
                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={() => setShowForm(true)}
                            disabled={team.length >= 20}
                            className={`flex items-center px-6 py-3 rounded-2xl font-bold transition-all ${team.length >= 20
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                                }`}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Member
                        </button>
                        {team.length >= 20 && (
                            <span className="text-xs font-bold text-red-400 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Maximum 20 members allowed for one club.
                            </span>
                        )}
                    </div>
                )}
            </header>

            {showForm ? (
                <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {editingId ? 'Update Member Profile' : 'New Member Entry'}
                            </h2>
                            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white transition-colors">
                                Close Form
                            </button>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Lead Position *</label>
                                <input
                                    required
                                    type="text"
                                    name="lead_position"
                                    value={formData.lead_position}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    placeholder="e.g. Technical Lead"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student Name *</label>
                                <input
                                    required
                                    type="text"
                                    name="student_name"
                                    value={formData.student_name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    placeholder="e.g. John Mathew"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number *</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        required
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number *</label>
                                <div className="relative group">
                                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        required
                                        type="tel"
                                        name="whatsapp_number"
                                        value={formData.whatsapp_number}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        placeholder="Same as phone or different"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email ID (Optional)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 py-3 bg-white/5 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center disabled:opacity-50"
                            >
                                {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                {editingId ? 'Update Member' : 'Save Member'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass-morphism rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or position..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-3 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Total Members: {team.length} / 20
                            </span>
                        </div>
                    </div>

                    {filteredTeam.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTeam.map(member => (
                                <div key={member._id} className="glass-morphism border border-white/10 rounded-4xl p-6 hover:border-white/20 transition-all group relative overflow-hidden">
                                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button onClick={() => handleEdit(member)} className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(member._id)} className="w-9 h-9 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">
                                                {member.lead_position}
                                            </p>
                                            <h3 className="text-xl font-black text-white">{member.student_name}</h3>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-white/5">
                                            <div className="flex items-center text-sm font-bold text-slate-400">
                                                <Phone className="w-4 h-4 mr-3 text-slate-600 shrink-0" />
                                                {member.phone_number}
                                            </div>
                                            <div className="flex items-center text-sm font-bold text-slate-400">
                                                <MessageSquare className="w-4 h-4 mr-3 text-slate-600 shrink-0" />
                                                {member.whatsapp_number}
                                            </div>
                                            {member.email && (
                                                <div className="flex items-center text-sm font-bold text-slate-400">
                                                    <Mail className="w-4 h-4 mr-3 text-slate-600 shrink-0" />
                                                    <span className="truncate">{member.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-morphism rounded-[3rem] border border-white/10 p-20 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                <Users className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-black text-white">No Team Members Added</h3>
                            <p className="text-slate-400 mt-3 font-medium max-w-sm mx-auto">Start building your club's ExCom list to showcase your leadership team.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-10 px-10 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                Add First Member
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageTeam;

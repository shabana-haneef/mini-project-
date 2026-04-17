import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import eventService from "../../services/eventService";
import {
  Calendar,
  FileText,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  Plus,
  Info,
  Zap,
} from "lucide-react";

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    capacity: 50,
    clubName: "",
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "clubName" && !formData[key]) {
          data.append(key, user?.name || "Club");
        } else {
          data.append(key, formData[key]);
        }
      });
      if (posterFile) {
        data.append("posterImage", posterFile);
      }
      await eventService.createEvent(data);
      navigate("/club/events");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Synchronization failure. Check connectivity.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-white mb-6 transition-colors font-black text-[10px] uppercase tracking-widest group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Management Return
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center">
            <Zap className="w-8 h-8 mr-4 text-accent-primary" />
            Initiate New Event
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Broadcast your club's vision to the entire academic network.
          </p>
        </div>
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-accent-secondary bg-accent-secondary/10 px-4 py-2 rounded-2xl border border-accent-secondary/20 shadow-xl shadow-accent-secondary/5">
          <Info className="w-3.5 h-3.5 mr-2" /> Global Broadcast Mode
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        {/* Visual Assets Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl"></div>

            <label className="w-full cursor-pointer group">
              <div className="relative aspect-3/4 w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:bg-white/10 group-hover:border-accent-primary/30">
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt="Poster"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="p-4 bg-white/5 rounded-2xl mb-4 text-slate-500 group-hover:text-accent-primary transition-colors">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">
                      Upload Event Poster
                    </p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2">
                      Recommended: 1080x1350px
                    </p>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePosterChange}
                />
              </div>
            </label>

            <div className="mt-8 pt-8 border-t border-white/10 w-full text-left space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Maximum Enthusiasts
                </label>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3 text-accent-primary" />
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="bg-transparent text-white font-black text-2xl outline-none w-20 border-b border-transparent focus:border-accent-primary"
                  />
                  <span className="text-slate-500 font-bold ml-2">
                    Capacity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-morphism rounded-[2.5rem] p-8 md:p-10 border border-white/10 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center">
                  <Zap size={12} className="mr-1.5 text-accent-primary" />
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Quantum Computing Workshop"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white font-bold text-lg focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all placeholder-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center">
                  <MapPin size={12} className="mr-1.5 text-accent-secondary" />
                  Strategic Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Conference Hall A"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-2 focus:ring-accent-secondary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center">
                  <Users size={12} className="mr-1.5 text-accent-primary" />
                  Organizing Body
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  placeholder={user?.name || "Innovation Club"}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center">
                  <Calendar
                    size={12}
                    className="mr-1.5 text-accent-secondary"
                  />
                  Event Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-2 focus:ring-accent-secondary/20 outline-none transition-all invert-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center">
                  <Clock size={12} className="mr-1.5 text-accent-primary" />
                  Commencement Time
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2 pt-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center">
                  <FileText
                    size={12}
                    className="mr-1.5 text-accent-secondary"
                  />
                  Creative Vision & Agenda
                </label>
                <textarea
                  name="description"
                  required
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white font-medium text-sm leading-relaxed focus:ring-2 focus:ring-accent-secondary/20 outline-none transition-all resize-none"
                  placeholder="Elaborate on the impact and core focus of this experience..."
                />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                Status: Direct Synchronization Enabled
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-5 bg-linear-to-r from-accent-primary to-accent-secondary text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading && <Loader2 className="w-4 h-4 mr-3 animate-spin" />}
                Broadcast Event
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

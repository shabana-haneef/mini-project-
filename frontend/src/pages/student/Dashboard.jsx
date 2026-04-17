import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen, Clock, ChevronRight, Loader2, Download,
  FileVideo, FileText, Users, Bell, Calendar, Megaphone,
  Sparkles, RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import academicService from "../../services/academicService";
import eventService from "../../services/eventService";
import activityService from "../../services/activityService";
import clubService from "../../services/clubService";

// ─── Utility ────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const contentIcon = (type) =>
  type === 'video' ? <FileVideo className="w-4 h-4" /> : <FileText className="w-4 h-4" />;

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, color, viewAllPath, viewAllLabel }) => (
  <div className={`p-5 border-b border-white/5 flex justify-between items-center bg-${color}/5`}>
    <h2 className="text-base font-black text-white flex items-center gap-2">
      <Icon className={`w-5 h-5 text-${color}`} />
      {title}
    </h2>
    <Link
      to={viewAllPath}
      className={`flex items-center text-[10px] font-black uppercase tracking-widest text-${color} hover:opacity-80 transition-opacity`}
    >
      {viewAllLabel || 'View All'} <ChevronRight className="w-3.5 h-3.5 ml-1" />
    </Link>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const Empty = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
    <Icon className="w-8 h-8 opacity-20 mb-2" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-3 p-5">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />
    ))}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();

  const [resources,      setResources]      = useState([]);
  const [events,         setEvents]         = useState([]);
  const [announcements,  setAnnouncements]  = useState([]);
  const [clubs,          setClubs]          = useState([]);
  const [downloads,      setDownloads]      = useState([]);

  const [loading, setLoading] = useState({
    resources: true, events: true, announcements: true, clubs: true, downloads: true
  });

  const setDone = (key) => setLoading(prev => ({ ...prev, [key]: false }));

  const fetchAll = useCallback(async () => {
    setLoading({ resources: true, events: true, announcements: true, clubs: true, downloads: true });

    // Resources — latest 4
    academicService.getAllContent()
      .then(data => setResources((data || []).slice(0, 4)))
      .catch(() => setResources([]))
      .finally(() => setDone('resources'));

    // Events — upcoming, sorted earliest first, limit 4
    eventService.getEvents()
      .then(data => {
        const sorted = (data || [])
          .filter(e => e.status !== 'cancelled')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 4);
        setEvents(sorted);
      })
      .catch(() => setEvents([]))
      .finally(() => setDone('events'));

    // Announcements — activity posts, latest 4
    activityService.getPosts()
      .then(data => setAnnouncements((data || []).slice(0, 4)))
      .catch(() => setAnnouncements([]))
      .finally(() => setDone('announcements'));

    // Clubs — newest 4 (by createdAt desc)
    clubService.getAllClubs
      ? clubService.getAllClubs()
          .then(data => setClubs((data || []).slice(0, 4)))
          .catch(() => setClubs([]))
          .finally(() => setDone('clubs'))
      : setDone('clubs');

    // My Downloads count
    if (user) {
      academicService.getMyDownloads()
        .then(data => setDownloads(data || []))
        .catch(() => setDownloads([]))
        .finally(() => setDone('downloads'));
    } else {
      setDone('downloads');
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="text-accent-primary">{user?.name?.split(' ')[0] || 'Student'}</span>!
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Here's what's happening on campus.</p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Downloads',  value: loading.downloads ? '…' : downloads.length, icon: Download,  color: 'accent-primary',   link: '/student/downloads' },
          { label: 'Latest Resources', value: loading.resources ? '…' : resources.length, icon: FileText,  color: 'accent-secondary', link: '/student/resources' },
          { label: 'Upcoming Events',  value: loading.events ? '…' : events.length,    icon: Calendar,  color: 'indigo-400',        link: '/student/dashboard#events' },
          { label: 'Club Posts',       value: loading.announcements ? '…' : announcements.length, icon: Bell, color: 'emerald-400', link: '/student/announcements' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link}
            className="glass-morphism p-4 rounded-2xl border border-white/5 hover:border-white/10 flex items-center gap-3 group transition-all hover:-translate-y-0.5"
          >
            <div className={`p-3 rounded-xl bg-${color}/10 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-5 h-5 text-${color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-white leading-none">{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Latest Resources ── */}
        <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden flex flex-col">
          <SectionHeader icon={Sparkles} title="Latest Resources" color="accent-secondary"
            viewAllPath="/student/resources" viewAllLabel="Browse All" />
          {loading.resources ? <Skeleton /> : (
            <div className="p-4 flex-1 space-y-2">
              {resources.length > 0 ? resources.map(item => (
                <Link key={item._id} to={`/student/content/${item._id}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 group transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary shrink-0 group-hover:scale-110 transition-transform">
                    {contentIcon(item.contentType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-accent-secondary transition-colors">{item.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {item.mentor?.name} · {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 shrink-0">
                    {item.contentType}
                  </span>
                </Link>
              )) : <Empty icon={FileText} message="No resources uploaded yet" />}
            </div>
          )}
        </div>

        {/* ── Upcoming Events ── */}
        <div id="events" className="glass-morphism rounded-3xl border border-white/10 overflow-hidden flex flex-col">
          <SectionHeader icon={Calendar} title="Upcoming Events" color="indigo-400"
            viewAllPath="/student/dashboard" viewAllLabel="See All" />
          {loading.events ? <Skeleton /> : (
            <div className="p-4 flex-1 space-y-2">
              {events.length > 0 ? events.map(ev => (
                <div key={ev._id}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 font-black text-xs text-center leading-tight p-1">
                    {ev.date ? new Date(ev.date).toLocaleDateString('en', { day: '2-digit', month: 'short' }) : '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{ev.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ev.time || 'TBA'} &nbsp;·&nbsp; {ev.location || 'On Campus'}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg shrink-0 ${
                    ev.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>{ev.status}</span>
                </div>
              )) : <Empty icon={Calendar} message="No upcoming events" />}
            </div>
          )}
        </div>

        {/* ── Club Announcements ── */}
        <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden flex flex-col">
          <SectionHeader icon={Megaphone} title="Club Announcements" color="emerald-400"
            viewAllPath="/student/announcements" viewAllLabel="View All" />
          {loading.announcements ? <Skeleton /> : (
            <div className="p-4 flex-1 space-y-2">
              {announcements.length > 0 ? announcements.map(post => (
                <div key={post._id}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400 text-xs font-black shrink-0">
                      {post.club?.name?.charAt(0) || 'C'}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 truncate">
                      {post.club?.name || 'Club'}
                    </p>
                    <p className="text-[10px] text-slate-500 ml-auto shrink-0">{timeAgo(post.createdAt)}</p>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug line-clamp-2">{post.content}</p>
                </div>
              )) : <Empty icon={Bell} message="No announcements yet" />}
            </div>
          )}
        </div>

        {/* ── New Clubs ── */}
        <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden flex flex-col">
          <SectionHeader icon={Users} title="Campus Clubs" color="accent-primary"
            viewAllPath="/student/clubs" viewAllLabel="Explore All" />
          {loading.clubs ? <Skeleton /> : (
            <div className="p-4 flex-1 space-y-2">
              {clubs.length > 0 ? clubs.map(club => (
                <Link key={club._id} to={`/student/clubs`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 group transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary font-black text-sm shrink-0 group-hover:scale-110 transition-transform">
                    {club.user?.name?.charAt(0) || club.category?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-accent-primary transition-colors">
                      {club.user?.name || 'Campus Club'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{club.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </Link>
              )) : <Empty icon={Users} message="No clubs registered yet" />}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Award,
  Calendar,
  ArrowLeft,
  User,
  GraduationCap,
  Loader2,
  MessageSquare,
  Bell
} from "lucide-react";
import clubService from "../../services/clubService";
import teamMemberService from "../../services/teamMemberService";
import activityService from "../../services/activityService";

const ClubPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubData = await clubService.getClubById(id);
        setClub(clubData);
        if (clubData && clubData.user) {
          const userId = clubData.user._id || clubData.user;
          const [membersData, announcementsData] = await Promise.all([
            teamMemberService.getTeamMembers(userId),
            activityService.getPosts(userId)
          ]);
          setTeamMembers(membersData);
          setAnnouncements(announcementsData);
        }
      } catch (err) {
        console.error("Failed to fetch club or team:", err);
        setError("Club not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClub();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <Link
          to="/student/clubs"
          className="flex items-center text-accent-primary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clubs
        </Link>
        <div className="glass-morphism rounded-3xl border border-white/10 p-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Club Not Found</h1>
          <p className="text-slate-400 mb-6">
            {error || "The requested club does not exist."}
          </p>
          <button
            onClick={() => navigate("/student/clubs")}
            className="bg-accent-primary text-white px-6 py-2 rounded-xl font-bold hover:opacity-90"
          >
            Browse Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header / Breadcrumb */}

      {/* Club Identity Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
        <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
          {club.gallery && club.gallery.length > 0 ? (
            <img
              src={`http://localhost:5000/${club.gallery[0].replace(/\\/g, '/')}`}
              alt={club.user?.name || 'Club'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest">[No Logo]</span>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-bold tracking-wider mb-4 uppercase">
            {club.category}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
            {club.user?.name || "Unknown Club"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-6">
            {club.description}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 mr-2 text-slate-400" />
              {club.members} Members
            </div>
            <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              {club.location}
            </div>
          </div>
        </div>
      </div>


      {/* EXCOM & Team Members Section */}
      {teamMembers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-100 dark:border-slate-700 pb-2">
            Team & EXCOM Members
          </h3>

          {Object.entries(
            teamMembers.reduce((acc, member) => {
              const group = member.lead_position || 'Team Members';
              if (!acc[group]) acc[group] = [];
              acc[group].push(member);
              return acc;
            }, {})
          ).map(([groupName, members]) => (
            <div key={groupName} className="mb-10 last:mb-0 animate-in fade-in">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                <span className="w-2 h-2 rounded-full bg-accent-primary mr-3"></span>
                {groupName}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <div key={member._id} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white leading-tight">
                      {member.student_name}
                    </h5>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">
                      {member.lead_position}
                    </p>

                    <div className="mt-4 w-full space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-center">
                        <Phone className="w-3 h-3 mr-1.5 shrink-0" />
                        <span>{member.phone_number}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 mr-1.5 shrink-0" />
                        <span>{member.whatsapp_number}</span>
                      </div>
                      {member.email && (
                        <div className="flex items-center justify-center">
                          <Mail className="w-3 h-3 mr-1.5 shrink-0" />
                          <span className="truncate max-w-[150px]" title={member.email}>{member.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid (Events, Stats, Gallery, Social) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Events & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-8 h-full">
          {/* Announcements */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center">
              <Bell className="w-4 h-4 mr-2" /> Club Announcements
            </h3>
            <div className="space-y-4">
              {announcements.length > 0 ? announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="flex flex-col p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all cursor-pointer rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {announcement.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-2 py-1 rounded">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {announcement.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-2"></span>
                      {announcement.type}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 text-sm font-medium border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  No announcements broadcasted yet.
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex-grow flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
              Club Gallery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow content-start">
              {club.gallery && club.gallery.length > 0 ? club.gallery.map((i, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600 grayscale hover:grayscale-0 transition-all cursor-pointer"
                >
                  <img src={`http://localhost:5000/${i.replace(/\\/g, '/')}`} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              )) : (
                <p className="text-sm text-slate-500 font-medium col-span-full">No gallery photos attached.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="flex flex-col gap-8 h-full">
          {/* Club Statistics */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-700 pb-2">
              Achievements
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-4">
                < Award className="w-8 h-8 text-slate-300" />
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                    {club.achievements?.length || 0}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Awards Won
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-slate-300" />
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                    {announcements?.length || 0}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Announcements
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex-grow flex flex-col justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-700 pb-2">
              Stay Connected
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors font-medium">
                <Globe className="w-4 h-4" /> <span>{club.website}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors font-medium">
                <Mail className="w-4 h-4" /> <span>{club.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors mx-auto" />
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors mx-auto" />
              <Facebook className="w-5 h-5 text-slate-400 hover:text-blue-700 cursor-pointer transition-colors mx-auto" />
              <Twitter className="w-5 h-5 text-slate-400 hover:text-sky-500 cursor-pointer transition-colors mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPublicProfile;

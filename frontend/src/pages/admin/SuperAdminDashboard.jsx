import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Users, Building2, CalendarRange, ShieldCheck, Loader2, Key } from "lucide-react";
import { Link } from "react-router-dom";
import eventService from "../../services/eventService";
import clubService from "../../services/clubService";

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClubs: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clubsData, eventsData] = await Promise.all([
          clubService.getAllClubs().catch(() => []),
          eventService.getEvents().catch(() => []),
        ]);

        setStats({
          totalUsers: 0, 
          activeClubs: Array.isArray(clubsData) ? clubsData.length : 0,
          totalEvents: Array.isArray(eventsData) ? eventsData.length : 0,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Active Clubs",
      value: stats.activeClubs,
      icon: Building2,
      color: "blue-500",
    },
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: CalendarRange,
      color: "purple-500",
    },
    {
      label: "System Status",
      value: "Master Active",
      icon: ShieldCheck,
      color: "red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Master Overview, <span className="text-red-500">{user?.name}</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Supreme platform analytics and administration controls.
          </p>
        </div>
        <div className="flex items-center text-xs font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20">
          <Key className="w-4 h-4 mr-2" /> Master Access
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="glass-morphism p-6 rounded-3xl flex items-center space-x-4 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className={`p-4 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-morphism rounded-3xl border border-white/10 p-8 overflow-hidden flex flex-col relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors"></div>
        <Users className="w-8 h-8 text-red-500 mb-4 relative z-10" />
        <h3 className="text-xl font-black text-white mb-2 relative z-10">
          Global User Management
        </h3>
        <p className="text-sm text-slate-400 mb-6 relative z-10">
          View and manage all system users and their roles with master privileges.
        </p>
        <Link
          to="/admin/users"
          className="mt-auto bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-3 rounded-xl font-bold text-sm transition-all border border-red-500/30 relative z-10 text-center inline-block max-w-[200px]"
        >
          Manage All Users
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

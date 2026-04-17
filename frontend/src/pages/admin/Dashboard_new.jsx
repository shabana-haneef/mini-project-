import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Building2,
  CalendarRange,
  CheckSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import eventService from "../../services/eventService";
import clubService from "../../services/clubService";

const AdminDashboard = () => {
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
          totalUsers: 0, // Will be calculated from clubs/events
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
      color: "accent-secondary",
    },
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: CalendarRange,
      color: "emerald-500",
    },
    {
      label: "System Status",
      value: "Healthy",
      icon: ShieldCheck,
      color: "green-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            System Overview,{" "}
            <span className="text-emerald-500">{user?.name}</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Global platform analytics and administration controls.
          </p>
        </div>
        <div className="flex items-center text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 mr-2" /> System Healthy
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="glass-morphism p-6 rounded-3xl flex items-center space-x-4 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div
              className={`p-4 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20`}
            >
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

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-morphism rounded-3xl border border-white/10 p-8 overflow-hidden flex flex-col relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-accent-primary/10 transition-colors"></div>
          <CheckSquare className="w-8 h-8 text-accent-primary mb-4 relative z-10" />
          <h3 className="text-xl font-black text-white mb-2 relative z-10">
            Pending Approvals
          </h3>
          <p className="text-sm text-slate-400 mb-6 relative z-10">
            Review and manage pending club and event requests.
          </p>
          <Link
            to="/admin/approvals"
            className="mt-auto bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary px-4 py-3 rounded-xl font-bold text-sm transition-all border border-accent-primary/30 relative z-10 text-center"
          >
            View Approvals
          </Link>
        </div>

        <div className="glass-morphism rounded-3xl border border-white/10 p-8 overflow-hidden flex flex-col relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-accent-secondary/10 transition-colors"></div>
          <Users className="w-8 h-8 text-accent-secondary mb-4 relative z-10" />
          <h3 className="text-xl font-black text-white mb-2 relative z-10">
            User Management
          </h3>
          <p className="text-sm text-slate-400 mb-6 relative z-10">
            View and manage all system users and their roles.
          </p>
          <Link
            to="/admin/users"
            className="mt-auto bg-accent-secondary/20 hover:bg-accent-secondary/30 text-accent-secondary px-4 py-3 rounded-xl font-bold text-sm transition-all border border-accent-secondary/30 relative z-10 text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

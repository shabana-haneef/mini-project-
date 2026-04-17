import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarRange,
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import eventService from "../../services/eventService";

const ClubDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const events = await eventService.getEvents();
        const clubEvents = events.filter(
          (e) =>
            e.coordinator?._id === user?._id || e.coordinator === user?._id,
        );

        const activeEvents = clubEvents.filter(
          (e) => e.status === "Upcoming",
        ).length;
        const totalRegistrations = clubEvents.reduce(
          (sum, e) => sum + (e.registrations?.length || 0),
          0,
        );
        const upcomingEvents = clubEvents.filter(
          (e) => new Date(e.date) > new Date(),
        ).length;

        setStats({
          activeEvents,
          totalRegistrations,
          upcomingEvents,
        });
        setRecentEvents(clubEvents.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch club data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClubData();
    }
  }, [user]);

  const statsArray = [
    {
      label: "Active Events",
      value: stats.activeEvents,
      icon: CalendarRange,
      color: "accent-primary",
    },
    {
      label: "Total Registrations",
      value: stats.totalRegistrations,
      icon: Users,
      color: "accent-secondary",
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: BookOpen,
      color: "emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Club Overview,{" "}
            <span className="text-accent-secondary">{user?.name}</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Manage your events and track engagement.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/club/events/create"
            className="btn-accent"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {statsArray.map((stat, index) => (
              <div
                key={index}
                className="glass-morphism p-6 rounded-3xl flex items-center space-x-4 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group"
              >
                <div
                  className={`absolute right-0 top-0 w-24 h-24 bg-${stat.color}/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-${stat.color}/20 transition-colors`}
                ></div>
                <div
                  className={`p-4 rounded-2xl bg-${stat.color}/10 relative z-10`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className="relative z-10">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Recent Events List */}
            <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-black text-white flex items-center">
                  <CalendarRange className="w-5 h-5 mr-3 text-accent-primary" />
                  Recent Events
                </h2>
                <Link
                  to="/club/events"
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Manage All
                </Link>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-[10px] uppercase tracking-widest text-slate-500 bg-white/5 font-black">
                    <tr>
                      <th className="px-6 py-4">Event Name</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">Registrations</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-white">
                          {event.title}
                        </td>
                        <td className="px-6 py-4">{event.date}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                            {event.registrations}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClubDashboard;

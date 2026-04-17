import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import academicService from "../../services/academicService";
import { useAuth } from "../../context/AuthContext";
import {
  Layout,
  Users,
  Upload,
  Eye,
  Download,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Clock,
  PlayCircle,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

const MentorDashboard = () => {
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalViews: 0,
    totalDownloads: 0,
    pendingRequests: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this content?"))
      return;

    try {
      await academicService.deleteContent(id);
      setRecentUploads((prev) => prev.filter((item) => item._id !== id));
      // Update stats
      setStats((prev) => ({
        ...prev,
        totalUploads: prev.totalUploads - 1,
      }));
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete content");
    }
  };

  const handlePreview = (e, content) => {
    e.stopPropagation();
    const url = content.fileUrl;

    // Debug logging - check what the data looks like
    console.log('=== PREVIEW DEBUG ===');
    console.log('Content ID:', content._id);
    console.log('Content Title:', content.title);
    console.log('Content Type:', content.contentType);
    console.log('File URL:', url);
    console.log('YouTube URL:', content.youtubeUrl);
    console.log('Full content object:', JSON.stringify(content, null, 2));

    if (url) {
      // Open file directly in a new browser tab (PDF, video, etc.)
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate to the embedded content viewer (handles YouTube, previews, etc.)
      navigate(`/mentor/content/${content._id}`);
    }
  };

  const handleDownload = (e, content) => {
    e.stopPropagation();

    // Track async without blocking the execution
    academicService.trackDownload(content._id).catch(err => console.error("Tracking error", err));

    const url = content.fileUrl;
    if (!url) {
      toast.error("File unavailable. Please contact support.");
      return;
    }

    let dlUrl = url;
    const isDoc = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'].some(ext => dlUrl.toLowerCase().endsWith(ext));

    if (isDoc) {
      dlUrl = dlUrl.replace('/image/upload/', '/raw/upload/').replace('/video/upload/', '/raw/upload/');
    }
    if (!isDoc && dlUrl.includes('/upload/') && !dlUrl.includes('/fl_attachment/')) {
      dlUrl = dlUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    const link = document.createElement('a');
    link.href = dlUrl;

    let ext = '';
    if (content.contentType === 'video') ext = '.mp4';
    else if (content.contentType === 'ppt') ext = '.ppt';
    else if (content.contentType === 'pdf') ext = '.pdf';

    const title = content.title ? content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'download';

    link.setAttribute('download', `${title}${ext}`);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optimistically update the download count in the UI if present
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await academicService.getAllContent(user?._id); // fetch mentor's academic content
        // Compute stats
        const totalUploads = data.length;
        const totalViews = data.reduce(
          (sum, item) => sum + (item.views || 0),
          0,
        );
        const totalDownloads = data.reduce(
          (sum, item) => sum + (item.downloads || 0),
          0,
        );
        setStats({
          totalUploads,
          totalViews,
          totalDownloads,
          pendingRequests: 0, // not tracked currently
        });
        setRecentUploads(data);

        // Debug: Log all content items and their fileUrl status
        console.log('=== DASHBOARD DATA DEBUG ===');
        data.forEach((item, i) => {
          console.log(`[${i}] ID: ${item._id} | Title: ${item.title} | Type: ${item.contentType} | fileUrl: ${item.fileUrl || 'MISSING'} | youtubeUrl: ${item.youtubeUrl || 'N/A'}`);
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Uploads",
      value: stats.totalUploads,
      icon: Upload,
      color: "blue",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "purple",
    },
    {
      label: "Downloads",
      value: stats.totalDownloads,
      icon: Download,
      color: "green",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: MessageSquare,
      color: "orange",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back! Here's how your academic content is performing.
          </p>
        </div>
        {(
          <Link
            to="/mentor/upload-resource"
            className="btn-accent"
          >
            <Plus size={20} />
            Publish Content
          </Link>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${card.color}-500/10 rounded-2xl`}>
                <card.icon className={`text-${card.color}-400`} size={24} />
              </div>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-3xl font-bold text-white">
                {card.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock size={20} className="text-blue-400" />
          Recent Uploads
        </h2>

        {/* Real Content Grid */}
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recentUploads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUploads.map((content) => (
              <div
                key={content._id}
                onClick={() => navigate(`/mentor/content/${content._id}`)}
                className="glass rounded-2xl border border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                  {content.contentType === "video" ? (
                    <PlayCircle
                      size={48}
                      className="text-white/20 group-hover:text-blue-500 transition-colors"
                    />
                  ) : (
                    <FileText
                      size={48}
                      className="text-white/20 group-hover:text-purple-500 transition-colors"
                    />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {(
                      <button
                        onClick={(e) => handleDelete(e, content._id)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg border border-red-500/20 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white">
                      {content.contentType}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                    {content.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{new Date(content.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-auto border-t border-white/5">
                    <button
                      onClick={(e) => handlePreview(e, content)}
                      className="flex-1 btn-glass py-2 px-2 text-xs bg-white/5 hover:bg-white/10 text-white font-medium flex justify-center items-center gap-1.5"
                      title="View / Preview"
                    >
                      {content.contentType === 'video' ? <><PlayCircle size={14} /> View</> : <><Eye size={14} /> View</>}
                    </button>
                    {content.fileUrl && (
                      <button
                        onClick={(e) => handleDownload(e, content)}
                        className="flex-1 btn-secondary py-2 px-2 text-xs bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-medium border border-blue-500/30 flex justify-center items-center gap-1.5 transition-colors"
                        title="Download"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center glass rounded-3xl border border-white/5">
            <BookOpen size={64} className="text-gray-700 mb-4" />
            <h3 className="text-white font-medium mb-1">No content yet</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              There are no study materials uploaded for this subject yet. Check
              back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/LandingPage";
import GuestGateway from "./pages/GuestGateway";

// Student Auth Pages
import StudentLogin from "./pages/auth/student/StudentLogin";
import StudentSignup from "./pages/auth/student/StudentSignup";

// Mentor Auth Pages
import MentorLogin from "./pages/auth/mentor/MentorLogin";
import MentorSignup from "./pages/auth/mentor/MentorSignup";

// Club Admin Auth Pages
import ClubAdminLogin from "./pages/auth/club-admin/ClubAdminLogin";
import ClubAdminSignup from "./pages/auth/club-admin/ClubAdminSignup";
import SuperAdminLogin from "./pages/auth/SuperAdminLogin";

// Layouts
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentLayout from "./layouts/portals/StudentLayout";
import MemberLayout from "./layouts/portals/MemberLayout";
import ClubLayout from "./layouts/portals/ClubLayout";
import MainLayout from "./layouts/MainLayout";

// Student Features
import StudentDashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import BrowseClubs from "./pages/student/BrowseClubs";
import MyDownloads from "./pages/student/MyDownloads";
import ClubPublicProfile from "./pages/student/ClubPublicProfile";
import PeerTeachingList from "./pages/PeerTeachingList";
import EventDetails from "./pages/EventDetails";
import AcademicPortal from "./pages/mentor/AcademicPortal";
import ClassViewer from "./pages/mentor/ClassViewer";
import NotificationPage from "./pages/notifications/NotificationPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Member Features
import MentorDashboard from "./pages/mentor/Dashboard";
import UploadContent from "./pages/mentor/UploadContent";
import MentorResources from "./pages/mentor/MentorResources";
import MentorAnalytics from "./pages/mentor/MentorAnalytics";
import Analytics from "./pages/admin/Analytics";

// Club Features
import ClubDashboard from "./pages/club/Dashboard";
import ManageEvents from "./pages/club/ManageEvents";
import CreateEvent from "./pages/club/CreateEvent";
import EditEvent from "./pages/club/EditEvent";
import ClubProfile from "./pages/club/ClubProfile";
import ManageTeam from "./pages/club/ManageTeam";

// Admin Features
import AdminDashboard from "./pages/admin/Dashboard_new";
import Approvals from "./pages/admin/Approvals";
import UserManagement from "./pages/admin/UserManagement";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-slate-100">
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'font-bold text-sm bg-slate-900 text-white border border-white/10 rounded-2xl p-4',
              duration: 4000,
            }}
          />
          <Routes>
            {/* PUBLIC LANDING */}
            <Route path="/guest" element={<GuestGateway />} />
            <Route path="/" element={<Navigate to="/guest" replace />} />

            {/* DEDICATED STUDENT AUTH */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />

            {/* DEDICATED MENTOR AUTH */}
            <Route path="/mentor/login" element={<MentorLogin />} />
            <Route path="/mentor/signup" element={<MentorSignup />} />

            {/* DEDICATED CLUB ADMIN AUTH */}
            <Route path="/club-admin/login" element={<ClubAdminLogin />} />
            <Route path="/club-admin/signup" element={<ClubAdminSignup />} />

            {/* Secret Super Admin Login */}
            <Route path="/superadmin/master-access" element={<SuperAdminLogin />} />


            <Route path="/login" element={<Navigate to="/student/login" replace />} />
            <Route path="/signup" element={<Navigate to="/student/signup" replace />} />

            {/* STUDENT PORTAL */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/announcements" element={<NotificationPage />} />
                <Route path="/student/clubs" element={<BrowseClubs />} />
                <Route path="/student/clubs/:id" element={<ClubPublicProfile />} />
                <Route path="/student/academy" element={<PeerTeachingList />} />
                <Route path="/student/resources" element={<AcademicPortal />} />
                <Route path="/student/content/:id" element={<ClassViewer />} />
                <Route path="/student/downloads" element={<MyDownloads />} />
                <Route path="/student/profile" element={<Profile />} />
                <Route path="/student/settings" element={<Settings />} />
                <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
              </Route>
            </Route>

            {/* MENTOR PORTAL */}
            <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
              <Route element={<MemberLayout />}>
                <Route path="/mentor/dashboard" element={<MentorDashboard />} />
                <Route path="/mentor/upload-resource" element={<UploadContent />} />
                <Route path="/mentor/resources" element={<MentorResources />} />
                <Route path="/mentor/content/:id" element={<ClassViewer />} />
                <Route path="/mentor/analytics" element={<MentorAnalytics />} />
                <Route path="/mentor/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* CLUB ADMIN PORTAL */}
            <Route element={<ProtectedRoute allowedRoles={["club", "coordinator"]} />}>
              <Route element={<ClubLayout />}>
                <Route path="/club/dashboard" element={<ClubDashboard />} />
                <Route path="/club/profile" element={<ClubProfile />} />
                <Route path="/club/coordinators" element={<ManageTeam />} />
                <Route path="/club/announcements" element={<NotificationPage />} />
                <Route path="/club/events" element={<ManageEvents />} />
                <Route path="/club/events/create" element={<CreateEvent />} />
                <Route path="/club/events/edit/:id" element={<EditEvent />} />
                <Route path="/club/events/:id" element={<EventDetails />} />
                <Route path="/club/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* SYSTEM ADMIN (Existing) */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/approvals" element={<Approvals />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
            </Route>

            {/* SUPER ADMIN PORTAL */}
            <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/admin/super-dashboard" element={<SuperAdminDashboard />} />
            </Route>

            {/* 404 CATCH-ALL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

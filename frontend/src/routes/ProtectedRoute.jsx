import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        // Unauthenticated access mapping
        const path = window.location.pathname.toLowerCase();
        
        if (path.startsWith('/mentor')) return <Navigate to="/mentor/login" replace />;
        if (path.startsWith('/club')) return <Navigate to="/club-admin/login" replace />;
        if (path.startsWith('/admin')) return <Navigate to="/superadmin/master-access" replace />;
        
        // Default catch-all for unauthorized/unauthenticated access
        return <Navigate to="/student/login" replace />;
    }

    // AUTHENTICATED USER CHECKS
    
    // 1. SuperAdmin is exempt from all role restrictions across the entire platform
    if (user.role === 'superadmin') {
        return <Outlet />;
    }

    // 2. Standard Role Authorization
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirection logic if logged in but role not authorized for this specific portal
        if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
        if (user.role === 'mentor') return <Navigate to="/mentor/dashboard" replace />;
        if (user.role === 'club' || user.role === 'coordinator') return <Navigate to="/club/dashboard" replace />;
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

        // Ultimate fallback for invalid roles
        return <Navigate to="/guest" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

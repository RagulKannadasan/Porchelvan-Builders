import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100">
                <Loader2 className="animate-spin text-brand-blue" size={48} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the right role, send them to their appropriate dashboard
        if (user.role === 'Client') return <Navigate to="/client" replace />;
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white font-sans">
        <Loader2 className="w-10 h-10 text-brand-gold-500 animate-spin mb-4" />
        <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect to admin login page, saving current location for redirect back
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

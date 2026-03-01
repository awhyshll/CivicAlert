import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route element. If unauthenticated, redirects to /login and
 * remembers the attempted URL so we can redirect back after login.
 * If Supabase isn't configured, bypasses the guard so the app works.
 */
export default function ProtectedRoute({ children }) {
  const { session, loading, supabaseReady } = useAuth();
  const location = useLocation();

  // Still resolving the stored session — avoid flash redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 animate-pulse">
          Verifying session…
        </span>
      </div>
    );
  }

  // If Supabase isn't configured yet, allow through so the app works without keys
  if (!supabaseReady) {
    return children;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

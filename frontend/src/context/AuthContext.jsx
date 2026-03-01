import { createContext, useContext, useEffect, useState } from "react";
import { supabase, supabaseReady } from "../lib/supabase";

const AuthContext = createContext(null);

/**
 * Wraps the app and provides the current Supabase session/user to all children.
 * Gracefully handles the case where Supabase isn't configured yet.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If Supabase isn't configured, skip — treat as logged-out immediately
    if (!supabaseReady || !supabase) {
      setSession(null);
      return;
    }

    // 1. Grab the current session on mount (persisted in localStorage by Supabase)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signOut,
        loading: session === undefined,
        supabaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context anywhere in the tree. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

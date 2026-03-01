import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase, supabaseReady } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page the user was trying to visit, or dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Fallback: if Supabase not configured, go straight to dashboard
    if (!supabaseReady || !supabase) {
      navigate(from, { replace: true });
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setError(authError.message || "Invalid email or password.");
      setIsLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="bg-white font-[Space_Grotesk,monospace] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white border border-[#dddddd] flex flex-col relative">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-[#137fec]" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-[#dddddd] bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Detection Engine Online
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400">CA-V1.0</span>
        </div>

        {/* Title section */}
        <div className="p-8 pb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-2xl font-bold tracking-tighter leading-tight uppercase">
              CivicAlert <span className="text-[#137fec]">Login</span>
            </h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Litter Detection Dashboard
            </p>
          </div>
          <div className="w-12 h-12 border border-slate-200 bg-slate-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-900" style={{ fontSize: "24px" }}>
              shield_lock
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="px-8 pb-8 flex flex-col gap-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="flex flex-col gap-2 group">
            <label className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Email Address
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                mail
              </span>
            </label>
            <div className="relative">
              <input
                className="w-full bg-transparent border border-slate-900 h-12 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-[#137fec] focus:bg-slate-50 transition-colors outline-none"
                placeholder="you@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-0 top-0 h-full w-1 bg-transparent group-focus-within:bg-[#137fec] transition-colors" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 group">
            <label className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Password
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                key
              </span>
            </label>
            <div className="relative">
              <input
                className="w-full bg-transparent border border-slate-900 h-12 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-[#137fec] focus:bg-slate-50 transition-colors outline-none"
                placeholder="••••••••••••"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute right-0 top-0 h-full w-1 bg-transparent group-focus-within:bg-[#137fec] transition-colors" />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-[16px]">error</span>
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-4">
            <button
              className="relative w-full h-12 bg-slate-900 text-white hover:bg-[#137fec] transition-all duration-200 flex items-center justify-center gap-2 group/btn disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold tracking-widest uppercase">
                    Verifying…
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold tracking-widest uppercase">
                    Login &amp; Open Dashboard
                  </span>
                  <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">
                    login
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-4 mt-2">
              <Link
                to="/access"
                className="text-xs text-slate-500 hover:text-[#137fec] transition-colors uppercase tracking-wide"
              >
                Request Access
              </Link>
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-[#137fec] transition-colors uppercase tracking-wide"
              >
                Need Help?
              </a>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-[#dddddd] p-4 flex flex-col items-center gap-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Authorized Users Only
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 text-[10px] text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors border-t border-slate-200 pt-3 w-full justify-center"
          >
            <span className="material-symbols-outlined text-[12px]">arrow_back</span>
            Return to Site
          </Link>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-slate-900 -translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-slate-900 translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-slate-900 -translate-x-[1px] translate-y-[1px]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-slate-900 translate-x-[1px] translate-y-[1px]" />
      </div>

      {/* Background grid */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}

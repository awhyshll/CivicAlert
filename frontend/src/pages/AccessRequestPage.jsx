import { useState } from "react";
import { Link } from "react-router-dom";

export default function AccessRequestPage() {
  const [form, setForm] = useState({
    organization: "",
    email: "",
    clearance: "",
    justification: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Access request submitted. Reviews take 24-48 hours.");
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white font-[Public_Sans,sans-serif] text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-black px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="size-6 bg-black flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">security</span>
          </div>
          <Link to="/">
            <h2 className="text-xl font-black tracking-tighter uppercase">CivicAlert</h2>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest hover:underline">Dashboard</Link>
            <Link to="/demo" className="text-xs font-bold uppercase tracking-widest hover:underline">Demo</Link>
            <a className="text-xs font-bold uppercase tracking-widest hover:underline" href="#">Support</a>
          </nav>
          <Link to="/login" className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest">
            Login
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        {/* Left info panel */}
        <section className="w-full md:w-[40%] p-8 md:p-16 border-r border-black bg-slate-50">
          <div className="sticky top-16">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 block font-mono">
              Request ID: CA-REQ-NEW
            </span>
            <h1 className="text-4xl font-black leading-none mb-8 uppercase tracking-tighter">
              CivicAlert<br />Access Request
            </h1>
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase mb-4 border-b border-black pb-1 inline-block">
                  REQUEST GUIDELINES
                </h3>
                <div className="font-mono text-xs leading-relaxed text-slate-600 space-y-4">
                  <p>01. PROVIDE YOUR ORGANIZATION OR MUNICIPALITY NAME AND A VALID OFFICIAL EMAIL ADDRESS FOR VERIFICATION.</p>
                  <p>02. SELECT THE ACCESS TIER THAT MATCHES YOUR INTENDED USAGE — VIEWER, OPERATOR, ADMIN, OR FULL CONTROL.</p>
                  <p>03. ALL REQUESTS ARE REVIEWED MANUALLY. MISUSE OF THE DETECTION DASHBOARD WILL RESULT IN ACCESS REVOCATION.</p>
                  <p>04. THE LITTER DETECTION SYSTEM RUNS 24/7 ACROSS ALL CONNECTED CAMERA FEEDS IN YOUR DEPLOYMENT.</p>
                </div>
              </div>
              <div className="pt-12">
                <img
                  className="w-full h-32 object-cover border border-black grayscale opacity-50"
                  alt="CivicAlert detection system overview"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFop-fl6SooqKpogOpjVSS6NhAj6nBybSlD2EXdZ3ydlG_oukA6uFIllISfmuvAH9PnDG73VHFdzMNd9yPZGDA3E1jdCTKwH0gzi69yQqT6azKbN7kuloNLjq6KEY5sGSlsK909xd1PtuKftqG73QWWUj_QMf1VONP0PgEM2r3D009z1lKtDxNfkF22SQGHGJtCkaF99AIaW-e7F8VSiLeIsgK7NZJusevvO3U1oaodDqtPABACoiR95MExHoZH1LOthjnS4bewis"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right form panel */}
        <section className="w-full md:w-[60%] p-8 md:p-16 flex flex-col justify-center">
          <form className="max-w-xl w-full mx-auto space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="group">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2 block">
                  Organization / Municipality
                </label>
                <input
                  name="organization"
                  className="w-full border border-black bg-white p-4 font-mono text-sm focus:ring-0 focus:border-black placeholder:text-slate-300"
                  placeholder="YOUR ORGANIZATION NAME"
                  type="text"
                  value={form.organization}
                  onChange={handleChange}
                />
              </div>
              <div className="group">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2 block">
                  Official Email
                </label>
                <input
                  name="email"
                  className="w-full border border-black bg-white p-4 font-mono text-sm focus:ring-0 focus:border-black placeholder:text-slate-300"
                  placeholder="YOU@ORGANIZATION.COM"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="group">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2 block">
                  Access Tier
                </label>
                <div className="relative">
                  <select
                    name="clearance"
                    className="w-full border border-black bg-white p-4 font-mono text-sm focus:ring-0 focus:border-black appearance-none"
                    value={form.clearance}
                    onChange={handleChange}
                  >
                    <option value="">SELECT TIER</option>
                    <option value="1">TIER 1 — VIEWER (READ-ONLY)</option>
                    <option value="2">TIER 2 — OPERATOR (ALERTS + LOGS)</option>
                    <option value="3">TIER 3 — ADMIN (CONFIGURATION)</option>
                    <option value="4">TIER 4 — FULL CONTROL</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="group">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2 block">
                  Use Case / Reason
                </label>
                <input
                  name="justification"
                  className="w-full border border-black bg-white p-4 font-mono text-sm focus:ring-0 focus:border-black placeholder:text-slate-300"
                  placeholder="E.G. PARK CLEANLINESS MONITORING"
                  type="text"
                  value={form.justification}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="pt-4">
              <button
                className="w-full bg-black text-white p-5 font-mono font-bold text-sm tracking-[0.3em] hover:bg-slate-800 transition-colors"
                type="submit"
              >
                SUBMIT REQUEST
              </button>
            </div>
            <div className="pt-8 border-t border-slate-100 flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 text-center">
                Submission confirms agreement to CivicAlert usage terms.
              </p>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black text-center">
                REVIEWS TAKE 24-48 HOURS
              </p>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black p-4 flex justify-between items-center bg-white px-8">
        <span className="font-mono text-[9px] uppercase text-slate-500">CivicAlert v1.0.0</span>
        <div className="flex gap-4">
          <span className="font-mono text-[9px] uppercase text-slate-500 underline cursor-pointer">Privacy Policy</span>
          <span className="font-mono text-[9px] uppercase text-slate-500 underline cursor-pointer">Technical Terms</span>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseReady } from "../lib/supabase";

export default function AccessRequestPage() {
  const [form, setForm] = useState({
    organisation_name: "",
    user_email: "",
    purpose: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    // Fallback if Supabase isn't configured yet
    if (!supabaseReady || !supabase) {
      setTimeout(() => setStatus("success"), 800);
      return;
    }

    const { error } = await supabase.from("access_requests").insert([
      {
        organisation_name: form.organisation_name.trim(),
        user_email: form.user_email.trim().toLowerCase(),
        purpose: form.purpose.trim(),
        status: "pending",
      },
    ]);

    if (error) {
      setErrorMsg(error.message || "Submission failed. Please try again.");
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  // ── Success screen ──────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-white font-[Public_Sans,sans-serif] text-slate-900 p-8">
        <div className="max-w-md w-full border border-black p-10 flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 bg-black flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">check</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Request Submitted</h1>
          <p className="font-mono text-xs text-slate-500 leading-relaxed uppercase tracking-wider">
            Your access request has been received. Our team will review it within{" "}
            <span className="text-black font-bold">24–48 hours</span>. You will receive an
            invite email once approved.
          </p>
          <div className="w-full border-t border-dashed border-slate-200 pt-6 flex flex-col gap-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              Organisation: {form.organisation_name}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              Email: {form.user_email}
            </p>
          </div>
          <Link
            to="/"
            className="w-full bg-black text-white py-3 font-mono text-xs font-bold tracking-[0.3em] uppercase text-center hover:bg-slate-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────
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
        <Link
          to="/login"
          className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest"
        >
          Login
        </Link>
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
                  <p>01. PROVIDE YOUR ORGANIZATION OR MUNICIPALITY NAME AND A VALID OFFICIAL EMAIL ADDRESS.</p>
                  <p>02. DESCRIBE YOUR USE CASE — E.G. PARK MONITORING, HIGHWAY CLEANLINESS, ETC.</p>
                  <p>03. ALL REQUESTS ARE REVIEWED MANUALLY WITHIN 24–48 HOURS.</p>
                  <p>04. YOU WILL RECEIVE AN INVITE EMAIL ONCE YOUR REQUEST IS APPROVED.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right form panel */}
        <section className="w-full md:w-[60%] p-8 md:p-16 flex flex-col justify-center">
          <form className="max-w-xl w-full mx-auto space-y-8" onSubmit={handleSubmit}>
            {/* Organisation Name */}
            <div className="group flex flex-col gap-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest">
                Organisation / Municipality Name
              </label>
              <input
                name="organisation_name"
                required
                className="w-full border border-black bg-white p-4 font-mono text-sm focus:outline-none focus:border-black placeholder:text-slate-300"
                placeholder="E.G. MUMBAI MUNICIPAL CORPORATION"
                type="text"
                value={form.organisation_name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="group flex flex-col gap-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest">
                Official Email Address
              </label>
              <input
                name="user_email"
                required
                className="w-full border border-black bg-white p-4 font-mono text-sm focus:outline-none focus:border-black placeholder:text-slate-300"
                placeholder="YOU@ORGANIZATION.GOV.IN"
                type="email"
                value={form.user_email}
                onChange={handleChange}
              />
            </div>

            {/* Purpose */}
            <div className="group flex flex-col gap-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest">
                Purpose / Use Case
              </label>
              <input
                name="purpose"
                required
                className="w-full border border-black bg-white p-4 font-mono text-sm focus:outline-none focus:border-black placeholder:text-slate-300"
                placeholder="E.G. MONITOR CITY PARK LITTER 24/7"
                type="text"
                value={form.purpose}
                onChange={handleChange}
              />
            </div>

            {/* Error */}
            {status === "error" && (
              <div className="border border-red-400 bg-red-50 px-4 py-3">
                <p className="font-mono text-xs text-red-600 uppercase tracking-wide">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                className="w-full bg-black text-white p-5 font-mono font-bold text-sm tracking-[0.3em] hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    SUBMITTING…
                  </>
                ) : (
                  "SUBMIT ACCESS REQUEST"
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 text-center">
                Submission confirms agreement to CivicAlert usage terms.
              </p>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black text-center">
                REVIEWS TAKE 24–48 HOURS
              </p>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black p-4 flex justify-between items-center bg-white px-8">
        <span className="font-mono text-[9px] uppercase text-slate-500">CivicAlert v1.0.0</span>
      </footer>
    </div>
  );
}

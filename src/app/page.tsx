"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CalendarCheck, PiggyBank, LineChart, ArrowRight, Mail, Sparkles } from "lucide-react";

export default function SavinekLanding() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      // TODO: wire this to your backend or a form service.
      // For now we just simulate success after 900ms.
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-white overflow-x-hidden">
      {/* Subtle aurora background */}
      <div className="pointer-events-none fixed inset-0 opacity-40 [mask-image:radial-gradient(1200px_600px_at_50%_-10%,#000_40%,transparent_100%)]">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[1200px] bg-[conic-gradient(at_50%_50%,#22c55e_0deg,#06b6d4_120deg,#6366f1_240deg,#22c55e_360deg)] blur-3xl"/>
      </div>

      {/* Nav */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 grid place-items-center ring-1 ring-emerald-400/30">
            <Sparkles className="h-5 w-5 text-emerald-300" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Savinek</span>
        </div>
        <a href="#waitlist" className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 ring-1 ring-white/15 hover:bg-white/15 transition">
          Join waitlist <ArrowRight className="h-4 w-4 transition -translate-x-0 group-hover:translate-x-0.5"/>
        </a>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-20 md:pt-16 md:pb-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
              >
                Save smarter. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Live freer.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-slate-200/90 md:text-lg max-w-xl"
              >
                Savinek is your AI accountant that protects bills, auto-budgets around your goals, and grows your savings & investments on autopilot.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8"
              >
                <form id="waitlist" onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm p-2 ring-1 ring-white/15">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 text-slate-100/80">
                      <Mail className="h-4 w-4"/>
                    </div>
                    <input
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="flex-1 bg-transparent placeholder:text-slate-300/60 focus:outline-none py-3 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[.99] text-slate-900 font-medium px-4 py-2 transition"
                    >
                      {status === "loading" ? "Joining…" : status === "success" ? "Joined ✓" : "Join"}
                    </button>
                  </div>
                </form>
                {status === "success" && (
                  <p className="mt-3 text-emerald-200/90 text-sm">You're on the list! We'll be in touch soon.</p>
                )}
                {status === "error" && (
                  <p className="mt-3 text-rose-200/90 text-sm">Something went wrong. Please try again.</p>
                )}

                <div className="mt-6 flex items-center gap-4 text-slate-300/80 text-xs">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Bank-grade encryption</div>
                  <div className="flex items-center gap-2"><CalendarCheck className="h-4 w-4"/> Direct debit protection</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:justify-self-end"
            >
              {/* Glass card mock */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 to-teal-300/30 blur-2xl rounded-3xl"/>
                <div className="relative rounded-3xl bg-white/10 backdrop-blur-md p-6 ring-1 ring-white/15">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">This month</h3>
                    <span className="text-emerald-300 text-sm">on track</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <Stat label="Income" value="$4,800"/>
                    <Stat label="Bills" value="$2,145"/>
                    <Stat label="Safe to save" value="$820" positive/>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <FeatureCard icon={<PiggyBank className="h-4 w-4"/>} title="Auto‑savings" desc="Pay yourself first"/>
                    <FeatureCard icon={<LineChart className="h-4 w-4"/>} title="Smart invests" desc="ETF drip-feed"/>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <Callout
              title="Bills, always covered"
              desc="We predict direct debits and keep a safety buffer so you never get caught out."
            />
            <Callout
              title="Budgets that adapt"
              desc="Your plan flexes to income swings and goal changes—without you lifting a finger."
            />
            <Callout
              title="Grow on autopilot"
              desc="Spare cash flows to savings and diversified ETFs, automatically."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500/15 to-teal-400/15 ring-1 ring-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold">Be first to try Savinek</h3>
              <p className="mt-2 text-slate-200/90">Early adopters get founder pricing and priority access.</p>
            </div>
            <a href="#waitlist" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white text-slate-900 font-medium hover:bg-slate-100 transition">
              Join the waitlist <ArrowRight className="h-4 w-4"/>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-300/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Savinek Pty Ltd. All rights reserved.</p>
          <p>Contact: <a className="underline decoration-dotted" href="mailto:founder@savinek.com">founder@savinek.com</a></p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-xs text-slate-300/80">{label}</div>
      <div className={`mt-1 text-base font-semibold ${positive ? "text-emerald-300" : "text-white"}`}>{value}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-emerald-300">{icon}<span className="text-xs uppercase tracking-wide">{title}</span></div>
      <p className="mt-2 text-sm text-slate-200/90">{desc}</p>
    </div>
  );
}

function Callout({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-slate-200/90">{desc}</p>
    </div>
  );
}

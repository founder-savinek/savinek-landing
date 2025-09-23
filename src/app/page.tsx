"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CalendarCheck,
  PiggyBank,
  LineChart,
  ArrowRight,
  Mail,
  Sparkles,
  Wallet,
  CreditCard,
  BarChart2,
  Settings,
  Star,
  User,
} from "lucide-react";

/* ---------- tiny helpers ---------- */
const currency = (n: number) =>
  isFinite(n) ? n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }) : "$0";

/* ---------- toast ---------- */
function Toast({ show, title, desc, onClose }: { show: boolean; title: string; desc?: string; onClose: () => void }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[60] rounded-2xl bg-white text-slate-900 shadow-lg ring-1 ring-slate-900/10 p-4 w-[280px]"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 grid place-items-center rounded-xl bg-emerald-100">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{title}</div>
              {desc ? <div className="text-sm text-slate-600 mt-0.5">{desc}</div> : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SavinekLanding() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [tab, setTab] =
    useState<"overview" | "bills" | "budget" | "invest">("overview");

  // --- interactive budget knobs ---
  const [income, setIncome] = useState<number>(4800);
  const [bills, setBills] = useState<number>(2145);
  const [goalsPct, setGoalsPct] = useState<number>(20); // % of income to goals

  const safeToSave = Math.max(0, income - bills);
  const goalsAmt = Math.min(Math.round((goalsPct / 100) * income), Math.round(safeToSave));
  const discretionary = Math.max(0, income - bills - goalsAmt);

  // Personalised greeting based on time of day
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Load saved name to personalise returning visits
  useEffect(() => {
    const saved = localStorage.getItem("savinekName");
    if (saved) setName(saved);
  }, []);

  // toast auto-reset
  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 3200);
      return () => clearTimeout(t);
    }
  }, [status]);

  // ✅ Real submit to your API (no page reload)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setStatus("success");
      if (name.trim()) localStorage.setItem("savinekName", name.trim());
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  // Subtle prosperity motifs (counts 27 + 108)
  const prosperityDots = useMemo(() => Array.from({ length: 27 }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-white overflow-x-hidden relative">
      {/* toast */}
      <Toast
        show={status === "success"}
        title="You’re on the waitlist! 🎉"
        desc="We’ll email you when the beta opens."
        onClose={() => setStatus("idle")}
      />

      {/* Subtle aurora background */}
      <div className="pointer-events-none fixed inset-0 opacity-40 [mask-image:radial-gradient(1200px_600px_at_50%_-10%,#000_40%,transparent_100%)]">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[1200px] bg-[conic-gradient(at_50%_50%,#22c55e_0deg,#06b6d4_120deg,#6366f1_240deg,#22c55e_360deg)] blur-3xl" />
      </div>

      {/* Discrete prosperity watermark */}
      <div aria-hidden className="pointer-events-none select-none fixed inset-x-0 bottom-10 mx-auto max-w-6xl opacity-[0.06] text-[11px] tracking-[0.3em] text-emerald-100/80 text-center">
        SHRI • LAKSHMI • KUBER • NIDHI • SIDDHI
      </div>

      {/* Decorative stars */}
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-30">
        {prosperityDots.map((_, i) => (
          <Star
            key={i}
            className="absolute h-[6px] w-[6px] text-emerald-200/60"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 61) % 100}%`,
              transform: `scale(${0.8 + ((i * 13) % 20) / 50})`,
            }}
          />
        ))}
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
          Join waitlist <ArrowRight className="h-4 w-4 transition -translate-x-0 group-hover:translate-x-0.5" />
        </a>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-12 md:pt-16 md:pb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 ring-1 ring-emerald-300/30 px-3 py-1 text-emerald-200 text-xs">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" /> Alpha preview
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
              >
                {greeting}{name ? `, ${name}` : ""}. Save smarter.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Live freer.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-slate-200/90 md:text-lg max-w-xl"
              >
                Your AI accountant that protects bills, auto-budgets around your goals, and grows your savings & investments — on autopilot.
              </motion.p>

              {/* Waitlist form */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8"
              >
                <form
                  id="waitlist"
                  method="POST"
                  action="/api/waitlist"
                  onSubmit={onSubmit}
                  className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm p-2 ring-1 ring-white/15"
                >
                  <div className="flex items-center gap-2 px-3 pb-1">
                    <div className="flex items-center gap-2 text-slate-100/80 text-xs">
                      <ShieldCheck className="h-4 w-4" /> Founder pricing for first 108 sign-ups
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 text-slate-100/80">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Your name"
                      className="flex-1 bg-transparent placeholder:text-slate-300/60 focus:outline-none py-3 text-sm"
                      autoComplete="name"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 px-3 text-slate-100/80">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Email to join the waitlist"
                      required
                      className="flex-1 bg-transparent placeholder:text-slate-300/60 focus:outline-none py-3 text-sm"
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-300 text-slate-900 font-semibold px-4 py-2 hover:brightness-110 active:scale-[.99] transition"
                    >
                      {status === "loading" ? "Joining…" : status === "success" ? "Joined ✓" : "Join"}
                    </button>
                  </div>
                </form>

                {status === "error" && (
                  <p className="mt-3 text-rose-200/90 text-sm">Something went wrong. Please try again.</p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4 text-slate-300/80 text-xs">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Read-only bank connections</div>
                  <div className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" /> Direct debit protection</div>
                  <div className="flex items-center gap-2"><Settings className="h-4 w-4" /> Privacy-first design</div>
                </div>
              </motion.div>
            </div>

            {/* Interactive beta preview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:justify-self-end w-full max-w-md mx-auto"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 to-teal-300/30 blur-2xl rounded-3xl" />
                <div className="relative rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/15">
                  <div className="px-4 pt-4 flex items-center justify-between">
                    <div className="flex gap-2 text-xs">
                      <TabButton active={tab === "overview"} onClick={() => setTab("overview")} label="Overview" />
                      <TabButton active={tab === "bills"} onClick={() => setTab("bills")} label="Bills" />
                      <TabButton active={tab === "budget"} onClick={() => setTab("budget")} label="Budget" />
                      <TabButton active={tab === "invest"} onClick={() => setTab("invest")} label="Invest" />
                    </div>
                    <span className="text-emerald-300 text-[11px] px-2 py-1 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-400/30">beta preview</span>
                  </div>

                  <div className="p-5">
                    {tab === "overview" && (
                      <OverviewPane
                        name={name}
                        income={income}
                        bills={bills}
                        goalsPct={goalsPct}
                        goalsAmt={goalsAmt}
                        discretionary={discretionary}
                        safeToSave={safeToSave}
                        setIncome={setIncome}
                        setBills={setBills}
                        setGoalsPct={setGoalsPct}
                      />
                    )}
                    {tab === "bills" && <BillsPane />}
                    {tab === "budget" && (
                      <BudgetPane
                        income={income}
                        bills={bills}
                        goalsAmt={goalsAmt}
                        discretionary={discretionary}
                      />
                    )}
                    {tab === "invest" && <InvestPane />}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value props */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              title="Bills, always covered"
              desc="We predict direct debits and keep a safety buffer so you never get caught out."
            />
            <ValueCard
              title="Budgets that adapt"
              desc="Your plan flexes to income swings and goal changes — without you lifting a finger."
            />
            <ValueCard
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
              Join the waitlist <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-300/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Savinek. All rights reserved.</p>
          <p>Contact: <a className="underline decoration-dotted" href="mailto:founder@savinek.com">founder@savinek.com</a></p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- panes & cards ---------- */

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg transition ring-1 ${
        active ? "bg-emerald-500/20 ring-emerald-400/40" : "bg-white/5 ring-white/10 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

/* Interactive Overview: editable inputs + live math */
function OverviewPane(props: {
  name: string;
  income: number;
  bills: number;
  goalsPct: number;
  goalsAmt: number;
  discretionary: number;
  safeToSave: number;
  setIncome: (v: number) => void;
  setBills: (v: number) => void;
  setGoalsPct: (v: number) => void;
}) {
  const { name, income, bills, goalsPct, goalsAmt, discretionary, safeToSave, setIncome, setBills, setGoalsPct } = props;

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-200/90">
        {name ? `Hi ${name}, here’s a quick budget sandbox` : "Here’s a quick budget sandbox"}
      </div>

      {/* Editable row */}
      <div className="grid grid-cols-2 gap-3">
        <label className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-sm">
          <span className="text-slate-300/80">Income (monthly)</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value.replace(/[^0-9]/g, "")) || 0))}
            className="mt-1 w-full bg-transparent focus:outline-none text-white font-semibold"
          />
        </label>

        <label className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-sm">
          <span className="text-slate-300/80">Bills (monthly)</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={bills}
            onChange={(e) => setBills(Math.max(0, Number(e.target.value.replace(/[^0-9]/g, "")) || 0))}
            className="mt-1 w-full bg-transparent focus:outline-none text-white font-semibold"
          />
        </label>
      </div>

      {/* Goals slider */}
      <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-300/80">Goals allocation</span>
          <span className="text-slate-200 font-semibold">{goalsPct}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={goalsPct}
          onChange={(e) => setGoalsPct(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <div className="mt-1 text-xs text-slate-300/70">
          We’ll cap Goals at what’s left after bills.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <Stat label="Income" value={currency(income)} />
        <Stat label="Bills" value={currency(bills)} />
        <Stat label="Safe to save" value={currency(safeToSave)} positive />
      </div>

      {/* Live allocations */}
      <div className="grid grid-cols-2 gap-3">
        <FeatureCard icon={<PiggyBank className="h-4 w-4" />} title="Goals" desc={currency(goalsAmt)} />
        <FeatureCard icon={<LineChart className="h-4 w-4" />} title="Discretionary" desc={currency(discretionary)} />
      </div>
    </div>
  );
}

function BillsPane() {
  return (
    <div className="space-y-3 text-sm">
      <Row icon={<CreditCard className="h-4 w-4" />} label="Spotify" rightText="Due 12 Sep • $11.99" />
      <Row icon={<CreditCard className="h-4 w-4" />} label="Electricity" rightText="Due 18 Sep • $142.60" />
      <Row icon={<CreditCard className="h-4 w-4" />} label="Phone" rightText="Due 21 Sep • $49.00" />
      <div className="rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-3 text-emerald-200/90">All bills covered — buffer: $420</div>
    </div>
  );
}

function BudgetPane({ income, bills, goalsAmt, discretionary }: { income: number; bills: number; goalsAmt: number; discretionary: number }) {
  return (
    <div className="space-y-4 text-sm">
      <Row icon={<Wallet className="h-4 w-4" />} label="Essentials (bills)" rightText={currency(bills)} />
      <Row icon={<Wallet className="h-4 w-4" />} label="Goals" rightText={currency(goalsAmt)} />
      <Row icon={<Wallet className="h-4 w-4" />} label="Discretionary" rightText={currency(discretionary)} />
      <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
        Suggestion: if you increase Goals by $100, your target hits sooner—watch allocations update live in Overview.
      </div>
    </div>
  );
}

function InvestPane() {
  return (
    <div className="space-y-4 text-sm">
      <Row icon={<BarChart2 className="h-4 w-4" />} label="ETF drip" rightText="$150 / fortnight" />
      <Row icon={<BarChart2 className="h-4 w-4" />} label="Emergency fund" rightText="$3,200 / $6,000" />
      <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">Projection: at current rate, emergency fund complete in 4 months.</div>
    </div>
  );
}

function Row({ icon, label, rightText }: { icon: React.ReactNode; label: string; rightText: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2">
      <div className="flex items-center gap-2 text-slate-200/90">{icon} <span>{label}</span></div>
      <div className="text-slate-300/80">{rightText}</div>
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

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-slate-200/90">{desc}</p>
    </div>
  );
}

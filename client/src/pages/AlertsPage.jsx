import React from "react";
import { useVenue } from "../context/VenueContext";
import { AlertTriangle, ShieldAlert, Lock, Unlock, Radio, BellRing, CheckCircle2 } from "lucide-react";

export default function AlertsPage() {
  const { alerts, activeVenue, toggleGateStatus, isEmergencyMode, toggleEmergencyMode } = useVenue();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">Alerts & Emergency Dispatch</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time warning notifications and manual gate lockdown triggers</p>
        </div>

        <button
          onClick={toggleEmergencyMode}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border transition-all ${
            isEmergencyMode
              ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 animate-bounce"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isEmergencyMode ? "🚨 DEACTIVATE EVACUATION MODE" : "ACTIVATE EVACUATION MODE"}</span>
        </button>
      </div>

      {/* Live Warning Notification Banner (Requested in Prompt) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-3">
          <BellRing className="w-5 h-5 text-amber-400 shrink-0" />
          <span>⚠ Gate 3 Congested. AI Recommendation: Redirect visitors to Exit 5 immediately.</span>
        </div>
        <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-black uppercase">LIVE ALERT</span>
      </div>

      {/* Alert Cards Grid (Requested in Prompt: High Congestion, Stall Overflow, Emergency Alert, Gate Closed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400">High Congestion</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-sm font-bold text-white">Gate 2 (East Main VIP)</p>
          <p className="text-xs text-slate-400 mt-1">Density at 89%. 890 visitors in queue.</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400">Food Stall Overflow</span>
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white">Food Court North</p>
          <p className="text-xs text-slate-400 mt-1">Wait time exceeding 22 mins.</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-400">Emergency Alert</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white">Evacuation Routes Clear</p>
          <p className="text-xs text-slate-400 mt-1">All 4 emergency exit doors unlocked.</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400">Gate Controls</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-sm font-bold text-white">Manual Override Ready</p>
          <p className="text-xs text-slate-400 mt-1">Admin gate toggles active below.</p>
        </div>
      </div>

      {/* Gate Controls & Lockdown Switcher */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">Manual Gate Control & Lockdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeVenue.nodes.filter(n => n.type === 'gate' || n.type === 'exit').map(gate => (
            <div key={gate.id} className="p-4 rounded-2xl bg-dark-800 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{gate.label}</span>
                <span className={`text-[10px] font-bold uppercase ${gate.isClosed ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {gate.isClosed ? 'CLOSED / LOCKED' : 'OPEN & CLEAR'}
                </span>
              </div>

              <button
                onClick={() => toggleGateStatus(gate.id)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  gate.isClosed
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {gate.isClosed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

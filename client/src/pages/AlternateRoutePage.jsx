import React from "react";
import { useVenue } from "../context/VenueContext";
import { Navigation, ArrowRight, Clock, ShieldCheck, Zap } from "lucide-react";

export default function AlternateRoutePage() {
  const { activeVenue, aiAnalysis } = useVenue();

  const routes = aiAnalysis?.suggestedRoutes?.length > 0 ? aiAnalysis.suggestedRoutes : [
    {
      id: "r1",
      from: "Gate 2 (East Main VIP)",
      via: "Corridor West & Food Court South",
      to: "Emergency Exit 4",
      timeSavedMinutes: 14,
      reason: "Gate 2 capacity at 89%. Congestion bottleneck predicted."
    },
    {
      id: "r2",
      from: "Food Court North",
      via: "Central Concourse",
      to: "Food Court South",
      timeSavedMinutes: 8,
      reason: "Food Court North queue line exceeding 600 people."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black font-heading text-white tracking-tight">AI Alternate Routing Engine</h1>
        <p className="text-xs text-slate-400 mt-1">Automated safe pedestrian rerouting algorithms to bypass clogged gates and bottlenecks</p>
      </div>

      {/* Rerouting Cards with Animated Arrows (Requested in Prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route, idx) => (
          <div key={route.id} className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-cyan-950/10 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                AI Route Proposal #{idx + 1}
              </span>
              <span className="text-xs font-black text-emerald-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Saves ~{route.timeSavedMinutes} mins</span>
              </span>
            </div>

            {/* Visual Animated Flow Arrow Path: Gate -> Corridor -> Exit */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-around space-x-2">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Origin</span>
                <span className="text-xs font-bold text-rose-400">{route.from}</span>
              </div>

              <div className="flex items-center text-cyan-400 animate-pulse">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Via Corridor</span>
                <span className="text-xs font-bold text-amber-400">{route.via}</span>
              </div>

              <div className="flex items-center text-cyan-400 animate-pulse">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Safe Destination</span>
                <span className="text-xs font-bold text-emerald-400">{route.to}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-cyan-400">Trigger Rationale:</strong> {route.reason}
            </p>

            <button className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4 fill-black" />
              <span>Broadcast Reroute Command to Digital Signage</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

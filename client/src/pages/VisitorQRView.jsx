import React from "react";
import { useVenue } from "../context/VenueContext";
import { QrCode, Navigation, ShieldCheck, MapPin, Clock, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function VisitorQRView() {
  const { activeVenue, isEmergencyMode } = useVenue();

  // Find safest exit and lowest density stall for visitor
  const exits = activeVenue.nodes.filter(n => n.type === 'exit');
  const safestExit = exits.sort((a, b) => a.crowd - b.crowd)[0] || { label: "Emergency Exit 4", crowd: 30 };

  const stalls = activeVenue.nodes.filter(n => n.type === 'stall');
  const fastestStall = stalls.sort((a, b) => a.crowd - b.crowd)[0] || { label: "Food Court South", crowd: 120 };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-4 max-w-md mx-auto space-y-6">
      {/* Public Visitor Header */}
      <div className="text-center pt-4 pb-2 border-b border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold mb-2">
          <QrCode className="w-3.5 h-3.5" />
          <span>VISITOR SMART NAVIGATION</span>
        </div>
        <h1 className="text-xl font-extrabold font-heading text-white">{activeVenue.name}</h1>
        <p className="text-xs text-slate-400">Live Safety & Queue Assist • Scanned via Venue QR Code</p>
      </div>

      {/* Emergency Alert Mode Banner if active */}
      {isEmergencyMode && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white font-extrabold text-xs space-y-1 animate-pulse">
          <p className="uppercase tracking-wider">🚨 EVACUATION NOTICE</p>
          <p className="text-[11px] font-normal">Please proceed calmly to your nearest safe exit: <strong>{safestExit.label}</strong>.</p>
        </div>
      )}

      {/* Quick Visitor Action Cards */}
      <div className="space-y-4">
        {/* Nearest Safe Exit Card */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nearest Safe Exit</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">{safestExit.label}</h3>
            <p className="text-xs text-slate-300 mt-1 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Est. Exit Queue Time: <strong>&lt; 2 Minutes</strong></span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Crowd Density: Low (🟢)</span>
            <span className="text-emerald-400 font-bold">{safestExit.crowd} visitors</span>
          </div>
        </div>

        {/* Shortest Food Stall Queue Card */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Fastest Food & Drinks Kiosk</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">{fastestStall.label}</h3>
            <p className="text-xs text-slate-300 mt-1">Shortest wait line in venue (Est ~4 mins)</p>
          </div>
        </div>
      </div>

      {/* Back to Admin / Manager Portal Link */}
      <div className="pt-6 border-t border-slate-800 text-center">
        <Link to="/dashboard" className="text-xs text-cyan-400 hover:underline font-semibold">
          ← Return to Event Manager Dashboard
        </Link>
      </div>
    </div>
  );
}

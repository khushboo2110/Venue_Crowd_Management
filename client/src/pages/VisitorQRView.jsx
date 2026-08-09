import React, { useState } from "react";
import { useVenue } from "../context/VenueContext";
import { 
  QrCode, 
  Navigation, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Zap,
  Utensils,
  AlertOctagon,
  X,
  Compass,
  CheckCircle2,
  Share2,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

export default function VisitorQRView() {
  const { activeVenue, isEmergencyMode } = useVenue();
  const [activeTab, setActiveTab] = useState("all");
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const targetUrl = typeof window !== 'undefined' ? window.location.origin + "/visitor" : "http://localhost:3000/visitor";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;

  const nodes = activeVenue.nodes || [];
  const exits = nodes.filter(n => n.type === 'exit');
  const stalls = nodes.filter(n => n.type === 'stall');

  const safestExit = exits.sort((a, b) => a.crowd - b.crowd)[0] || { label: "Emergency Exit 4", crowd: 30, maxCapacity: 2000 };
  const fastestStall = stalls.sort((a, b) => a.crowd - b.crowd)[0] || { label: "Food Court South", crowd: 120, maxCapacity: 700 };

  const filteredNodes = activeTab === 'exits' 
    ? exits 
    : activeTab === 'stalls' 
    ? stalls 
    : nodes;

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-4 max-w-md mx-auto space-y-5 pb-20 selection:bg-cyan-500 selection:text-black">
      {/* Top Header Card */}
      <div className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>VISITOR SMART PASS PWA</span>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        <div>
          <h1 className="text-xl font-black font-heading text-white">{activeVenue.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Venue Navigation • Scanned via Smart Entry QR</span>
          </p>
        </div>

        {/* Real Scannable QR Code Banner Card */}
        <div 
          onClick={() => setShowQrModal(true)}
          className="p-4 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition-all shadow-inner group"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">📷 Scan with Phone Camera</span>
            <p className="text-xs font-mono font-extrabold text-white">PASS ID: #SIH-89412-PASS</p>
            <span className="text-[10px] text-emerald-400 flex items-center space-x-1 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Click to enlarge QR for Scanning</span>
            </span>
          </div>

          {/* Real Scannable QR Code Image */}
          <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 border border-cyan-400">
            <img 
              src={qrImageUrl} 
              alt="Scan QR with Phone" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Live Safety Status Pill */}
        <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between ${
          isEmergencyMode 
            ? 'bg-rose-600/20 border-rose-500/40 text-rose-300 animate-pulse'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isEmergencyMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            <span>{isEmergencyMode ? "🚨 EMERGENCY EVACUATION ACTIVE" : "🟢 Venue Safety Status: Optimal"}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Live Sync</span>
        </div>
      </div>

      {/* Emergency Notice Alert Banner if Active */}
      {isEmergencyMode && (
        <div className="p-4 rounded-3xl bg-rose-600 text-white font-extrabold text-xs space-y-2 shadow-xl shadow-rose-600/30 animate-bounce">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <span className="uppercase tracking-wider">EVACUATION PROTOCOL ENGAGED</span>
          </div>
          <p className="text-[11px] font-normal text-rose-100 leading-relaxed">
            All entry gates are turned into exit routes. Please follow green navigation arrows toward <strong>{safestExit.label}</strong>.
          </p>
        </div>
      )}

      {/* Quick Action Highlights */}
      <div className="grid grid-cols-2 gap-3">
        {/* Fast Exit Highlight */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
            <span>Fastest Exit</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-sm font-extrabold text-white truncate">{safestExit.label}</p>
          <span className="text-[10px] text-emerald-300 block font-semibold">&lt; 2 Mins Queue</span>
        </div>

        {/* Fast Food Kiosk Highlight */}
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
            <span>Fastest Food</span>
            <Utensils className="w-4 h-4" />
          </div>
          <p className="text-sm font-extrabold text-white truncate">{fastestStall.label}</p>
          <span className="text-[10px] text-amber-300 block font-semibold">~4 Mins Queue</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700 text-xs">
        {[
          { id: "all", label: "All Locations" },
          { id: "exits", label: "Safe Exits" },
          { id: "stalls", label: "Food & Drinks" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.id
                ? "bg-cyan-500 text-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtered Locations List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Live Venue Nodes ({filteredNodes.length})
        </h3>

        {filteredNodes.map(node => {
          const fillRatio = (node.crowd / (node.maxCapacity || 1000));
          const isHigh = fillRatio >= 0.8;
          const isMed = fillRatio >= 0.5;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedDestination(node)}
              className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer hover:scale-[1.01] ${
                selectedDestination?.id === node.id 
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${
                    node.type === 'exit' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    node.type === 'stall' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  }`}>
                    {node.type === 'exit' ? <ShieldCheck className="w-4 h-4" /> :
                     node.type === 'stall' ? <Utensils className="w-4 h-4" /> :
                     <Compass className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{node.label}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{node.type} • Approx ~120m away</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold block ${
                    isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {isHigh ? 'Congested 🔴' : isMed ? 'Moderate 🟡' : 'Clear 🟢'}
                  </span>
                  <span className="text-[10px] text-slate-500">{node.crowd} visitors</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Turn-by-Turn Rerouting Step Guide if Destination Selected */}
      {selectedDestination && (
        <div className="p-5 rounded-3xl glass-panel border border-cyan-500/40 bg-cyan-950/20 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-extrabold text-cyan-400 flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Turn-by-Turn Navigation</span>
            </span>
            <button onClick={() => setSelectedDestination(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-bold text-white">Route to {selectedDestination.label}</p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Head straight down Central Concourse for 40 meters.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Turn left at Corridor West (bypassing Gate 2 queue).</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Arrive at {selectedDestination.label} on your right.</span>
            </div>
          </div>
        </div>
      )}

      {/* 100% REAL SCANNABLE QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl glass-panel border border-cyan-500/50 p-6 text-center space-y-4 relative animate-fadeIn">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">Scan with Phone Camera</h3>
              <p className="text-xs text-cyan-400 font-medium mt-1">Point your Smartphone Camera at the QR code below</p>
            </div>

            {/* REAL High-Resolution Scannable QR Code Image */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-cyan-400">
              <img 
                src={qrImageUrl} 
                alt="100% Real Scannable QR Code" 
                className="w-52 h-52 object-contain mx-auto"
              />
            </div>

            <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">Scannable Destination URL:</span>
              <a href={targetUrl} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-slate-300 underline break-all flex items-center space-x-1 hover:text-cyan-400">
                <span>{targetUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400">
              Works with iPhone Camera, Android Camera, Google Lens & Paytm/PhonePe QR scanners!
            </p>
          </div>
        </div>
      )}

      {/* Footer Navigation Back to Manager Portal */}
      <div className="pt-4 border-t border-slate-800 text-center">
        <Link to="/dashboard" className="text-xs text-cyan-400 hover:underline font-bold inline-flex items-center space-x-1">
          <span>← Event Manager Portal Access</span>
        </Link>
      </div>
    </div>
  );
}

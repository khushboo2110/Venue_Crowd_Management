import React, { useState } from "react";
import { useVenue } from "../context/VenueContext";
import { Map, Info, Navigation, Users, ShieldAlert, X, ArrowRight } from "lucide-react";

export default function LiveMapPage() {
  const { activeVenue } = useVenue();
  const [selectedNode, setSelectedNode] = useState(null);

  const getStatusColor = (crowd, maxCapacity) => {
    const ratio = crowd / (maxCapacity || 1000);
    if (ratio >= 0.8) return { bg: "bg-rose-500", text: "text-rose-400", border: "border-rose-500", label: "High (🔴)" };
    if (ratio >= 0.5) return { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500", label: "Medium (🟡)" };
    return { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500", label: "Low (🟢)" };
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">Live Crowd Heatmap</h1>
          <p className="text-xs text-slate-400 mt-1">Interactive venue map with real-time green, yellow, and red density overlays</p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-semibold bg-dark-800 px-4 py-2 rounded-xl border border-slate-700">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>🟢 Low (&lt;50%)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>🟡 Medium (50-80%)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-rose-400">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>🔴 High (&gt;80%)</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 lg:col-span-2 relative min-h-[460px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

          {/* Node Elements on Canvas */}
          <div className="relative w-full h-[440px]">
            {activeVenue.nodes.map(node => {
              const status = getStatusColor(node.crowd, node.maxCapacity);
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${(node.x / 800) * 85}%`, top: `${(node.y / 600) * 80}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all transform hover:scale-110"
                >
                  <div className={`relative p-3 rounded-2xl bg-dark-900 border-2 ${status.border} shadow-xl flex items-center space-x-2`}>
                    <span className={`w-3 h-3 rounded-full ${status.bg} animate-pulse`}></span>
                    <span className="text-xs font-bold text-white">{node.label}</span>
                  </div>
                  <span className={`block text-[10px] font-mono font-bold mt-1 text-center ${status.text}`}>
                    {node.crowd} ppl
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Inspection Modal Card (Requested in Prompt) */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-heading">{selectedNode.label}</h3>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-dark-800 border border-slate-700">
                <span className="text-xs text-slate-400 uppercase font-semibold">Current Headcount</span>
                <p className="text-2xl font-black text-white font-heading mt-1">
                  {selectedNode.crowd} <span className="text-xs font-normal text-slate-400">/ {selectedNode.maxCapacity || 1000}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-800 border border-slate-700">
                <span className="text-xs text-slate-400 uppercase font-semibold">Density Status</span>
                <p className={`text-sm font-bold mt-1 ${getStatusColor(selectedNode.crowd, selectedNode.maxCapacity).text}`}>
                  {getStatusColor(selectedNode.crowd, selectedNode.maxCapacity).label}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>AI Suggested Reroute</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.crowd > 600
                    ? `Divert 40% of incoming visitors from ${selectedNode.label} toward Corridor West to reduce wait times.`
                    : `Current flow is optimal. Maintain standard access control.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <Info className="w-10 h-10 opacity-30" />
              <p className="text-xs font-semibold">Click on any gate, food stall, or exit marker on the map to inspect live metrics and AI routing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

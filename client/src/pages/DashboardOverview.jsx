import React from "react";
import { useVenue } from "../context/VenueContext";
import StatCard from "../components/StatCard";
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  ArrowUpRight,
  Navigation,
  Radio
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardOverview() {
  const { activeVenue, aiAnalysis, alerts, isLiveStreaming, setIsLiveStreaming } = useVenue();

  const totalCrowd = aiAnalysis?.totalCrowd || 6850;
  const activeAlertsCount = alerts.length;
  const avgWaitTime = aiAnalysis?.avgWaitTimeMins || 14;
  const riskLevel = aiAnalysis?.riskLevel || "High";
  const riskScore = aiAnalysis?.riskScore || 78;
  const totalVisitorsToday = totalCrowd + 14200;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-dark-800 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Active Venue: {activeVenue.name} ({activeVenue.category})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Venue Control & Crowd Intelligence
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all ${
              isLiveStreaming
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
          >
            <Radio className={`w-4 h-4 ${isLiveStreaming ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isLiveStreaming ? "Simulating Live Sensor Stream" : "Start IoT Sensor Stream"}</span>
          </button>

          <Link
            to="/simulation"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run AI Simulation</span>
          </Link>
        </div>
      </div>

      {/* 5 Main Stat Cards (Requested in Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Current Crowd"
          value={totalCrowd.toLocaleString()}
          icon={Users}
          subtext={`Cap: ${activeVenue.capacity.toLocaleString()}`}
          trend="+12% inflow"
          color="cyan"
        />

        <StatCard
          title="Active Alerts"
          value={activeAlertsCount}
          icon={AlertTriangle}
          subtext="2 critical gates"
          color="rose"
        />

        <StatCard
          title="Avg Waiting Time"
          value={`${avgWaitTime} mins`}
          icon={Clock}
          subtext="At main entry gates"
          trend="-3 mins with AI"
          color="amber"
        />

        <StatCard
          title="Risk Level"
          value={`${riskScore}% (${riskLevel})`}
          icon={ShieldCheck}
          subtext={riskLevel === 'High' ? 'Bottlenecks active' : 'Flow normal'}
          color={riskLevel === 'High' ? 'rose' : riskLevel === 'Medium' ? 'amber' : 'emerald'}
        />

        <StatCard
          title="Total Visitors"
          value={totalVisitorsToday.toLocaleString()}
          icon={Activity}
          subtext="Today's total throughput"
          color="purple"
        />
      </div>

      {/* AI Recommendation Banner */}
      {aiAnalysis?.recommendation && (
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-cyan-950/20 relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-heading">
                Hugging Face AI Safety Recommendation
              </h3>
              <p className="text-xs text-cyan-400 font-medium">Model: Qwen/Qwen3-4B-Instruct</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-dark-900/60 p-4 rounded-2xl border border-slate-800">
            {aiAnalysis.recommendation}
          </p>
        </div>
      )}

      {/* Breakdown per Zone / Gate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-heading">Gate & Stall Density Breakdown</h3>
            <Link to="/crowd-data" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1">
              <span>Manage Crowd Data</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeVenue.nodes.map(node => {
              const fillPct = Math.round((node.crowd / (node.maxCapacity || 1000)) * 100);
              const colorClass = fillPct >= 80 ? 'bg-rose-500' : fillPct >= 50 ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div key={node.id} className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{node.label}</span>
                    <span className="block text-[11px] text-slate-400 uppercase tracking-wider">{node.type}</span>
                  </div>
                  
                  <div className="w-48 text-right">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">{node.crowd} / {node.maxCapacity}</span>
                      <span className={`font-bold ${fillPct >= 80 ? 'text-rose-400' : 'text-emerald-400'}`}>{fillPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${Math.min(100, fillPct)}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Route Suggestions Overview */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading">AI Safe Route Suggestions</h3>
              <Link to="/routes" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1">
                <span>View Route Map</span>
                <Navigation className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                  <span>RECOMMENDED REROUTE #1</span>
                  <span>Saves ~12 Mins</span>
                </div>
                <p className="text-sm font-bold text-white">Gate 2 Congested → Corridor West → Exit 4</p>
                <p className="text-xs text-slate-400 mt-1">Diverts 350 visitors/hr away from overcrowded main entry gate.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                  <span>RECOMMENDED REROUTE #2</span>
                  <span>Saves ~7 Mins</span>
                </div>
                <p className="text-sm font-bold text-white">Food Court North → Food Court South</p>
                <p className="text-xs text-slate-400 mt-1">Balancing vendor line lengths across venue sectors.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">SIH Real-Time Recommendation Sync</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Active Sync</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

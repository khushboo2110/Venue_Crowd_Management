import React, { useRef, useEffect, useState } from "react";
import { useVenue } from "../context/VenueContext";
import { CrowdSimulatorEngine } from "../services/simulationEngine";
import { runAICrowdAnalysis } from "../services/aiEngine";
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Activity, 
  Layers,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function AISimulationPage() {
  const { activeVenue, isEmergencyMode, toggleEmergencyMode, hfToken } = useVenue();
  const canvasRef = useRef(null);
  const simulatorRef = useRef(null);

  const [isRunning, setIsRunning] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Initialize and run Canvas Simulation Engine
  useEffect(() => {
    if (canvasRef.current) {
      simulatorRef.current = new CrowdSimulatorEngine(
        canvasRef.current,
        activeVenue.nodes,
        activeVenue.edges
      );
      simulatorRef.current.start();
    }

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stop();
      }
    };
  }, [activeVenue]);

  // Sync Emergency Mode with simulator engine
  useEffect(() => {
    if (simulatorRef.current) {
      simulatorRef.current.setEmergencyMode(isEmergencyMode);
    }
  }, [isEmergencyMode]);

  const handleRunSimulation = async () => {
    setIsAnalyzing(true);
    if (simulatorRef.current) {
      simulatorRef.current.setEmergencyMode(isEmergencyMode);
    }

    // Trigger AI prediction
    const res = await runAICrowdAnalysis({ venue: activeVenue, hfToken });
    setSimulationResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CORE SIMULATOR & PREDICTIVE ENGINE</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">
            2D Crowd Flow Simulation Engine ⭐
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleEmergencyMode}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all ${
              isEmergencyMode
                ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 animate-bounce"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyMode ? "🚨 EVACUATION MODE ACTIVE" : "TEST EVACUATION MODE"}</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-black font-black text-xs shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>{isAnalyzing ? "AI ANALYZING..." : "RUN AI SIMULATION"}</span>
          </button>
        </div>
      </div>

      {/* 2D Canvas Simulator Window */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 lg:col-span-2 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xs text-slate-300 font-bold">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Live 60FPS Agent Simulation • {activeVenue.name}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Green Paths (Clear)</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>Red Zones (Congested)</span>
              </span>
            </div>
          </div>

          {/* Interactive Particle Physics Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-dark-950 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={420}
              className="w-full h-[420px] relative z-10"
            />
          </div>
        </div>

        {/* AI Output Cards (Requested in Prompt) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center justify-between">
              <span>AI Prediction Output</span>
              {simulationResult && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                  UPDATED JUST NOW
                </span>
              )}
            </h3>

            {/* Risk Score */}
            <div className="p-4 rounded-2xl bg-dark-800 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                <span>Risk Score</span>
                <span className={`font-bold ${simulationResult?.riskLevel === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {simulationResult?.riskLevel || 'High'} Risk
                </span>
              </div>
              <p className="text-3xl font-black text-white font-heading">
                {simulationResult?.riskScore || 78}%
              </p>
              <div className="w-full h-2 rounded-full bg-slate-700 mt-2 overflow-hidden">
                <div 
                  className={`h-full ${simulationResult?.riskScore > 70 ? 'bg-rose-500' : 'bg-emerald-500'} transition-all duration-500`}
                  style={{ width: `${simulationResult?.riskScore || 78}%` }}
                ></div>
              </div>
            </div>

            {/* Congestion Areas */}
            <div className="p-4 rounded-2xl bg-dark-800 border border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Congestion Areas</span>
              <p className="text-sm font-bold text-rose-400">
                {simulationResult?.bottleneckNodes?.map(b => b.label).join(', ') || 'Gate 2 (East Main VIP), Food Court North'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Density exceeds 80% flow limit.</p>
            </div>

            {/* Estimated Waiting Time */}
            <div className="p-4 rounded-2xl bg-dark-800 border border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Estimated Waiting Time</span>
              <p className="text-2xl font-black text-amber-400 font-heading">
                {simulationResult?.avgWaitTimeMins || 14} Mins
              </p>
              <p className="text-xs text-slate-400 mt-1">Average entry gate delay.</p>
            </div>

            {/* Safe Capacity */}
            <div className="p-4 rounded-2xl bg-dark-800 border border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Safe Remaining Capacity</span>
              <p className="text-2xl font-black text-emerald-400 font-heading">
                {simulationResult?.safeCapacityPct || 32}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Detailed Natural Language Rerouting Instructions Card */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-cyan-950/20">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-extrabold text-white font-heading">
            AI Intelligent Rerouting Command Strategy
          </h3>
        </div>
        <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line">
          {simulationResult?.recommendation || `🚨 BOTTLENECK DETECTED AT GATE 2 & FOOD COURT NORTH.
1. Divert 35% of incoming crowd from Gate 2 toward West Gate 4 via Corridor B.
2. Open Emergency Exits 1 & 2 for expedited egress during halftime.
3. Broadcast voice announcements directing visitors to low-density Food Court South.`}
        </div>
      </div>
    </div>
  );
}

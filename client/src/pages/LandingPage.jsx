import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVenue } from "../context/VenueContext";
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Navigation, 
  Cpu, 
  ArrowRight, 
  Play,
  Layers,
  Activity,
  X,
  Info
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { venues } = useVenue();

  // Interactive Live Demo preview venue selection
  const [selectedDemoVenueIndex, setSelectedDemoVenueIndex] = useState(0);
  const currentDemoVenue = venues[selectedDemoVenueIndex] || venues[0];

  // Interactive node inspection state for landing demo preview
  const [inspectedNode, setInspectedNode] = useState(currentDemoVenue.nodes[1]);

  // Feature detail modal popup state
  const [activeModalFeature, setActiveModalFeature] = useState(null);

  useEffect(() => {
    setInspectedNode(currentDemoVenue.nodes[1] || currentDemoVenue.nodes[0] || null);
  }, [currentDemoVenue]);

  const demoCrowdTotal = currentDemoVenue.nodes.reduce((sum, node) => sum + Number(node.crowd || 0), 0);
  const demoVenueOccupancy = Math.min(100, Math.round((demoCrowdTotal / currentDemoVenue.capacity) * 100));
  const demoPeakFill = Math.max(...currentDemoVenue.nodes.map(node => Math.round((node.crowd / (node.maxCapacity || 1000)) * 100)));
  const demoRiskScore = Math.min(100, Math.round((demoVenueOccupancy * 0.6) + (demoPeakFill * 0.4)));
  const demoDistribution = [...currentDemoVenue.nodes]
    .sort((a, b) => (b.crowd / (b.maxCapacity || 1000)) - (a.crowd / (a.maxCapacity || 1000)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Main Landing Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-dark-900/90 backdrop-blur-md z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-cyan-500/20">
            ⚡
          </div>
          <div>
            <span className="text-xl font-black font-heading tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              CROWDFLOW AI
            </span>
            <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              Smart India Hackathon Edition
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#demo-preview" className="hover:text-cyan-400 transition-colors">Live Preview</a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">How It Works</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all hidden sm:inline-block"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>Launch Live App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 max-w-7xl mx-auto">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-POWERED VENUE CROWD MANAGEMENT & STAMPEDE PREVENTION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading tracking-tight leading-tight text-white">
            Transform Venue Safety with <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Real-Time AI Intelligence</span>
          </h1>

          <p className="mt-6 text-slate-400 text-base sm:text-lg leading-relaxed">
            Eliminate crowd bottlenecks at gates, food stalls, and exits. Prevent stampedes using live heatmaps, dynamic AI rerouting algorithms, and Hugging Face predictive analytics.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/simulation"
              className="px-7 py-3.5 rounded-2xl glass-panel text-cyan-400 border border-cyan-500/40 font-bold text-sm hover:bg-cyan-500/10 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-cyan-400" />
              <span>Watch 60FPS AI Particle Simulation</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Hero Live Interactive Demo Card Preview */}
        <div id="demo-preview" className="mt-14 rounded-3xl glass-panel border border-cyan-500/30 p-6 max-w-5xl mx-auto shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono text-slate-300 font-bold ml-2">Interactive Blueprint Inspector</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Select a venue preset to preview real-time crowd distribution</p>
            </div>

            <div className="flex items-center space-x-2">
              {venues.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedDemoVenueIndex(idx);
                    setInspectedNode(v.nodes[1] || v.nodes[0]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedDemoVenueIndex === idx
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl bg-dark-900/90 border border-slate-700 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
                <span>Live Risk Meter</span>
                <span className={`font-bold ${demoRiskScore >= 80 ? "text-rose-400" : demoRiskScore >= 55 ? "text-amber-400" : "text-emerald-400"}`}>{demoRiskScore}%</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div
                  className="relative h-28 w-28 rounded-full shrink-0"
                  style={{ background: `conic-gradient(#22d3ee 0deg ${demoRiskScore * 3.6}deg, rgba(51,65,85,0.6) ${demoRiskScore * 3.6}deg 360deg)` }}
                >
                  <div className="absolute inset-3 rounded-full bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-white font-heading">{demoRiskScore}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Risk</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Occupancy</span>
                    <span className="font-bold text-cyan-400 font-mono">{demoVenueOccupancy}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-500 transition-all duration-700" style={{ width: `${demoVenueOccupancy}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates busiest gates & food stalls to calculate live venue risk score.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-dark-900/90 border border-slate-700 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold uppercase tracking-wider mb-3">
                <span>Crowd Distribution Preview</span>
                <span className="font-mono text-slate-300">{demoCrowdTotal.toLocaleString()} visitors</span>
              </div>
              <div className="space-y-3">
                {demoDistribution.map(node => {
                  const fillRatio = Math.round((node.crowd / (node.maxCapacity || 1000)) * 100);
                  const colorClass = fillRatio >= 80 ? "bg-rose-500" : fillRatio >= 50 ? "bg-amber-500" : "bg-emerald-500";
                  return (
                    <div key={node.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                        <span className="font-semibold truncate pr-2 font-sans">{node.label}</span>
                        <span>{fillRatio}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${colorClass} transition-all duration-700`} style={{ width: `${Math.min(100, fillRatio)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Gate Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 font-mono">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Active Nodes - {currentDemoVenue.name}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDemoVenue.nodes.slice(0, 6).map(node => {
                  const fillRatio = Math.round((node.crowd / (node.maxCapacity || 1000)) * 100);
                  const isInspected = inspectedNode?.id === node.id;
                  const isDanger = fillRatio >= 80;
                  const isWarning = fillRatio >= 50 && fillRatio < 80;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setInspectedNode(node)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                        isInspected
                          ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-[1.02]"
                          : "bg-dark-800/90 border-slate-700/80 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">{node.label}</span>
                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                          isDanger ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" :
                          isWarning ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        }`}>
                          {fillRatio}% Fill
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, fillRatio)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inspected Node Detail Box */}
            {inspectedNode && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider block">Inspected Node</span>
                    <h5 className="text-sm font-bold text-white font-heading">{inspectedNode.label}</h5>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Node Type:</span>
                    <span className="font-bold text-white uppercase">{inspectedNode.type}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Current Crowd:</span>
                    <span className="font-bold text-cyan-400">{inspectedNode.crowd} Visitors</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Max Safe Limit:</span>
                    <span className="font-bold text-slate-300">{inspectedNode.maxCapacity} Visitors</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Bottleneck Risk:</span>
                    <span className={`font-bold ${
                      (inspectedNode.crowd / inspectedNode.maxCapacity) >= 0.8 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {(inspectedNode.crowd / inspectedNode.maxCapacity) >= 0.8 ? "HIGH CONGESTION" : "FLOW NORMAL"}
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="block w-full text-center py-2.5 rounded-xl bg-cyan-500 text-black font-extrabold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
                >
                  Control Gate in Dashboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold font-heading text-white">
            Built for High-Stakes Venue Safety
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Designed for stadium event managers, security teams, and disaster management authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: "ai-pred",
              icon: Cpu,
              color: "cyan",
              title: "AI Prediction Engine",
              desc: "Hugging Face LLM & rule engine predict density spikes 10–15 minutes before bottlenecks occur.",
              detailText: "Uses Hugging Face Qwen/Qwen3-4B-Instruct model combined with offline rule-based heuristic fallback algorithms. Analyzes inflow vectors, node capacity ratios, and physical exit width parameters."
            },
            {
              id: "heatmaps",
              icon: TrendingUp,
              color: "emerald",
              title: "Live Heatmaps",
              desc: "Real-time green, yellow, and red color density visualization overlaid on floor plans.",
              detailText: "Dynamic radial color blending (Green <= 50%, Yellow 50-75%, Red >= 75%). Supports SVG/PNG map marker placement with drag-and-drop floorplan uploads."
            },
            {
              id: "routes",
              icon: Navigation,
              color: "amber",
              title: "Route Suggestions",
              desc: "Automated safe pedestrian rerouting around clogged gates and congested food courts.",
              detailText: "Calculates safe alternate paths using Dijkstra shortest-path logic with dynamic edge congestion weights. Generates step-by-step visitor navigation guidance."
            },
            {
              id: "iot",
              icon: ShieldAlert,
              color: "rose",
              title: "Live Monitoring & Alerts",
              desc: "IoT Sensor API streams real-time gate counts directly into event manager dashboards.",
              detailText: "Socket.io WebSockets stream real-time gate pass-through counters. Supports manual gate locks, marshal team dispatches, and public PA announcements."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                onClick={() => setActiveModalFeature(item)}
                className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center text-${item.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
                <span className="text-[11px] font-mono font-bold text-cyan-400 mt-4 block group-hover:underline flex items-center space-x-1">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Architecture Modal */}
      {activeModalFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalFeature(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">{activeModalFeature.title}</h3>
                <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider font-mono">Technical Deep Dive</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-dark-800 p-4 rounded-2xl border border-slate-700">
              {activeModalFeature.detailText}
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setActiveModalFeature(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModalFeature(null);
                  navigate("/dashboard");
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs hover:scale-105 transition-all"
              >
                Test Feature Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Workflow */}
      <section id="workflow" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold font-heading text-white">
            How It Works in 4 Steps
          </h2>
          <p className="text-slate-400 text-sm mt-3">From raw blueprint upload to active crowd navigation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Upload Layout", desc: "Upload PNG, JPEG or SVG floor plans & place gate markers." },
            { step: "02", title: "Add Crowd Data", desc: "Stream IoT sensors, upload CSV datasets, or input manual counts." },
            { step: "03", title: "AI Risk Engine", desc: "AI calculates risk score and identifies bottleneck nodes." },
            { step: "04", title: "Safe Rerouting", desc: "Display live heatmaps, broadcast alerts, & update public QR maps." }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-panel border border-slate-800 relative">
              <span className="text-3xl font-black text-cyan-500/30 font-mono block mb-2">{item.step}</span>
              <h3 className="text-base font-bold text-white mb-2 font-heading">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 CrowdFlow AI • Smart India Hackathon (SIH) Project</p>
      </footer>
    </div>
  );
}

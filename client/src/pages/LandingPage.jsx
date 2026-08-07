import React from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  Navigation, 
  Cpu, 
  ArrowRight, 
  Users, 
  CheckCircle,
  Play
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Landing Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/80">
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
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#team" className="hover:text-cyan-400 transition-colors">Team</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all"
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
      <section className="relative overflow-hidden py-24 px-6 max-w-7xl mx-auto">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-POWERED VENUE CROWD MANAGEMENT & STAMPEDE PREVENTION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight text-white">
            Transform Venue Safety with <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Real-Time AI Intelligence</span>
          </h1>

          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            Eliminate crowd bottlenecks at gates, food stalls, and exits. Prevent stampedes using live heatmaps, dynamic AI rerouting algorithms, and Hugging Face predictive analytics.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-sm shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/simulation"
              className="px-7 py-3.5 rounded-2xl glass-panel text-cyan-400 border border-cyan-500/40 font-bold text-sm hover:bg-cyan-500/10 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-cyan-400" />
              <span>Watch AI Simulation</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Hero Live Interactive Demo Card Preview */}
        <div className="mt-16 rounded-3xl glass-panel border border-cyan-500/30 p-6 max-w-5xl mx-auto shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">Live Demo Preset: Narendra Modi Stadium</span>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              Risk Score: 78% (High Congestion)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-dark-800 border border-slate-700">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Detected Bottleneck</h4>
              <p className="text-lg font-bold text-rose-400 mt-1">Gate 2 (East Main VIP)</p>
              <p className="text-xs text-slate-400 mt-1">890 / 1000 people (89% Capacity)</p>
            </div>

            <div className="p-4 rounded-xl bg-dark-800 border border-slate-700">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">AI Reroute Strategy</h4>
              <p className="text-lg font-bold text-cyan-400 mt-1">Divert flow to Exit 4</p>
              <p className="text-xs text-slate-400 mt-1">Saves ~14 mins waiting time</p>
            </div>

            <div className="p-4 rounded-xl bg-dark-800 border border-slate-700">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Evacuation Protocol</h4>
              <p className="text-lg font-bold text-emerald-400 mt-1">4 Exits Clear</p>
              <p className="text-xs text-slate-400 mt-1">Safe evacuation speed &lt; 4 mins</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold font-heading text-white">
            Built for High-Stakes Venue Safety
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Designed for stadium event managers, security teams, and disaster management authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">AI Prediction</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Hugging Face LLM & rule engine predict density spikes 10–15 minutes before bottlenecks occur.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Live Heatmaps</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time green, yellow, and red color density visualization overlaid on floor plans.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Route Suggestions</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Automated safe pedestrian rerouting around clogged gates and congested food courts.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Live Monitoring</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              IoT Sensor API streams real-time gate counts directly into event manager dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
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
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 CrowdFlow AI • Smart India Hackathon (SIH) Project</p>
      </footer>
    </div>
  );
}

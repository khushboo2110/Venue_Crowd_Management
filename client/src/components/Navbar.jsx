import React from "react";
import { useAuth } from "../context/AuthContext";
import { useVenue } from "../context/VenueContext";
import { 
  ShieldAlert, 
  Bell, 
  Cpu, 
  UserCheck, 
  Radio, 
  QrCode,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, switchRole } = useAuth();
  const { isEmergencyMode, toggleEmergencyMode, isLiveStreaming, setIsLiveStreaming, hfToken } = useVenue();

  return (
    <header className="h-16 border-b border-slate-800 bg-dark-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight font-heading bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              CROWDFLOW AI
            </span>
            <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
              SIH Edition • Venue Optimizer
            </span>
          </div>
        </Link>

        {/* Live IoT Sensor Badge */}
        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 border transition-all ${
            isLiveStreaming
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20 animate-pulse"
              : "bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200"
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? "animate-spin" : ""}`} />
          <span>{isLiveStreaming ? "IoT Live Streaming ON" : "IoT Sensor Offline"}</span>
        </button>
      </div>

      {/* Center Action Controls */}
      <div className="flex items-center space-x-3">
        {/* Emergency Evacuation Mode Button */}
        <button
          onClick={toggleEmergencyMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border transition-all shadow-lg ${
            isEmergencyMode
              ? "bg-rose-600 text-white border-rose-500 shadow-rose-600/50 animate-bounce"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isEmergencyMode ? "🚨 EVACUATION MODE ACTIVE" : "EMERGENCY MODE"}</span>
        </button>

        {/* Public Visitor QR Code Quick Link */}
        <Link
          to="/visitor"
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-2 transition-colors"
          title="Open Visitor Public View"
        >
          <QrCode className="w-4 h-4" />
          <span>Visitor QR</span>
        </Link>
      </div>

      {/* Right User & AI Status */}
      <div className="flex items-center space-x-4">
        {/* Hugging Face AI Status */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Cpu className={`w-3.5 h-3.5 ${hfToken ? "text-cyan-400" : "text-amber-400"}`} />
          <span>AI: <strong className={hfToken ? "text-cyan-400" : "text-amber-400"}>{hfToken ? "HuggingFace API" : "Local AI Fallback"}</strong></span>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => switchRole("Admin")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              user?.role === "Admin" ? "bg-cyan-500 text-black font-bold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchRole("Event Manager")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              user?.role === "Event Manager" ? "bg-cyan-500 text-black font-bold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Manager
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400 font-bold border border-slate-600">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
}

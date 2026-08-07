import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  Database, 
  Activity, 
  Navigation, 
  AlertTriangle, 
  FileText, 
  Settings,
  Sparkles,
  QrCode,
  Map
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Venue Builder", path: "/venue", icon: MapPin },
    { label: "Crowd Data & IoT", path: "/crowd-data", icon: Database },
    { label: "AI Simulation ⭐", path: "/simulation", icon: Sparkles, badge: "AI" },
    { label: "Live Crowd Map", path: "/live-map", icon: Map },
    { label: "Alternate Routes", path: "/routes", icon: Navigation },
    { label: "Alerts & Safety", path: "/alerts", icon: AlertTriangle },
    { label: "Reports & PDF", path: "/reports", icon: FileText },
    { label: "System Settings", path: "/settings", icon: Settings },
    { label: "Visitor QR View", path: "/visitor", icon: QrCode, badge: "Public" },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-dark-800/90 backdrop-blur-xl flex flex-col justify-between py-6 px-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Navigation Menu
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    item.badge === 'AI' ? 'bg-cyan-500 text-black' : 'bg-slate-700 text-cyan-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Hackathon SIH Info Box */}
      <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/20 bg-cyan-950/20">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIH Hackathon Ready</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          End-to-End venue safety, bottleneck prediction & AI Hugging Face rerouting engine.
        </p>
      </div>
    </aside>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Lock, Mail, UserCheck, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@stadium.sih");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Admin");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = {
      id: "u-101",
      name: email.split("@")[0] || "User",
      email,
      role
    };
    login(mockUser, "jwt_token_sih_2026");
    if (role === "Admin") {
      navigate("/venue");
    } else {
      navigate("/dashboard");
    }
  };

  const handleQuickDemo = (demoRole) => {
    const demoUser = {
      id: demoRole === 'Admin' ? "u-admin" : "u-manager",
      name: demoRole === 'Admin' ? "System Admin" : "Venue Manager",
      email: demoRole === 'Admin' ? "admin@sih.in" : "manager@sih.in",
      role: demoRole
    };
    login(demoUser, "jwt_demo_token");
    if (demoRole === "Admin") {
      navigate("/venue");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-800 p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-black text-2xl mx-auto shadow-lg shadow-cyan-500/25 mb-3">
            <Zap className="w-7 h-7 text-black fill-black" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">Sign In to CrowdFlow</h2>
          <p className="text-xs text-slate-400 mt-1">Select your access role for venue crowd controls</p>
        </div>

        {/* Quick Demo Login Buttons for Judges */}
        <div className="mb-6 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Hackathon Judge Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo("Admin")}
              className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-all flex items-center justify-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              onClick={() => handleQuickDemo("Event Manager")}
              className="py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-xs border border-blue-500/40 transition-all flex items-center justify-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Manager Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Selection</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("Admin")}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  role === "Admin" ? "bg-cyan-500 text-black border-cyan-400" : "bg-dark-800 text-slate-400 border-slate-700"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("Event Manager")}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  role === "Event Manager" ? "bg-cyan-500 text-black border-cyan-400" : "bg-dark-800 text-slate-400 border-slate-700"
                }`}
              >
                Event Manager
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-dark-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-dark-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all"
          >
            Authenticate & Open Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

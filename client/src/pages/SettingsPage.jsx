import React, { useState } from "react";
import { useVenue } from "../context/VenueContext";
import { Settings, Cpu, Key, Bell, Sliders, CheckCircle2, Save } from "lucide-react";

export default function SettingsPage() {
  const { hfToken, updateHfToken } = useVenue();
  const [tokenInput, setTokenInput] = useState(hfToken);
  const [modelChoice, setModelChoice] = useState("Qwen/Qwen3-4B-Instruct");
  const [sensitivity, setSensitivity] = useState(80);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateHfToken(tokenInput);
    setSaveMessage("Settings & Hugging Face credentials updated successfully!");
    setTimeout(() => setSaveMessage(""), 3500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black font-heading text-white tracking-tight">System Settings & AI Model Config</h1>
        <p className="text-xs text-slate-400 mt-1">Configure Hugging Face API keys, notification dispatchers, and risk sensitivity</p>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Hugging Face API Key Card (Specified in Prompt) */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-cyan-950/20 space-y-4">
          <div className="flex items-center space-x-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-extrabold text-white font-heading">Hugging Face AI Integration</h3>
              <p className="text-xs text-cyan-400">Connect Hugging Face API key for live LLM safety recommendations</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Hugging Face API Token (hf_...)</span>
              <span className="text-[10px] text-slate-400">Leave blank to use smart offline fallback AI</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Model Identifier</label>
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Qwen/Qwen3-4B-Instruct">Qwen/Qwen3-4B-Instruct (Recommended for Hackathon)</option>
              <option value="Mistralai/Mistral-7B-Instruct-v0.2">Mistralai/Mistral-7B-Instruct-v0.2</option>
              <option value="meta-llama/Meta-Llama-3-8B-Instruct">meta-llama/Meta-Llama-3-8B-Instruct</option>
            </select>
          </div>
        </div>

        {/* AI Sensitivity & Threshold Settings */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white font-heading">AI Bottleneck Risk Sensitivity</h3>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Gate Congestion Threshold</span>
              <span className="font-bold text-amber-400">{sensitivity}% Capacity</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">Triggers emergency alerts when any gate reaches {sensitivity}% capacity.</p>
          </div>
        </div>

        {/* Notification Dispatch Settings */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-extrabold text-white font-heading">Staff SMS & Push Alerts</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Automated Security Marshal Notifications</span>
              <span className="text-[11px] text-slate-400">Broadcast SMS warnings when risk score exceeds 75%</span>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                notificationsEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black"></span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </form>
    </div>
  );
}

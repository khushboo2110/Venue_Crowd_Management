import React, { useState } from "react";
import { useVenue } from "../context/VenueContext";
import { Database, Upload, Radio, Save, CheckCircle2, FileSpreadsheet } from "lucide-react";

export default function CrowdDataPage() {
  const { activeVenue, updateNodeCrowd, setAllNodesCrowd, isLiveStreaming, setIsLiveStreaming } = useVenue();
  const [csvStatus, setCsvStatus] = useState("");

  const handleManualChange = (id, val) => {
    updateNodeCrowd(id, val);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split("\n");
        const updates = {};
        
        lines.forEach(line => {
          const parts = line.split(",");
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parseInt(parts[1].trim(), 10);
            if (!isNaN(val)) {
              // match node by label or id
              const matched = activeVenue.nodes.find(n => n.id.toLowerCase() === key.toLowerCase() || n.label.toLowerCase().includes(key.toLowerCase()));
              if (matched) {
                updates[matched.id] = val;
              }
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          setAllNodesCrowd(updates);
          setCsvStatus(`Successfully imported crowd data for ${Object.keys(updates).length} nodes!`);
        } else {
          setCsvStatus("CSV parsed. Tip: Sample CSV format: Gate 1, 450");
        }
      };
      reader.readAsText(file);
    }
  };

  const loadSampleCsvPreset = () => {
    const sampleMap = {};
    activeVenue.nodes.forEach(n => {
      sampleMap[n.id] = Math.floor(Math.random() * 600) + 150;
    });
    setAllNodesCrowd(sampleMap);
    setCsvStatus("Loaded sample realistic festival crowd dataset!");
    setTimeout(() => setCsvStatus(""), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">Crowd Data Ingestion Engine</h1>
          <p className="text-xs text-slate-400 mt-1">Input live gate headcounts manually, stream IoT sensors, or upload CSV files</p>
        </div>

        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all ${
            isLiveStreaming
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
          }`}
        >
          <Radio className={`w-4 h-4 ${isLiveStreaming ? "animate-spin text-emerald-400" : ""}`} />
          <span>{isLiveStreaming ? "IoT Stream Running" : "Connect IoT Sensors API"}</span>
        </button>
      </div>

      {csvStatus && (
        <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{csvStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Gate Input Controls (Specified in Prompt) */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Manual Gate & Stall Headcounts</h3>
            <span className="text-xs text-slate-400">Updates sync in real-time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVenue.nodes.map(node => (
              <div key={node.id} className="p-4 rounded-2xl bg-dark-800 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{node.label}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-cyan-300">{node.type}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={node.crowd}
                    onChange={(e) => handleManualChange(node.id, e.target.value)}
                    className="flex-1 bg-dark-900 border border-slate-600 rounded-xl px-3 py-2 text-sm font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-xs text-slate-400 font-medium">/ {node.maxCapacity || 1000} Max</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSV Upload & Preset Importer */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading mb-2">CSV Dataset Import</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Upload CSV file with node names and headcount metrics.
            </p>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl cursor-pointer transition-colors bg-dark-800/60 mb-3">
              <Upload className="w-6 h-6 text-cyan-400 mb-2" />
              <span className="text-xs text-slate-300 font-bold">Select CSV File</span>
              <span className="text-[10px] text-slate-500 mt-1">Format: NodeName, Headcount</span>
              <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
            </label>

            <button
              onClick={loadSampleCsvPreset}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Load Sample CSV Dataset</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">IoT API Endpoint</h4>
            <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
              POST /api/venues/{activeVenue.id}/crowd
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

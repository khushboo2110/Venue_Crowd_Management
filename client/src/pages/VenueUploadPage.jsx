import React, { useState, useRef } from "react";
import { useVenue } from "../context/VenueContext";
import { Upload, MapPin, Plus, Save, Trash2, CheckCircle2 } from "lucide-react";

export default function VenueUploadPage() {
  const { activeVenue, setActiveVenue } = useVenue();
  const [venueName, setVenueName] = useState(activeVenue.name);
  const [category, setCategory] = useState(activeVenue.category);
  const [capacity, setCapacity] = useState(activeVenue.capacity);
  const [imageSrc, setImageSrc] = useState(null);
  const [nodes, setNodes] = useState(activeVenue.nodes);
  const [selectedNodeType, setSelectedNodeType] = useState("gate");
  const [labelInput, setLabelInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const typePrefix = selectedNodeType === 'gate' ? 'Gate' : selectedNodeType === 'stall' ? 'Stall' : selectedNodeType === 'exit' ? 'Exit' : 'Stage';
    const newId = `${selectedNodeType}-${Date.now().toString().slice(-4)}`;
    
    const newNode = {
      id: newId,
      label: labelInput.trim() || `${typePrefix} ${nodes.length + 1}`,
      type: selectedNodeType,
      x,
      y,
      crowd: 150,
      maxCapacity: selectedNodeType === 'exit' ? 2000 : 800
    };

    setNodes([...nodes, newNode]);
    setLabelInput("");
  };

  const handleRemoveNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const handleSaveVenue = () => {
    const updated = {
      ...activeVenue,
      name: venueName,
      category,
      capacity: Number(capacity),
      nodes
    };
    setActiveVenue(updated);
    setSuccessMsg("Venue floor plan & markers successfully updated!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">Venue Setup & Floor Plan Builder</h1>
          <p className="text-xs text-slate-400 mt-1">Upload PNG, JPEG, SVG stadium maps and place interactive gate/exit markers</p>
        </div>
        <button
          onClick={handleSaveVenue}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Venue Map</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload & Venue Metadata Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">1. Venue Metadata</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Venue Name</label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Stadium">Stadium / Arena</option>
              <option value="Exhibition">Exhibition Center / Expo</option>
              <option value="Concert">Concert Grounds</option>
              <option value="Convention">Convention Hall</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Maximum Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Upload Custom Blueprint (PNG, JPG, SVG)</label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl cursor-pointer transition-colors bg-dark-800/60">
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs text-slate-300 font-medium">Click to upload map image</span>
              <span className="text-[10px] text-slate-500 mt-1">Supports PNG, JPEG, SVG up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Marker Placement Controls */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-white font-heading">2. Interactive Marker Placement</h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Marker Type:</span>
              {['gate', 'stall', 'stage', 'exit'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedNodeType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedNodeType === t ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Custom Marker Label (Optional)"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              className="flex-1 bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <span className="text-xs text-slate-400 italic">Click on map below to drop marker</span>
          </div>

          {/* Interactive Canvas Container */}
          <div className="relative border border-slate-700 rounded-2xl overflow-hidden bg-dark-900 min-h-[380px] flex items-center justify-center cursor-crosshair">
            {imageSrc ? (
              <img src={imageSrc} alt="Venue Map" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-dark-900 to-slate-900 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                <MapPin className="w-12 h-12 mb-2 opacity-30" />
                <span className="text-xs font-semibold">Using Blueprint Grid Canvas</span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={700}
              height={380}
              onClick={handleCanvasClick}
              className="relative z-10 w-full h-[380px]"
            />
          </div>

          {/* Placed Markers List */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Placed Node Markers ({nodes.length})</h4>
            <div className="flex flex-wrap gap-2">
              {nodes.map(n => (
                <span key={n.id} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
                  <span className={`w-2 h-2 rounded-full ${n.type === 'gate' ? 'bg-cyan-400' : n.type === 'exit' ? 'bg-emerald-400' : n.type === 'stall' ? 'bg-amber-400' : 'bg-purple-400'}`}></span>
                  <span className="font-medium">{n.label}</span>
                  <button onClick={() => handleRemoveNode(n.id)} className="text-slate-500 hover:text-rose-400 ml-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { useVenue } from "../context/VenueContext";
import { 
  Upload, 
  MapPin, 
  Plus, 
  Save, 
  Trash2, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Sparkles, 
  Grid, 
  RotateCcw,
  Sliders,
  Building2,
  Ticket,
  AlertOctagon,
  Utensils
} from "lucide-react";

export default function VenueUploadPage() {
  const { activeVenue, setActiveVenue, venues } = useVenue();
  const [venueName, setVenueName] = useState(activeVenue.name);
  const [category, setCategory] = useState(activeVenue.category);
  const [capacity, setCapacity] = useState(activeVenue.capacity);
  const [imageSrc, setImageSrc] = useState(null);
  const [nodes, setNodes] = useState(activeVenue.nodes);
  const [selectedNodeType, setSelectedNodeType] = useState("gate");
  const [labelInput, setLabelInput] = useState("");
  const [customCapacityInput, setCustomCapacityInput] = useState(800);
  const [hoverCoords, setHoverCoords] = useState({ x: 0, y: 0 });
  const [successMsg, setSuccessMsg] = useState("");

  const canvasRef = useRef(null);

  // Sync state when activeVenue changes
  useEffect(() => {
    setVenueName(activeVenue.name);
    setCategory(activeVenue.category);
    setCapacity(activeVenue.capacity);
    setNodes(activeVenue.nodes);
  }, [activeVenue]);

  // Draw blueprint canvas background grid and node markers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(31, 41, 61, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render connecting path lines between nodes if present
    (activeVenue.edges || []).forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo((fromNode.x / 800) * width, (fromNode.y / 600) * height);
        ctx.lineTo((toNode.x / 800) * width, (toNode.y / 600) * height);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Render Node Markers
    nodes.forEach(node => {
      const nx = (node.x / 800) * width;
      const ny = (node.y / 600) * height;

      let strokeColor = '#00F0FF';
      let fillColor = 'rgba(0, 240, 255, 0.2)';
      if (node.type === 'exit') { strokeColor = '#10B981'; fillColor = 'rgba(16, 185, 129, 0.2)'; }
      else if (node.type === 'stall') { strokeColor = '#F59E0B'; fillColor = 'rgba(245, 158, 11, 0.2)'; }
      else if (node.type === 'stage') { strokeColor = '#8B5CF6'; fillColor = 'rgba(139, 92, 246, 0.2)'; }

      // Outer glowing ring
      ctx.beginPath();
      ctx.arc(nx, ny, 16, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Node Anchor Circle
      ctx.beginPath();
      ctx.arc(nx, ny, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#0b0f19';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();

      // Node Label
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#F3F4F6';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny - 20);

      // Subtext
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = strokeColor;
      ctx.fillText(`${node.maxCapacity || 1000} Max`, nx, ny + 22);
    });

  }, [nodes, imageSrc, activeVenue]);

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

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 600);
    setHoverCoords({ x, y });
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 600);

    const typePrefix = selectedNodeType === 'gate' ? 'Gate' : selectedNodeType === 'stall' ? 'Stall' : selectedNodeType === 'exit' ? 'Emergency Exit' : 'Stage / Arena';
    const newId = `${selectedNodeType}-${Date.now().toString().slice(-4)}`;
    
    const newNode = {
      id: newId,
      label: labelInput.trim() || `${typePrefix} ${nodes.length + 1}`,
      type: selectedNodeType,
      x,
      y,
      crowd: 120,
      maxCapacity: Number(customCapacityInput) || (selectedNodeType === 'exit' ? 2000 : 800)
    };

    setNodes([...nodes, newNode]);
    setLabelInput("");
  };

  const handleRemoveNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const handleClearAllNodes = () => {
    if (window.confirm("Are you sure you want to clear all placed map markers?")) {
      setNodes([]);
    }
  };

  const handleLoadPresetVenue = (preset) => {
    setVenueName(preset.name);
    setCategory(preset.category);
    setCapacity(preset.capacity);
    setNodes(preset.nodes);
    setActiveVenue(preset);
    setSuccessMsg(`Loaded ${preset.name} map template!`);
    setTimeout(() => setSuccessMsg(""), 3000);
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
    setSuccessMsg("Venue layout blueprint & node markers successfully saved!");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const markerTypes = [
    { type: "gate", label: "Entry Gate", color: "border-cyan-500 bg-cyan-500/10 text-cyan-400", icon: Ticket },
    { type: "stall", label: "Food Stall", color: "border-amber-500 bg-amber-500/10 text-amber-400", icon: Utensils },
    { type: "stage", label: "Stage / Arena", color: "border-purple-500 bg-purple-500/10 text-purple-400", icon: Building2 },
    { type: "exit", label: "Emergency Exit", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400", icon: AlertOctagon },
  ];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-dark-800 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>GIS & CAD Layout Studio</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">
            Venue Blueprint & Interactive Marker Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure venue dimensions, upload architectural floor plans, and drop real-time entry/exit sensor nodes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearAllNodes}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Markers</span>
          </button>

          <button
            onClick={handleSaveVenue}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Venue Blueprint</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Upload Form */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preset Stadium Selector Cards */}
          <div className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Preset Templates</span>
              </span>
              <span className="text-[10px] text-slate-500">1-Click Load</span>
            </div>

            <div className="space-y-2">
              {venues.map(v => (
                <button
                  key={v.id}
                  onClick={() => handleLoadPresetVenue(v)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    activeVenue.id === v.id
                      ? "bg-cyan-500/10 border-cyan-500/40 text-white shadow-md shadow-cyan-500/10"
                      : "bg-dark-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{v.name}</span>
                    <span className="text-[10px] text-slate-400">{v.category} • {v.capacity.toLocaleString()} Capacity</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {v.nodes.length} Nodes
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading border-b border-slate-800 pb-3">
              1. Venue Configuration
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Venue Name</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. Narendra Modi Stadium Main Oval"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Stadium">Stadium / Arena</option>
                  <option value="Exhibition">Trade Exhibition</option>
                  <option value="Concert">Music Festival</option>
                  <option value="Convention">Convention Center</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Custom Blueprint Dropzone */}
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Upload Architectural Floor Plan</label>
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl cursor-pointer transition-colors bg-dark-900/60 group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 mb-2 transition-colors" />
                <span className="text-xs text-slate-200 font-semibold">Click to select layout image</span>
                <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, SVG • Up to 15MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: CAD Canvas Editor & Marker Toolbar */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-heading">2. Interactive Marker Placement</h3>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono bg-dark-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400">
                <span>Cursor:</span>
                <span className="text-cyan-400 font-bold">X: {hoverCoords.x} | Y: {hoverCoords.y}</span>
              </div>
            </div>

            {/* Marker Type Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {markerTypes.map(item => {
                const Icon = item.icon;
                const isSelected = selectedNodeType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedNodeType(item.type)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                      isSelected
                        ? item.color + " shadow-md"
                        : "bg-dark-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Label & Node Capacity Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Custom Marker Name (e.g. Gate 1 - VIP North)"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Node Max Capacity (e.g. 1000)"
                  value={customCapacityInput}
                  onChange={(e) => setCustomCapacityInput(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* CAD Interactive Canvas Viewport */}
            <div 
              className="relative border border-slate-700 rounded-2xl overflow-hidden bg-dark-950 min-h-[420px] flex items-center justify-center cursor-crosshair group shadow-inner"
              onMouseMove={handleMouseMove}
            >
              {imageSrc && (
                <img src={imageSrc} alt="Venue Layout" className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80" />
              )}

              <canvas
                ref={canvasRef}
                width={800}
                height={420}
                onClick={handleCanvasClick}
                className="relative z-10 w-full h-[420px]"
              />

              <div className="absolute bottom-3 left-3 z-20 pointer-events-none bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Click anywhere on map grid to drop selected marker</span>
              </div>
            </div>
          </div>

          {/* Node Management Data Table */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Configured Sensor Nodes ({nodes.length})
              </h4>
              <span className="text-xs text-slate-500">Click icon to delete node</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {nodes.map(n => (
                <div key={n.id} className="p-3 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      n.type === 'gate' ? 'bg-cyan-400' : n.type === 'exit' ? 'bg-emerald-400' : n.type === 'stall' ? 'bg-amber-400' : 'bg-purple-400'
                    }`}></span>
                    <div className="truncate">
                      <span className="font-bold text-white block truncate">{n.label}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{n.type} • {n.maxCapacity || 1000} Cap</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveNode(n.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Remove marker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

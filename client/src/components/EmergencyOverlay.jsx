import React from "react";
import { ShieldAlert, Radio, AlertOctagon } from "lucide-react";
import { useVenue } from "../context/VenueContext";

export default function EmergencyOverlay() {
  const { isEmergencyMode, toggleEmergencyMode } = useVenue();

  if (!isEmergencyMode) return null;

  return (
    <div className="bg-rose-950/90 border-b-2 border-rose-600 px-6 py-3 text-white flex items-center justify-between animate-pulse sticky top-16 z-20">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-rose-600 animate-bounce">
          <AlertOctagon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm tracking-wider uppercase flex items-center space-x-2">
            <span>🚨 EMERGENCY EVACUATION PROTOCOL ENGAGED</span>
            <span className="text-[10px] bg-rose-800 px-2 py-0.5 rounded-full font-bold">LIVE STAMPEDE PREVENTION</span>
          </h4>
          <p className="text-xs text-rose-200">
            All gates set to Outflow Direction. Digital signage directing crowd to Exits 1, 2 & 4. Security marshals notified.
          </p>
        </div>
      </div>

      <button
        onClick={toggleEmergencyMode}
        className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 font-extrabold text-xs hover:bg-rose-100 transition-colors"
      >
        Deactivate Protocol
      </button>
    </div>
  );
}

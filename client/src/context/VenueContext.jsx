import React, { createContext, useContext, useState, useEffect } from "react";
import { PRESET_VENUES } from "../../../server/data/presetVenues.js";
import { runAICrowdAnalysis } from "../services/aiEngine.js";

const VenueContext = createContext(null);

export function VenueProvider({ children }) {
  const [venues, setVenues] = useState(PRESET_VENUES);
  const [activeVenue, setActiveVenue] = useState(PRESET_VENUES[0]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [hfToken, setHfToken] = useState(() => localStorage.getItem("hf_api_token") || "");
  const [alerts, setAlerts] = useState([
    {
      id: "alt-1",
      type: "High Congestion",
      severity: "danger",
      title: "Gate 2 Capacity Warning",
      message: "Gate 2 crowd density exceeded 89%. Congestion risk high.",
      time: "Just now"
    },
    {
      id: "alt-2",
      type: "Food Stall Queue",
      severity: "warning",
      title: "Food Court North Queue Overflow",
      message: "Over 620 visitors waiting. Suggest redirecting to Food Court South.",
      time: "4 mins ago"
    }
  ]);

  // Execute AI analysis when active venue changes or crowd counts update
  useEffect(() => {
    let isMounted = true;
    runAICrowdAnalysis({ venue: activeVenue, hfToken }).then(result => {
      if (isMounted) setAiAnalysis(result);
    });
    return () => { isMounted = false; };
  }, [activeVenue, hfToken]);

  // IoT Sensor Live Stream simulation timer
  useEffect(() => {
    let interval = null;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        setActiveVenue(prev => {
          const updatedNodes = prev.nodes.map(n => {
            const delta = Math.floor(Math.random() * 31) - 15;
            const newCrowd = Math.max(10, Math.min(n.maxCapacity || 1500, n.crowd + delta));
            return { ...n, crowd: newCrowd };
          });
          return { ...prev, nodes: updatedNodes };
        });
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isLiveStreaming]);

  const updateNodeCrowd = (nodeId, newCount) => {
    setActiveVenue(prev => {
      const updatedNodes = prev.nodes.map(n => n.id === nodeId ? { ...n, crowd: Number(newCount) } : n);
      return { ...prev, nodes: updatedNodes };
    });
  };

  const setAllNodesCrowd = (nodeUpdatesMap) => {
    setActiveVenue(prev => {
      const updatedNodes = prev.nodes.map(n => {
        return nodeUpdatesMap[n.id] !== undefined ? { ...n, crowd: Number(nodeUpdatesMap[n.id]) } : n;
      });
      return { ...prev, nodes: updatedNodes };
    });
  };

  const toggleGateStatus = (gateId) => {
    setActiveVenue(prev => {
      const updatedNodes = prev.nodes.map(n => {
        if (n.id === gateId) {
          const isClosed = n.isClosed;
          return { ...n, isClosed: !isClosed, crowd: !isClosed ? 0 : 200 };
        }
        return n;
      });
      return { ...prev, nodes: updatedNodes };
    });
  };

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(prev => !prev);
  };

  const addAlert = (alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const updateHfToken = (token) => {
    setHfToken(token);
    localStorage.setItem("hf_api_token", token);
  };

  return (
    <VenueContext.Provider
      value={{
        venues,
        activeVenue,
        setActiveVenue,
        aiAnalysis,
        isEmergencyMode,
        toggleEmergencyMode,
        isLiveStreaming,
        setIsLiveStreaming,
        updateNodeCrowd,
        setAllNodesCrowd,
        toggleGateStatus,
        alerts,
        addAlert,
        hfToken,
        updateHfToken
      }}
    >
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  return useContext(VenueContext);
}

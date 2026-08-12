import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { PRESET_VENUES } from "../../../server/data/presetVenues.js";
import { runAICrowdAnalysis } from "../services/aiEngine.js";

const VenueContext = createContext(null);

export function VenueProvider({ children }) {
  // Primary venue telemetry & configuration state
  const [venues] = useState(PRESET_VENUES);
  const [activeVenue, setActiveVenue] = useState(PRESET_VENUES[0]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [hfToken, setHfToken] = useState(
    () => localStorage.getItem("hf_api_token") || "",
  );
  const [alertSeverityFilter, setAlertSeverityFilter] = useState("all");
  const [alertSearchQuery, setAlertSearchQuery] = useState("");

  // Real-time security alerts & incident queue
  const [alerts, setAlerts] = useState([
    {
      id: "alt-101",
      type: "High Congestion",
      severity: "danger",
      title: "Gate 2 Capacity Alert",
      location: "Gate 2 (East Main VIP)",
      message:
        "Crowd density reached 89% capacity. High risk of queue accumulation.",
      time: "2 mins ago",
      nodeId: "g2",
      status: "active",
    },
    {
      id: "alt-102",
      type: "Food Stall Queue",
      severity: "warning",
      title: "Food Court North Bottleneck",
      location: "Food Court North",
      message:
        "Wait time exceeds 22 mins with 620 visitors queued. Recommend flow diversion.",
      time: "5 mins ago",
      nodeId: "fs1",
      status: "active",
    },
    {
      id: "alt-103",
      type: "Evacuation Protocol",
      severity: "info",
      title: "Emergency Routes Operational",
      location: "All Emergency Exits",
      message:
        "Automated exit path check complete. 4 emergency doors unlocked and monitored.",
      time: "12 mins ago",
      nodeId: "ex1",
      status: "active",
    },
  ]);

  // Security marshal dispatch assignments
  const [securityDispatches, setSecurityDispatches] = useState([
    {
      id: "dsp-1",
      alertId: "alt-101",
      teamName: "Alpha Rapid Response",
      count: 4,
      location: "Gate 2 (East Main VIP)",
      eta: "2 Mins",
      timestamp: new Date(Date.now() - 3 * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Public PA System announcements history
  const [paBroadcasts, setPaBroadcasts] = useState([
    {
      id: "pa-1",
      message:
        "Attention visitors near Gate 2: Please proceed to Emergency Exit 4 for express venue entry.",
      zone: "East Concourse & VIP Gate",
      timestamp: new Date(Date.now() - 8 * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Real-time system activity audit trail
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "log-1",
      category: "SYSTEM",
      action: "Venue Initialized",
      details:
        "Loaded Narendra Modi Stadium Ground topology (100,000 capacity)",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "log-2",
      category: "AI_ENGINE",
      action: "Predictive Telemetry Sync",
      details:
        "AI Model evaluated risk score at 78% (High Congestion at Gate 2)",
      timestamp: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
    },
  ]);

  // Log system activity event into chronological audit log
  const logAuditEvent = useCallback((category, action, details) => {
    const newEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category,
      action,
      details,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep recent 50 events
  }, []);

  const updateVenueNodes = useCallback((mutator) => {
    setActiveVenue((prev) => ({
      ...prev,
      nodes: mutator(prev.nodes),
    }));
  }, []);

  // Execute AI analysis when active venue changes or crowd counts update
  useEffect(() => {
    let isMounted = true;
    runAICrowdAnalysis({ venue: activeVenue, hfToken }).then((result) => {
      if (isMounted) setAiAnalysis(result);
    });
    return () => {
      isMounted = false;
    };
  }, [activeVenue, hfToken]);

  // IoT Sensor Live Stream simulation timer (Updates node headcounts dynamically)
  useEffect(() => {
    let interval = null;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        setActiveVenue((prev) => {
          const updatedNodes = prev.nodes.map((n) => {
            const delta = Math.floor(Math.random() * 31) - 15;
            const newCrowd = Math.max(
              10,
              Math.min(n.maxCapacity || 1500, n.crowd + delta),
            );
            return { ...n, crowd: newCrowd };
          });
          return { ...prev, nodes: updatedNodes };
        });
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveStreaming]);

  // Update specific node crowd headcount directly
  const updateNodeCrowd = (nodeId, newCount) => {
    setActiveVenue((prev) => {
      const updatedNodes = prev.nodes.map((n) =>
        n.id === nodeId ? { ...n, crowd: Math.max(0, Number(newCount)) } : n,
      );
      return { ...prev, nodes: updatedNodes };
    });
    logAuditEvent(
      "TELEMETRY",
      "Node Headcount Updated",
      `Node ID ${nodeId} set to ${newCount} visitors`,
    );
  };

  // Bulk update all node crowd counts
  const setAllNodesCrowd = (nodeUpdatesMap) => {
    setActiveVenue((prev) => {
      const updatedNodes = prev.nodes.map((n) => {
        return nodeUpdatesMap[n.id] !== undefined
          ? { ...n, crowd: Math.max(0, Number(nodeUpdatesMap[n.id])) }
          : n;
      });
      return { ...prev, nodes: updatedNodes };
    });
    logAuditEvent(
      "TELEMETRY",
      "Bulk Sensor Calibrated",
      "Updated multiple gate & stall crowd counts",
    );
  };

  // Toggle open/closed status for a specific gate
  const toggleGateStatus = (gateId) => {
    let newState = false;
    let gateLabel = gateId;
    updateVenueNodes((nodes) =>
      nodes.map((n) => {
        if (n.id !== gateId) return n;
        newState = !n.isClosed;
        gateLabel = n.label;
        return {
          ...n,
          isClosed: newState,
          crowd: newState
            ? 0
            : Math.max(100, Math.round((n.maxCapacity || 1000) * 0.2)),
          direction: newState ? "locked" : n.direction || "two-way",
        };
      }),
    );
    logAuditEvent(
      "SECURITY",
      newState ? "Gate Locked Down" : "Gate Unlocked",
      `${gateLabel} is now ${newState ? "CLOSED / LOCKED" : "OPEN & CLEAR"}`,
    );
  };

  // Update gate flow direction (Two-Way, Entry-Only, Exit-Only, Locked)
  const setGateDirection = (gateId, direction) => {
    let gateLabel = gateId;
    updateVenueNodes((nodes) =>
      nodes.map((n) => {
        if (n.id !== gateId) return n;
        gateLabel = n.label;
        return { ...n, direction, isClosed: direction === "locked" };
      }),
    );
    logAuditEvent(
      "SECURITY",
      "Gate Direction Modified",
      `${gateLabel} set to flow mode: ${direction.toUpperCase()}`,
    );
  };

  // Update a gate capacity limit while preserving the original venue template in a baseMaxCapacity field.
  const setGateCapacityLimit = (gateId, limit) => {
    const numericLimit = Number(limit);
    let gateLabel = gateId;
    updateVenueNodes((nodes) =>
      nodes.map((n) => {
        if (n.id !== gateId) return n;
        gateLabel = n.label;
        const baseMaxCapacity = n.baseMaxCapacity || n.maxCapacity || 1000;
        if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
          return { ...n, baseMaxCapacity, maxCapacity: baseMaxCapacity };
        }
        return { ...n, baseMaxCapacity, maxCapacity: numericLimit };
      }),
    );
    logAuditEvent(
      "SECURITY",
      "Gate Capacity Limit Updated",
      `${gateLabel} threshold set to ${Number.isFinite(numericLimit) && numericLimit > 0 ? numericLimit : "default"} visitors`,
    );
  };

  // Toggle global venue Emergency Evacuation Mode
  const toggleEmergencyMode = () => {
    setIsEmergencyMode((prev) => {
      const next = !prev;
      logAuditEvent(
        "EMERGENCY",
        next ? "EVACUATION MODE ACTIVATED" : "Evacuation Mode Stand-by",
        next
          ? "Dispatched siren alarms, public PA broadcast & unlocked all emergency exits"
          : "Returned to standard operational venue monitoring",
      );
      return next;
    });
  };

  // Mark an alert as resolved
  const resolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a)),
    );
    logAuditEvent(
      "ALERTS",
      "Alert Resolved",
      `Alert ID ${alertId} marked as resolved by operator`,
    );
  };

  // Archive resolved alerts after the UI has animated them out of the active queue.
  const archiveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "archived" } : a)),
    );
    logAuditEvent(
      "ALERTS",
      "Alert Archived",
      `Alert ID ${alertId} moved into the audit archive`,
    );
  };

  // Create a custom incident alert
  const addAlert = (newAlert) => {
    const alertObj = {
      id: `alt-${Date.now()}`,
      time: "Just now",
      status: "active",
      severity: newAlert.severity || "warning",
      ...newAlert,
    };
    setAlerts((prev) => [alertObj, ...prev]);
    logAuditEvent(
      "ALERTS",
      "Incident Alert Injected",
      `${alertObj.title} - ${alertObj.location}`,
    );
  };

  // Dispatch Security Marshals team to an alert location
  const dispatchSecurityTeam = ({
    alertId,
    teamName,
    count,
    location,
    eta,
  }) => {
    const dispatchObj = {
      id: `dsp-${Date.now()}`,
      alertId,
      teamName: teamName || "Tactical Response Unit",
      count: count || 4,
      location: location || "Target Gate",
      eta: eta || "3 Mins",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setSecurityDispatches((prev) => [dispatchObj, ...prev]);
    logAuditEvent(
      "SECURITY",
      "Marshal Team Dispatched",
      `${count} officers from ${teamName} deployed to ${location} (ETA: ${eta})`,
    );
  };

  // Broadcast PA System Advisory
  const broadcastPAAnnouncement = ({ message, zone }) => {
    const broadcastObj = {
      id: `pa-${Date.now()}`,
      message,
      zone: zone || "All Venue Zones",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setPaBroadcasts((prev) => [broadcastObj, ...prev]);
    logAuditEvent(
      "PA_BROADCAST",
      "Public Advisory Sent",
      `[${zone}] ${message}`,
    );
  };

  // Load Hackathon Judge Preset Scenarios for instant live demonstration
  const loadJudgePresetScenario = (scenarioKey) => {
    const normalizedKey = String(scenarioKey || "")
      .trim()
      .toLowerCase();
    if (
      normalizedKey === "high-risk-surge" ||
      normalizedKey === "high risk surge"
    ) {
      setActiveVenue((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.id === "g2") return { ...n, crowd: 940, maxCapacity: 1000 };
          if (n.id === "g3") return { ...n, crowd: 910, maxCapacity: 1000 };
          if (n.id === "fs1") return { ...n, crowd: 680, maxCapacity: 700 };
          return n;
        }),
      }));
      setIsEmergencyMode(false);
      logAuditEvent(
        "HACKATHON_DEMO",
        "Preset Loaded: High Risk Surge",
        "Simulated heavy crowd congestion at Gate 2 (94%) and Gate 3 (91%)",
      );
    } else if (
      normalizedKey === "food-court-overflow" ||
      normalizedKey === "food court bottleneck" ||
      normalizedKey === "food-court-bottleneck"
    ) {
      setActiveVenue((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.id === "fs1") return { ...n, crowd: 690, maxCapacity: 700 };
          if (n.id === "fs3") return { ...n, crowd: 490, maxCapacity: 500 };
          if (n.id === "fs2") return { ...n, crowd: 120, maxCapacity: 700 };
          return n;
        }),
      }));
      setIsEmergencyMode(false);
      logAuditEvent(
        "HACKATHON_DEMO",
        "Preset Loaded: Food Court Bottleneck",
        "Simulated surge at Food Court North & Merch East with low crowd at Food Court South",
      );
    } else if (
      normalizedKey === "evacuation-mode" ||
      normalizedKey === "evacuation mode"
    ) {
      setIsEmergencyMode(true);
      logAuditEvent(
        "HACKATHON_DEMO",
        "Preset Loaded: Evacuation Protocol Drill",
        "Triggered emergency evacuation overlay and unlocked all auxiliary exits",
      );
    } else if (scenarioKey === "normal-flow") {
      setActiveVenue((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => ({
          ...n,
          crowd: Math.floor(n.maxCapacity * 0.35),
          isClosed: false,
        })),
      }));
      setIsEmergencyMode(false);
      logAuditEvent(
        "HACKATHON_DEMO",
        "Preset Loaded: Reset to Normal Flow",
        "All gates reset to 35% nominal occupancy",
      );
    }
  };

  const updateHfToken = (token) => {
    setHfToken(token);
    localStorage.setItem("hf_api_token", token);
    logAuditEvent(
      "SETTINGS",
      "AI Engine Key Configured",
      "Saved Hugging Face API authentication token",
    );
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
        setGateDirection,
        setGateCapacityLimit,
        alerts,
        addAlert,
        resolveAlert,
        archiveAlert,
        alertSeverityFilter,
        setAlertSeverityFilter,
        alertSearchQuery,
        setAlertSearchQuery,
        securityDispatches,
        dispatchSecurityTeam,
        paBroadcasts,
        broadcastPAAnnouncement,
        auditLogs,
        logAuditEvent,
        loadJudgePresetScenario,
        hfToken,
        updateHfToken,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  return useContext(VenueContext);
}

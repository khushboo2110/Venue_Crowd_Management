import React, { useEffect, useMemo, useState } from "react";
import { useVenue } from "../context/VenueContext";
import { AlertTriangle, ShieldAlert, Lock, Unlock, BellRing, Search, X, Send, Megaphone, Plus, Volume2, Clock3, MapPin } from "lucide-react";

export default function AlertsPage() {
  const {
    alerts,
    activeVenue,
    toggleGateStatus,
    isEmergencyMode,
    toggleEmergencyMode,
    addAlert,
    archiveAlert,
    resolveAlert,
    dispatchSecurityTeam,
    broadcastPAAnnouncement,
    setGateDirection,
    setGateCapacityLimit,
    auditLogs,
    logAuditEvent
  } = useVenue();

  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [paModalOpen, setPaModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [evacConfirmed, setEvacConfirmed] = useState(false);
  const [sirenEnabled, setSirenEnabled] = useState(true);
  const [evacCountdown, setEvacCountdown] = useState(90);
  const [selectedAlert, setSelectedAlert] = useState(alerts[0] || null);
  const [dispatchForm, setDispatchForm] = useState({ count: 4, eta: "3 Mins", teamName: "Rapid Response Alpha" });
  const [paForm, setPaForm] = useState({ zone: "All Venue Zones", message: "Please move toward the nearest lower-density exit and follow marshal guidance." });
  const [alertForm, setAlertForm] = useState({ type: "Medical", severity: "warning", title: "", location: "", message: "" });
  const [pendingDismissals, setPendingDismissals] = useState([]);

  useEffect(() => {
    if (!selectedAlert && alerts.length > 0) {
      setSelectedAlert(alerts[0]);
    }
  }, [alerts, selectedAlert]);

  useEffect(() => {
    if (!isEmergencyMode || !evacConfirmed) {
      setEvacCountdown(90);
      return;
    }

    const timer = window.setInterval(() => {
      setEvacCountdown(previous => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isEmergencyMode, evacConfirmed]);

  const filteredAlerts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return alerts.filter(alert => {
      if (alert.status === "archived") return false;

      const matchesSeverity =
        severityFilter === "all" ||
        (severityFilter === "critical" && alert.severity === "danger") ||
        (severityFilter === "warning" && alert.severity === "warning") ||
        (severityFilter === "info" && alert.severity === "info") ||
        (severityFilter === "resolved" && alert.status === "resolved");

      const searchTarget = `${alert.title} ${alert.location} ${alert.message}`.toLowerCase();
      const matchesSearch = !query || searchTarget.includes(query);
      return matchesSeverity && matchesSearch;
    });
  }, [alerts, searchQuery, severityFilter]);

  const gates = activeVenue.nodes.filter(node => node.type === "gate" || node.type === "exit");
  const severityCardStyles = {
    slate: { wrapper: "bg-dark-800/80 border-slate-700 hover:border-slate-600", value: "text-white" },
    rose: { wrapper: "bg-rose-500/15 border-rose-500/40", value: "text-rose-300" },
    amber: { wrapper: "bg-amber-500/15 border-amber-500/40", value: "text-amber-300" },
    cyan: { wrapper: "bg-cyan-500/15 border-cyan-500/40", value: "text-cyan-300" },
    emerald: { wrapper: "bg-emerald-500/15 border-emerald-500/40", value: "text-emerald-300" }
  };

  const severityCards = [
    { key: "all", label: "All Alerts", count: alerts.filter(alert => alert.status !== "archived").length, color: "slate" },
    { key: "critical", label: "Critical (Red)", count: alerts.filter(alert => alert.severity === "danger" && alert.status !== "archived").length, color: "rose" },
    { key: "warning", label: "Warning (Yellow)", count: alerts.filter(alert => alert.severity === "warning" && alert.status !== "archived").length, color: "amber" },
    { key: "info", label: "Info (Blue)", count: alerts.filter(alert => alert.severity === "info" && alert.status !== "archived").length, color: "cyan" },
    { key: "resolved", label: "Resolved", count: alerts.filter(alert => alert.status === "resolved").length, color: "emerald" }
  ];

  const handleResolveAndArchive = (alert) => {
    setPendingDismissals(previous => [...previous, alert.id]);
    resolveAlert(alert.id);
    window.setTimeout(() => {
      archiveAlert(alert.id);
      setPendingDismissals(previous => previous.filter(id => id !== alert.id));
    }, 280);
  };

  const handleOpenDispatch = (alert) => {
    setSelectedAlert(alert);
    setDispatchForm({ count: 4, eta: "3 Mins", teamName: "Rapid Response Alpha" });
    setDispatchModalOpen(true);
  };

  const handleOpenPa = (alert) => {
    setSelectedAlert(alert);
    setPaModalOpen(true);
    setPaForm({
      zone: alert?.location || "All Venue Zones",
      message: "Please follow signage and move toward lower-density exits."
    });
  };

  const handleSubmitDispatch = () => {
    if (!selectedAlert) return;
    dispatchSecurityTeam({
      alertId: selectedAlert.id,
      count: Number(dispatchForm.count),
      eta: dispatchForm.eta,
      teamName: dispatchForm.teamName,
      location: selectedAlert.location
    });
    logAuditEvent("SECURITY", "Dispatch Dialog Confirmed", `Marshal dispatch confirmed for ${selectedAlert.location}`);
    setDispatchModalOpen(false);
  };

  const handleSubmitPa = () => {
    broadcastPAAnnouncement(paForm);
    setPaModalOpen(false);
  };

  const handleSubmitManualAlert = () => {
    addAlert({
      type: alertForm.type,
      severity: alertForm.severity,
      title: alertForm.title,
      location: alertForm.location,
      message: alertForm.message
    });
    setCreateModalOpen(false);
    setAlertForm({ type: "Medical", severity: "warning", title: "", location: "", message: "" });
  };

  const handleArmEvacuation = () => {
    if (!evacConfirmed) return;
    if (!isEmergencyMode) toggleEmergencyMode();
    setEvacCountdown(90);
    logAuditEvent("EMERGENCY", "Evacuation Console Armed", `Siren=${sirenEnabled ? "enabled" : "muted"}, countdown reset to 90 seconds`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">Alerts & Emergency Dispatch</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time warning notifications and manual gate lockdown triggers</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>

          <button
            onClick={toggleEmergencyMode}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border transition-all ${
              isEmergencyMode
                ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 animate-bounce"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyMode ? "Deactivate Evacuation Mode" : "Activate Evacuation Mode"}</span>
          </button>
        </div>
      </div>

      {/* Live Warning Notification Banner (Requested in Prompt) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-3">
          <BellRing className="w-5 h-5 text-amber-400 shrink-0" />
          <span>⚠ Gate 3 Congested. AI Recommendation: Redirect visitors to Exit 5 immediately.</span>
        </div>
        <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-black uppercase">LIVE ALERT</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {severityCards.map(card => (
          <button
            key={card.key}
            type="button"
            onClick={() => setSeverityFilter(card.key)}
            className={`p-4 rounded-2xl border text-left transition-all ${severityFilter === card.key ? severityCardStyles[card.color].wrapper : severityCardStyles.slate.wrapper}`}
          >
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{card.label}</div>
            <div className={`mt-2 text-2xl font-black ${severityCardStyles[card.color].value}`}>{card.count}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <label className="flex items-center gap-2 flex-1 px-4 py-3 rounded-2xl bg-dark-800 border border-slate-700 text-xs text-slate-300">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by gate or zone name"
            className="bg-transparent outline-none flex-1 placeholder:text-slate-500"
          />
        </label>

        <button
          type="button"
          onClick={() => setDispatchModalOpen(true)}
          className="px-4 py-3 rounded-2xl bg-dark-800 border border-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-cyan-400" />
          Dispatch Security Marshals
        </button>

        <button
          type="button"
          onClick={() => setPaModalOpen(true)}
          className="px-4 py-3 rounded-2xl bg-dark-800 border border-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          Broadcast PA Advisory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAlerts.map(alert => {
          const isPendingDismissal = pendingDismissals.includes(alert.id);
          const severityClass = alert.severity === "danger" ? "rose" : alert.severity === "warning" ? "amber" : "cyan";

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl glass-panel border transition-all duration-300 ${isPendingDismissal ? "opacity-0 translate-y-2 scale-[0.98]" : "opacity-100"} ${severityClass === "rose" ? "border-rose-500/30 bg-rose-950/20" : severityClass === "amber" ? "border-amber-500/30 bg-amber-950/20" : "border-cyan-500/30 bg-cyan-950/20"}`}
            >
              <div className="flex items-center justify-between mb-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${severityClass === "rose" ? "text-rose-400" : severityClass === "amber" ? "text-amber-400" : "text-cyan-400"}`}>{alert.title}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-700 text-slate-300">{alert.status}</span>
                </div>
                <AlertTriangle className={`w-4 h-4 ${severityClass === "rose" ? "text-rose-400" : severityClass === "amber" ? "text-amber-400" : "text-cyan-400"}`} />
              </div>
              <p className="text-sm font-bold text-white">{alert.location}</p>
              <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => handleOpenDispatch(alert)} className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-black border border-slate-700 text-slate-200">Dispatch Marshals</button>
                <button type="button" onClick={() => handleOpenPa(alert)} className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-black border border-slate-700 text-slate-200">PA Advisory</button>
                <button type="button" onClick={() => handleResolveAndArchive(alert)} className="px-3 py-2 rounded-xl bg-emerald-500/15 text-xs font-black border border-emerald-500/30 text-emerald-300">Resolve & Archive</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white font-heading">Manual Gate Control & Flow Direction</h3>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Live Override</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gates.map(gate => (
              <div key={gate.id} className="p-4 rounded-2xl bg-dark-800 border border-slate-700 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">{gate.label}</span>
                    <span className={`text-[10px] font-bold uppercase ${gate.isClosed ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {gate.isClosed ? 'CLOSED / LOCKED' : 'OPEN & CLEAR'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleGateStatus(gate.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                      gate.isClosed
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    {gate.isClosed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>

                <label className="block text-[11px] text-slate-400 font-semibold">
                  Direction Override
                  <select
                    value={gate.direction || (gate.isClosed ? "locked" : "two-way")}
                    onChange={(e) => setGateDirection(gate.id, e.target.value)}
                    className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="two-way">Two-Way</option>
                    <option value="entry-only">Entry-Only</option>
                    <option value="exit-only">Exit-Only</option>
                    <option value="locked">Locked</option>
                  </select>
                </label>

                <label className="block text-[11px] text-slate-400 font-semibold">
                  Capacity Limit
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={gate.maxCapacity}
                      onChange={(e) => setGateCapacityLimit(gate.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button type="button" onClick={() => setGateCapacityLimit(gate.id, gate.maxCapacity)} className="px-3 py-2 rounded-xl bg-cyan-500 text-black text-xs font-black">Apply</button>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-3xl border space-y-4 ${isEmergencyMode ? "bg-rose-950/30 border-rose-500/40" : "glass-panel border-slate-800"}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${isEmergencyMode ? "text-rose-400 animate-pulse" : "text-amber-400"}`} />
              Emergency Evacuation Dispatch Console
            </h3>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${isEmergencyMode ? "bg-rose-500/20 text-rose-300" : "bg-slate-800 text-slate-300"}`}>
              {isEmergencyMode ? "ACTIVE" : "STANDBY"}
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${isEmergencyMode ? "bg-rose-900/40 border-rose-500/40 animate-pulse" : "bg-dark-800 border-slate-700"}`}>
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Evacuation Countdown</span>
              <span className="font-black text-white">{Math.floor(evacCountdown / 60)}:{String(evacCountdown % 60).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 w-full h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(evacCountdown / 90) * 100}%` }}></div>
            </div>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              If you arm the console with safety confirmation, the timer will count down and the audit log records the emergency trigger.
            </p>
          </div>

          <label className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-dark-800 border border-slate-700 text-xs text-slate-300">
            <span className="flex items-center gap-2"><Volume2 className="w-4 h-4 text-cyan-400" /> Optional siren simulation</span>
            <input type="checkbox" checked={sirenEnabled} onChange={(e) => setSirenEnabled(e.target.checked)} />
          </label>

          <label className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-dark-800 border border-slate-700 text-xs text-slate-300">
            <span>Safety confirmation toggle</span>
            <input type="checkbox" checked={evacConfirmed} onChange={(e) => setEvacConfirmed(e.target.checked)} />
          </label>

          <button
            type="button"
            onClick={handleArmEvacuation}
            className="w-full px-4 py-3 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Arm Evacuation Dispatch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Live System Audit Log</h3>
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {auditLogs.slice(0, 10).map(entry => (
              <div key={entry.id} className="p-3 rounded-2xl bg-dark-800 border border-slate-700">
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-white">
                  <span>{entry.action}</span>
                  <span className="text-slate-400">{entry.timestamp}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{entry.details}</p>
                <span className="mt-2 inline-flex text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">{entry.category}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Alert Lifecycle Notes</h3>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>Resolved alerts stay visible long enough for the dismissal animation to complete, then move into the archived state for audit continuity.</p>
            <p>Security marshal dispatches, PA advisories, and emergency drills all land in the shared audit stream so the dashboard and alerts page stay in sync.</p>
            <p>Gate direction overrides and capacity limits update the active venue immediately, which keeps the AI risk view honest during a live demo.</p>
          </div>
        </div>
      </div>

      {dispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white font-heading">Dispatch Security Marshals</h3>
              <button type="button" onClick={() => setDispatchModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /> Target: {selectedAlert?.location || "Target gate"}</p>
              <label className="block text-xs font-semibold">
                Team name
                <input value={dispatchForm.teamName} onChange={(e) => setDispatchForm(prev => ({ ...prev, teamName: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold">
                  Marshal count
                  <input type="number" min="1" value={dispatchForm.count} onChange={(e) => setDispatchForm(prev => ({ ...prev, count: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
                </label>
                <label className="block text-xs font-semibold">
                  ETA
                  <input value={dispatchForm.eta} onChange={(e) => setDispatchForm(prev => ({ ...prev, eta: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
                </label>
              </div>
              <button type="button" onClick={handleSubmitDispatch} className="w-full rounded-2xl bg-cyan-500 text-black py-3 font-black text-xs uppercase tracking-wider">Confirm Dispatch</button>
            </div>
          </div>
        </div>
      )}

      {paModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white font-heading">Broadcast PA Advisory</h3>
              <button type="button" onClick={() => setPaModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <label className="block text-xs font-semibold">
                Zone
                <input value={paForm.zone} onChange={(e) => setPaForm(prev => ({ ...prev, zone: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
              </label>
              <label className="block text-xs font-semibold">
                Message
                <textarea value={paForm.message} onChange={(e) => setPaForm(prev => ({ ...prev, message: e.target.value }))} rows="4" className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
              </label>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                {[
                  "Please move toward the nearest exit.",
                  "Follow the marshal team instructions.",
                  "Keep the central corridor clear."
                ].map(preset => (
                  <button key={preset} type="button" onClick={() => setPaForm(prev => ({ ...prev, message: preset }))} className="px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-300">{preset}</button>
                ))}
              </div>
              <button type="button" onClick={handleSubmitPa} className="w-full rounded-2xl bg-amber-500 text-black py-3 font-black text-xs uppercase tracking-wider">Send Advisory</button>
            </div>
          </div>
        </div>
      )}

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-rose-500/30 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white font-heading">Create Manual Alert</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <label className="block font-semibold">
                Type
                <select value={alertForm.type} onChange={(e) => setAlertForm(prev => ({ ...prev, type: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white">
                  <option>Medical</option>
                  <option>Security</option>
                  <option>Maintenance</option>
                </select>
              </label>
              <label className="block font-semibold">
                Severity
                <select value={alertForm.severity} onChange={(e) => setAlertForm(prev => ({ ...prev, severity: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white">
                  <option value="danger">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </label>
            </div>
            <label className="block text-xs font-semibold text-slate-300">
              Title
              <input value={alertForm.title} onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              Location
              <input value={alertForm.location} onChange={(e) => setAlertForm(prev => ({ ...prev, location: e.target.value }))} className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              Message
              <textarea value={alertForm.message} onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))} rows="4" className="mt-1 w-full rounded-xl bg-dark-800 border border-slate-700 px-3 py-2 text-white" />
            </label>
            <button type="button" onClick={handleSubmitManualAlert} className="w-full rounded-2xl bg-rose-500 text-black py-3 font-black text-xs uppercase tracking-wider">Create Alert</button>
          </div>
        </div>
      )}
    </div>
  );
}

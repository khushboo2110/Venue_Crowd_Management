import React from "react";

export default function StatCard({ title, value, icon: Icon, subtext, trend, color = "cyan" }) {
  const colorStyles = {
    cyan: "border-cyan-500/20 text-cyan-400 bg-cyan-500/5",
    emerald: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
    amber: "border-amber-500/20 text-amber-400 bg-amber-500/5",
    rose: "border-rose-500/20 text-rose-400 bg-rose-500/5",
    purple: "border-purple-500/20 text-purple-400 bg-purple-500/5"
  };

  return (
    <div className={`p-5 rounded-2xl glass-panel glass-panel-hover border ${colorStyles[color] || colorStyles.cyan}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight">
          {value}
        </h3>
        {subtext && (
          <p className="mt-1 text-xs text-slate-400 flex items-center justify-between">
            <span>{subtext}</span>
            {trend && (
              <span className={`font-semibold ${trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {trend}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

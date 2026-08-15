import React from "react";

export default function StatCard({ title, value, icon: Icon, subtext, trend, color = "cyan" }) {
  const colorHoverStyles = {
    cyan: "hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-cyan-500/10 text-cyan-400",
    emerald: "hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-emerald-500/10 text-emerald-400",
    amber: "hover:border-amber-500/50 hover:bg-amber-500/10 hover:shadow-amber-500/10 text-amber-400",
    rose: "hover:border-rose-500/50 hover:bg-rose-500/10 hover:shadow-rose-500/10 text-rose-400",
    purple: "hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-purple-500/10 text-purple-400"
  };

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/80 border border-slate-800 transition-all duration-200 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl ${colorHoverStyles[color] || colorHoverStyles.cyan}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80">
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

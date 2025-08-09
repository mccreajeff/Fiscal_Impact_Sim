import React from "react"
import ResultChart from "./ResultChart";
import { fmtUSD } from "../lib/format"

export default function ResultsPanel({ 
    data,
    isPending,
    isError,
    error
}) {
  // removed: if (isPending) return (...) to avoid layout swap

  if (isError)
    return (
      <section className="card p-6">
        <p className="text-rose-600 font-medium">Error</p>
        <p className="text-sm text-app-muted">
          {error?.message || "Unknown error"}
        </p>
      </section>
    );
  if (!data)
    return (
      <section className="card p-6 flex items-center justify-center text-center text-app-muted">
        Adjust controls and click&nbsp;
        <b className="text-app-text">Run Simulation</b>.
      </section>
    );

  const { revenue, spending, deficit, assumptions } = data;

  return (
    <div className="space-y-6">
      {/* Chart box (top) with stable height; no overlay */}
      <section className="relative card p-4 h-[420px] md:h-[480px]">
        <ResultChart revenue={revenue} spending={spending} />
      </section>

      {/* KPI grid (no outer box) */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPI title="Revenue" value={fmtUSD(revenue)} />
        <KPI title="Total Spending" value={fmtUSD(spending.total)} />
        <KPI
          title="Deficit / Surplus"
          value={fmtUSD(deficit)}
          positive={deficit >= 0}
        />
      </div>

      {/* Other info box (bottom) */}
      <section className="card p-6 space-y-6">
        {/* Category breakdown */}
        <div className="grid gap-2 md:grid-cols-2">
          {["health", "defense", "education", "other"].map((k) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="capitalize">{k}</span>
              <span>{fmtUSD(spending[k])}</span>
            </div>
          ))}
        </div>

        {/* Assumptions */}
        <details className="text-xs open:mb-2">
          <summary className="cursor-pointer font-medium">Assumptions</summary>
          <pre className="mt-2 bg-app-bg p-3 rounded font-mono">
{JSON.stringify(assumptions, null, 2)}
          </pre>
        </details>
      </section>
    </div>
  );
}

function KPI({ title, value, positive }) {
  const color =
    positive === undefined
      ? "text-app-text"
      : positive
      ? "text-emerald-600"
      : "text-rose-600";

  return (
    <div className="card p-4 flex flex-col">
      <span className="text-xs text-app-muted">{title}</span>
      <span className={`text-xl font-bold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
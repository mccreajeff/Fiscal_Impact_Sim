import React from "react";
import { fmtUSD } from "../lib/format";

export default function ResultsPanel({ 
    data,               // SimResult object
    isPending,          // boolean, status of simulation
    isError,            // boolean, error in simulation
    error               // error object
}) {
  if (isPending)
    return (
      <section className="rounded-xl border p-6 bg-white dark:bg-slate-800 flex items-center justify-center">
        <span className="animate-pulse text-slate-500">Computing…</span>
      </section>
    );
  if (isError)
    return (
      <section className="rounded-xl border p-6 bg-white dark:bg-slate-800">
        <p className="text-rose-600 font-medium">Error</p>
        <p className="text-sm text-slate-600">
          {error?.message || "Unknown error"}
        </p>
      </section>
    );
  if (!data)
    return (
      <section className="rounded-xl border p-6 bg-white dark:bg-slate-800 flex items-center justify-center text-center text-slate-500">
        Adjust controls and click&nbsp;
        <b className="text-slate-700 dark:text-slate-300">Run Simulation</b>.
      </section>
    );

  const { revenue, spending, deficit, assumptions } = data;

  return (
    <section className="rounded-xl border p-6 bg-white dark:bg-slate-800 space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPI title="Revenue" value={fmtUSD(revenue)} />
        <KPI title="Total Spending" value={fmtUSD(spending.total)} />
        <KPI
          title="Deficit / Surplus"
          value={fmtUSD(deficit)}
          positive={deficit >= 0}
        />
      </div>

      {/* Category breakdown */}
      <div className="grid gap-2 md:grid-cols-2">
        {["health", "defense", "education", "other"].map((k) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="capitalize">{k}</span>
            <span>{fmtUSD(spending[k])}</span>
          </div>
        ))}
      </div>
      <details className="text-xs open:mb-2">
        <summary className="cursor-pointer font-medium">Assumptions</summary>
        <pre className="mt-2 bg-slate-100 dark:bg-slate-700 p-3 rounded">
{JSON.stringify(assumptions, null, 2)}
        </pre>
      </details>
    </section>
  );
}

function KPI({ title, value, positive }) {
  const color =
    positive === undefined
      ? "text-slate-800 dark:text-slate-100"
      : positive
      ? "text-emerald-600"
      : "text-rose-600";

  return (
    <div className="rounded-md border p-4 flex flex-col">
      <span className="text-xs text-slate-500">{title}</span>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
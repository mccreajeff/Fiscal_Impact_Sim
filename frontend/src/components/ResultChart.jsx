import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { fmtUSD, fmtCompactUSD } from "../lib/format";

export default function ResultChart({ revenue, spending }) {
  // Failsafe if backend ever returns null/undefined
  const h = Number(spending?.health ?? 0);
  const d = Number(spending?.defense ?? 0);
  const e = Number(spending?.education ?? 0);
  const o = Number(spending?.other ?? 0);

  const data = [
    {
      name: "Budget",
      Revenue: Number(revenue ?? 0),
      Health: h,
      Defense: d,
      Education: e,
      Other: o,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} />
        <YAxis
          tickFormatter={(v) => fmtCompactUSD(v).replace("$", "")}
          width={70}
          tickLine={false}
        />
        <Tooltip formatter={(v) => fmtUSD(v)} />
        <Legend />

        {/* Revenue: single bar */}
        <Bar dataKey="Revenue" radius={[4, 4, 0, 0]} fill="#6366f1" />

        {/* Spending: stacked categories */}
        <Bar dataKey="Health"    stackId="sp" fill="#14b8a6" />
        <Bar dataKey="Defense"   stackId="sp" fill="#38bdf8" />
        <Bar dataKey="Education" stackId="sp" fill="#fbbf24" />
        <Bar dataKey="Other"     stackId="sp" fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  );
}

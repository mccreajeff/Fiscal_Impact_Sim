import React, { useMemo, memo } from "react";
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

function ResultChart({ revenue, spending }) {
  // Failsafe if backend ever returns null/undefined
  const h = Number(spending?.health ?? 0);
  const d = Number(spending?.defense ?? 0);
  const e = Number(spending?.education ?? 0);
  const o = Number(spending?.other ?? 0);

  const data = useMemo(
    () => [
      {
        name: "Budget",
        Revenue: Number(revenue ?? 0),
        Health: h,
        Defense: d,
        Education: e,
        Other: o,
      },
    ],
    [revenue, h, d, e, o]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} />
        <YAxis width={72} tickLine={false} tickFormatter={fmtCompactUSD} />
        <Tooltip formatter={(v) => fmtUSD(v)} />
        <Legend />

        {/* Revenue: single bar */}
        <Bar dataKey="Revenue" radius={[4, 4, 0, 0]} fill="#6366f1" isAnimationActive={false} />

        {/* Spending: stacked categories */}
        <Bar dataKey="Health"    stackId="sp" fill="#14b8a6" isAnimationActive={false} />
        <Bar dataKey="Defense"   stackId="sp" fill="#38bdf8" isAnimationActive={false} />
        <Bar dataKey="Education" stackId="sp" fill="#fbbf24" isAnimationActive={false} />
        <Bar dataKey="Other"     stackId="sp" fill="#f87171" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default memo(ResultChart);

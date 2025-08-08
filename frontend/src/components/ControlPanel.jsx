import React from 'react'

import { useForm, Controller} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { simRequestSchema } from "../lib/schema"

export default function ControlPanel({
  disabled,               // boolean - disable controls if true
  defaultValues,          // defined in scehma.js
  taxRateRange,           // [min, max]
  deltaRange,             // [min, max]
  onRun,                  // enable or disable autorun
}) {
  
  const {
    control,
    handleSubmit,
    reset,
    formState: {isValid},
  } = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(simRequestSchema),
    mode: "onChange",
  });

  return (
    <aside
      className={`rounded-xl border bg-white dark:bg-slate-800 p-4 space-y-6 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {/* ───────── Tax Rate ───────── */}
      <section className="space-y-2">
        <label className="block font-medium text-sm">Tax&nbsp;Rate&nbsp;(%)</label>

        <Controller
          name="taxRate"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              {/* slider */}
              <input
                type="range"
                min={taxRateRange[0]}
                max={taxRateRange[1]}
                step="0.1"
                value={field.value}
                onChange={(e) => field.onChange(+e.target.value)}
                className="flex-1 cursor-pointer accent-indigo-600"
              />
              {/* number box */}
              <input
                type="number"
                min={taxRateRange[0]}
                max={taxRateRange[1]}
                step="0.1"
                value={field.value}
                onChange={(e) =>
                  field.onChange(
                    Math.min(
                      taxRateRange[1],
                      Math.max(taxRateRange[0], +e.target.value)
                    )
                  )
                }
                className="w-20 rounded-md border px-2 py-1"
              />
            </div>
          )}
        />

        <p className="text-xs text-slate-500">
          Overall average tax rate ({taxRateRange[0]}–{taxRateRange[1]} %).
        </p>
      </section>

      {/* ───────── Spending Adjustments ───────── */}
      <section className="space-y-2">
        <label className="block font-medium text-sm">
          Spending Adjustments&nbsp;(%)
        </label>

        {["health", "defense", "education"].map((cat) => (
          <Controller
            key={cat}
            name={`spendAdjustments.${cat}`}
            control={control}
            render={({ field }) => {
              const percent = Math.round((Number(field.value) || 0) * 100);
              const minP = Math.round(deltaRange[0] * 100);
              const maxP = Math.round(deltaRange[1] * 100);
              const clampP = (p) => Math.max(minP, Math.min(maxP, p));
              return (
                <div className="grid grid-cols-[90px_auto_auto_auto_auto] items-center gap-2">
                  <span className="capitalize text-sm">{cat}</span>

                  {/* – button (1 percentage point) */}
                  <button
                    type="button"
                    className="border rounded px-1"
                    onClick={() => field.onChange(clampP(percent - 1) / 100)}
                  >
                    –
                  </button>

                  {/* number input (percent-based) */}
                  <input
                    type="number"
                    step="1"
                    min={minP}
                    max={maxP}
                    value={percent}
                    onChange={(e) => {
                      const p = clampP(+e.target.value || 0);
                      field.onChange(p / 100);
                    }}
                    onBlur={() => field.onChange(clampP(percent) / 100)}
                    className="w-24 rounded-md border px-2 py-1"
                  />

                  {/* + button (1 percentage point) */}
                  <button
                    type="button"
                    className="border rounded px-1"
                    onClick={() => field.onChange(clampP(percent + 1) / 100)}
                  >
                    +
                  </button>

                  {/* % badge */}
                  <span className="text-xs text-slate-600">
                    {(field.value >= 0 ? "+" : "") + percent}%
                  </span>
                </div>
              );
            }}
          />
        ))}

        <p className="text-xs text-slate-500">
          Percent {(deltaRange[0] * 100).toFixed(0)} … {(deltaRange[1] * 100).toFixed(0)}&nbsp;&nbsp;(3 = +3 %, −10 = −10 %).
        </p>
      </section>

      {/* ───────── Actions ───────── */}
      <section className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit(onRun)}
          disabled={disabled || !isValid}
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-40"
        >
          Run Simulation
        </button>

        <button
          type="button"
          onClick={() => reset(defaultValues)}
          className="text-sm underline"
        >
          Reset All
        </button>
      </section>
    </aside>    
  );
}

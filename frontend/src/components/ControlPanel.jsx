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
          Spending Adjustments&nbsp;(fraction)
        </label>

        {["health", "defense", "education"].map((cat) => (
          <Controller
            key={cat}
            name={`spendAdjustments.${cat}`}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-[90px_auto_auto_auto_auto] items-center gap-2">
                <span className="capitalize text-sm">{cat}</span>

                {/* – button */}
                <button
                  type="button"
                  className="border rounded px-1"
                  onClick={() =>
                    field.onChange(
                      Math.max(
                        deltaRange[0],
                        +(field.value - 0.01).toFixed(2)
                      )
                    )
                  }
                >
                  –
                </button>

                {/* number input */}
                <input
                  type="number"
                  step="0.01"
                  min={deltaRange[0]}
                  max={deltaRange[1]}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      Math.max(
                        deltaRange[0],
                        Math.min(deltaRange[1], +e.target.value)
                      )
                    )
                  }
                  onBlur={() =>
                    field.onChange(+parseFloat(field.value).toFixed(2))
                  }
                  className="w-24 rounded-md border px-2 py-1"
                />

                {/* + button */}
                <button
                  type="button"
                  className="border rounded px-1"
                  onClick={() =>
                    field.onChange(
                      Math.min(
                        deltaRange[1],
                        +(field.value + 0.01).toFixed(2)
                      )
                    )
                  }
                >
                  +
                </button>

                {/* % badge */}
                <span className="text-xs text-slate-600">
                  {(field.value >= 0 ? "+" : "") +
                    (field.value * 100).toFixed(0)}
                  %
                </span>
              </div>
            )}
          />
        ))}

        <p className="text-xs text-slate-500">
          Fractions −1.00 … +1.00&nbsp;&nbsp;(0.03 = +3 %, −0.10 = −10 %).
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

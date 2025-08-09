import React, { useEffect, useRef, useState } from 'react'

import { useForm, Controller} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { simRequestSchema } from "../lib/schema"

export default function ControlPanel({
  disabled,               // boolean - disable controls if true
  defaultValues,          // defined in scehma.js
  taxRateRange,           // [min, max]
  deltaRange,             // [min, max]
  onRun,                  // enable or disable autorun
  enableAutoRunDefault = false, // new: enable auto-run once baseline is loaded
}) {
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: {isValid},
  } = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(simRequestSchema),
    mode: "onChange",
  });

// --- Auto-run additions ---
  const [autoRun, setAutoRun] = useState(false);
  const didMount = useRef(false);
  const lastPayloadRef = useRef(null);
  const watched = watch([
    "taxRate",
    "spendAdjustments.health",
    "spendAdjustments.defense",
    "spendAdjustments.education",
  ]);

  // Turn on auto-run once when requested (e.g., when baseline finishes loading)
  const didInitAutoRunFromProp = useRef(false);
  useEffect(() => {
    if (enableAutoRunDefault && !didInitAutoRunFromProp.current) {
      setAutoRun(true);
      didInitAutoRunFromProp.current = true;
    }
  }, [enableAutoRunDefault]);

  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    if (!autoRun || disabled || !isValid) return;
    const t = setTimeout(() => {
      const payload = getValues();
      const serialized = JSON.stringify(payload);
      if (lastPayloadRef.current === serialized) return;
      lastPayloadRef.current = serialized;
      handleSubmit(onRun)();
    }, 350); // was 300ms
    return () => clearTimeout(t);
  }, [watched, autoRun, disabled, isValid, getValues, handleSubmit, onRun]);
// --- End auto-run additions ---

  return (
    <aside
      className={`self-start h-fit card p-4 space-y-6 ${
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
              {/* slider (unchanged) */}
              <input
                type="range"
                min={taxRateRange[0]}
                max={taxRateRange[1]}
                step="0.1"
                value={field.value}
                onChange={(e) => field.onChange(+e.target.value)}
                className="flex-1 cursor-pointer accent-indigo-600"
              />
              {/* percent text input showing e.g. 25% */}
              <input
                type="text"
                inputMode="decimal"
                value={
                  field.value === '' || field.value === null || isNaN(field.value)
                    ? ''
                    : `${field.value}%`
                }
                placeholder="0%"
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  if (raw === '') {
                    field.onChange('');
                    return;
                  }
                  let num = parseFloat(raw);
                  if (isNaN(num)) num = taxRateRange[0];
                  num = Math.min(taxRateRange[1], Math.max(taxRateRange[0], num));
                  field.onChange(num);
                }}
                onBlur={() => {
                  // ensure number (0 if blank)
                  if (field.value === '' || field.value === null || isNaN(field.value))
                    field.onChange(taxRateRange[0]);
                }}
                className="input w-16 text-right"
              />
            </div>
          )}
        />

        <p className="text-xs text-app-muted">
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
                <div className="grid grid-cols-[90px_70px_1fr] items-center gap-2">
                  {/* Label */}
                    <span className="capitalize text-sm">{cat}</span>

                  {/* Percent text input */}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={`${percent}%`}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9-]/g, '');
                      if (raw === '' || raw === '-') {
                        field.onChange(0);
                        return;
                      }
                      let p = parseInt(raw, 10);
                      if (isNaN(p)) p = 0;
                      p = clampP(p);
                      field.onChange(p / 100);
                    }}
                    onBlur={() => field.onChange(clampP(percent) / 100)}
                    className="input w-[8.5ch] text-right"
                  />

                  {/* Slider (percent-based) */}
                  <input
                    type="range"
                    min={minP}
                    max={maxP}
                    step={1}
                    value={percent}
                    onChange={(e) => {
                      const p = clampP(+e.target.value);
                      field.onChange(p / 100);
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              );
            }}
          />
        ))}
      </section>

      {/* ───────── Actions ───────── */}
      <section className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit(onRun)}
          disabled={disabled || !isValid}
          className="btn-primary disabled:opacity-40"
        >
          Run Simulation
        </button>

        <button
          type="button"
          onClick={() => reset(defaultValues)}
          className="btn-secondary"
        >
          Reset All
        </button>

        <label className="ml-auto flex items-center gap-1 text-xs select-none">
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
          Auto-run on change
        </label>
      </section>
    </aside>    
  );
}

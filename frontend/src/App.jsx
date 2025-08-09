import { useEffect, useState } from 'react'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'

import { getMetadata, postSimulate  } from './lib/api'
import { defaultValues } from "./lib/schema"
import { queryClient } from "./lib/queryClient"

import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ControlPanel from './components/ControlPanel'
import ResultsPanel from './components/ResultsPanel'

const apiBase = import.meta.env.VITE_API_BASE

// light and dark theme hook
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // Apply class + persist
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

// Main app
function AppInner() {
  /* Theme */
  const [theme, toggleTheme] = useTheme();

  /* Metadata query */
  const meta = useQuery({ queryKey: ["meta"], queryFn: getMetadata });
  const controlsDisabled = meta.isLoading || !meta.data?.baselineLoaded;

  const [lastRunIso, setLastRunIso] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const simulate = useMutation({
    mutationFn: postSimulate,
    onSuccess: (data) => {
      setLastRunIso(new Date().toISOString());
      setLastResult(data);
    },
  });

  /* Fallbacks until meta loads) */
  const taxRateRange = meta.data?.taxRateRange ?? [0, 50];
  const deltaRange   = meta.data?.deltaRange   ?? [-1, 1];

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors flex flex-col">
      {/* ── HEADER ── */}
      <Header
        title="Fiscal Impact Simulator"
        onToggleTheme={toggleTheme}
        isDark={theme === "dark"}
      />

      {/* ── MAIN GRID ── */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-6 grid gap-6 md:grid-cols-[360px_1fr]">
        {/* Controls */}
        <ControlPanel
          disabled={controlsDisabled || simulate.isPending}
          defaultValues={defaultValues}
          taxRateRange={taxRateRange}
          deltaRange={deltaRange}
          onRun={(values) => simulate.mutate(values)}
        />

        {/* Results */}
        <ResultsPanel
          data={simulate.data ?? lastResult}
          isPending={simulate.isPending}
          isError={simulate.isError}
          error={simulate.error}
        />
      </main>

      {/* ── FOOTER ── */}
      <Footer
        baselineLoaded={!!meta.data?.baselineLoaded}
        version={meta.data?.version}
        apiBase={apiBase}
        lastRunIso={lastRunIso}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

